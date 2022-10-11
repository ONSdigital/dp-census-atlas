import { get } from "svelte/store";
import { page } from "$app/stores";
import mapboxgl, { GeoJSONSource, Map } from "mapbox-gl";
import { fromEvent, merge } from "rxjs";
import { delay, throttleTime } from "rxjs/operators";
import type { GeoType } from "../types";
import { vizStore, mapStore, selectedGeographyStore, preventFlyToGeographyStore } from "../stores/stores";
import { englandAndWalesBbox, preventFlyToGeography } from "../helpers/geographyHelper";
import { selectGeography } from "../helpers/navigationHelper";
import { initMapLayers } from "./initMapLayers";
import { renderMapViz } from "./renderMapViz";
import { layers } from "./layers";
import { style } from "./style";

export const defaultZoom = 6;
export const maxAllowedZoom = 16;
export const maxBounds: mapboxgl.LngLatBoundsLike = [-9, 47, 4, 61];

/** Configure the map's properties and subscribe to its events. */
export const initMap = (container) => {
  const map = new Map({
    container,
    style,
    center: new mapboxgl.LngLatBounds(englandAndWalesBbox).getCenter(),
    zoom: defaultZoom,
    maxZoom: maxAllowedZoom - 0.001, // prevent layers from disappearing at absolute max zoom
    maxBounds
  });

  map.addControl(new mapboxgl.NavigationControl({ showCompass: false }));

  map.on("load", () => {
    initMapLayers(map);
    initSelectedGeographyLayers(map);
  });

  fromEvent(map, "load")
    .pipe(
      delay(1000), // leave some time between base layer and viz to avoid "flash" of base layer on first load
    )
    .subscribe(() => {
      vizStore.subscribe((value) => {
        renderMapViz(map, value);
      });
      setMapStoreAndLayerVisibility(map);
      listenToSelectedGeographyStore(map);
    });

  merge(fromEvent(map, "move"), fromEvent(map, "zoom"))
    .pipe(
      throttleTime(1000, undefined, { leading: false, trailing: true }), // don't discard the final movement
    )
    .subscribe(() => {
      setMapStoreAndLayerVisibility(map);
    });

  layers.forEach((l) => {
    map.on("click", `${l.name}-features`, (e) => {
      const geoCode = e.features[0].properties[l.idProperty];
      preventFlyToGeography(geoCode);
      selectGeography(get(page).url.searchParams, { geoType: l.name, geoCode });
    });
  });

  return map;
};

const setMapStoreAndLayerVisibility = (map: mapboxgl.Map) => {
  const b = map.getBounds();
  const bbox = { east: b.getEast(), north: b.getNorth(), west: b.getWest(), south: b.getSouth() };
  const zoom = map.getZoom();
  const geoType = getGeoTypeForFeatureDensity(map);

  setMapLayerVisibility(map, geoType);

  mapStore.set({
    bbox,
    geoType: geoType,
    zoom: zoom,
  });
};

const getGeoTypeForFeatureDensity = (map: mapboxgl.Map): GeoType => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore (queryRenderedFeatures typings appear to be wrong)
  const features = map.queryRenderedFeatures({ layers: ["centroids"] });
  if (Array.isArray(features)) {
    // Get the available geotypes for the dataset
    const available_geotypes = get(vizStore)?.params?.variable?.available_geotypes || ["lad", "msoa", "oa"];
    // Get the preferred geotype based on the density of features on the map
    const count = features.length;
    const canvas = map.getCanvas();
    const pixelArea = canvas.clientWidth * canvas.clientHeight;
    const geotype = (count * 1e6) / pixelArea > 40 ? "lad" : (count * 1e6) / pixelArea > 3 ? "msoa" : "oa";
    // If the preferred geotype is available, then return it. Otherwise return the most granular available
    if (available_geotypes.includes(geotype)) {
      return geotype;
    } else {
      return available_geotypes[available_geotypes.length - 1];
    }
  }
};

const setMapLayerVisibility = (map: mapboxgl.Map, geoType: GeoType) => {
  layers.forEach((l) => {
    // set layer visibility based on geoType (always keep lad-outlines visible)
    map.setLayoutProperty(`${l.name}-features`, "visibility", l.name == geoType ? "visible" : "none");
    map.setLayoutProperty(
      `${l.name}-outlines`,
      "visibility",
      l.name === geoType || l.name === "lad" ? "visible" : "none",
    );
    // make lines thicker for lad-outlines when OAs or MSOAs visible
    const lineWidthStyle =
      geoType === "lad"
        ? ["case", ["==", ["feature-state", "selected"], true], 3, ["==", ["feature-state", "hovered"], true], 2, 0.5]
        : 1.5;
    map.setPaintProperty("lad-outlines", "line-width", lineWidthStyle);
  });
};

const listenToSelectedGeographyStore = (map: mapboxgl.Map) => {
  selectedGeographyStore.subscribe((geography) => {
    if (geography && map.isStyleLoaded()) {
      if (geography.geoType === "ew") {
        // do we want to reset the map view?
        map.setZoom(defaultZoom);
        map.setCenter(new mapboxgl.LngLatBounds(englandAndWalesBbox).getCenter());
      } else {
        const bounds = new mapboxgl.LngLatBounds(geography.bbox);
        const source = map.getSource("selected-geography") as GeoJSONSource;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore the types here are useless
        source.setData(geography.boundary);
        // console.log("preventFlyToGeographyStore", get(preventFlyToGeographyStore));
        // console.log("geography", geography.geoCode);
        if (geography.geoCode !== get(preventFlyToGeographyStore)) {
          map.fitBounds(bounds, { padding: 300, animate: false });
          preventFlyToGeographyStore.set(undefined);
        }
      }
    }
  });
};

const initSelectedGeographyLayers = (map: mapboxgl.Map) => {
  map.addSource("selected-geography", {
    type: "geojson",
    data: {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [],
      },
    },
  });
  map.addLayer({
    id: "selected-geography-outline",
    type: "line",
    source: "selected-geography",
    layout: {},
    paint: {
      "line-color": "#000",
      "line-width": 3,
    },
  });
};
