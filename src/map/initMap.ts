import { get } from "svelte/store";
import { page } from "$app/stores";
import mapboxgl, { GeoJSONSource, Map } from "mapbox-gl";
import { fromEvent, merge } from "rxjs";
import { throttleTime } from "rxjs/operators";
import type { GeoType, GeographyInfo } from "../types";
import { geography } from "../stores/geography";
import { englandAndWalesBbox, preventFlyToGeography } from "../helpers/geographyHelper";
import { selectGeography } from "../helpers/navigationHelper";
import { initMapLayers } from "./initMapLayers";
import { renderMapViz } from "./renderMapViz";
import { layers } from "./layers";
import { style } from "./style";
import { viewport } from "../stores/viewport";
import { viz } from "../stores/viz";
import { preventFlyToGeographyStore } from "../stores/flyto";

const defaultZoom = 6;
const maxAllowedZoom = 16;

/** Configure the map's properties and subscribe to its events. */
export const initMap = (container: HTMLElement) => {
  const map = new Map({
    container,
    style,
    zoom: defaultZoom, // inexplicably necessary (even though we fitBounds next)
    maxZoom: maxAllowedZoom - 0.001, // prevent layers from disappearing at absolute max zoom
  });

  setPosition(map);
  map.addControl(new mapboxgl.NavigationControl({ showCompass: false }));

  map.on("load", () => {
    initMapLayers(map, get(geography));
    viz.subscribe((value) => {
      renderMapViz(map, value);
    });
    geography.subscribe((geography) => {
      listenToSelectedGeographyStore(map, geography);
    });
  });

  merge(fromEvent(map, "load"), fromEvent(map, "move"))
    .pipe(
      throttleTime(1000, undefined, { leading: false, trailing: true }), // don't discard the final movement
    )
    .subscribe(() => {
      setViewportStoreAndLayerVisibility(map);
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

const setViewportStoreAndLayerVisibility = (map: mapboxgl.Map) => {
  const b = map.getBounds();
  const bbox = { east: b.getEast(), north: b.getNorth(), west: b.getWest(), south: b.getSouth() };
  const geoType = getGeoTypeForFeatureDensity(map);

  setMapLayerVisibility(map, geoType);

  viewport.set({
    bbox,
    geoType: geoType,
  });
};

const getGeoTypeForFeatureDensity = (map: mapboxgl.Map): GeoType => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore (queryRenderedFeatures typings appear to be wrong)
  const features = map.queryRenderedFeatures({ layers: ["centroids"] });
  if (Array.isArray(features)) {
    const count = features.length;
    const canvas = map.getCanvas();
    const pixelArea = canvas.clientWidth * canvas.clientHeight;
    return (count * 1e6) / pixelArea > 40 ? "lad" : (count * 1e6) / pixelArea > 3 ? "msoa" : "oa";
  } else {
    return "lad";
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

const listenToSelectedGeographyStore = (map: mapboxgl.Map, geography: GeographyInfo) => {
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
};

const setPosition = (map: mapboxgl.Map, animate = false) => {
  const g = get(geography);
  if (g.geoType === "ew") {
    const bounds = new mapboxgl.LngLatBounds(englandAndWalesBbox);
    map.fitBounds(bounds, { padding: 0, animate });
  } else {
    const bounds = new mapboxgl.LngLatBounds(g.bbox);
    map.fitBounds(bounds, { padding: 200, animate }); // todo: we want padding to be adaptive to screen size!
  }
};
