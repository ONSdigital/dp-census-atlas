import { get } from "svelte/store";
import mapboxgl, { GeoJSONSource, Map } from "mapbox-gl";
import { fromEvent, merge } from "rxjs";
import { delay, throttleTime } from "rxjs/operators";
import type { GeoType } from "../types";
import { vizStore, mapStore, selectedGeographyStore, preventFlyToGeographyStore } from "../stores/stores";
import { englandAndWalesBbox, preventFlyToGeography, selectGeography } from "../helpers/geographyHelper";
import { initMapLayers } from "./initMapLayers";
import { renderMapViz } from "./renderMapViz";
import { layers, layersWithSiblings } from "./layers";
import { style } from "./style";

export const defaultZoom = 6;
export const maxAllowedZoom = 16;

/** Configure the map's properties and subscribe to its events. */
export const initMap = (container) => {
  const map = new Map({
    container,
    style,
    center: new mapboxgl.LngLatBounds(englandAndWalesBbox).getCenter(),
    zoom: defaultZoom,
    maxZoom: maxAllowedZoom - 0.001, // prevent layers from disappearing at absolute max zoom
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
      setMapStore(map);
      listenToSelectedGeographyStore(map);
    });

  merge(fromEvent(map, "move"), fromEvent(map, "zoom"))
    .pipe(
      throttleTime(1000, undefined, { leading: false, trailing: true }), // don't discard the final movement
    )
    .subscribe(() => {
      setMapStore(map);
    });

  layers.forEach((l) => {
    map.on("click", `${l.name}-features`, (e) => {
      const geoCode = e.features[0].properties[l.idProperty];
      preventFlyToGeography(geoCode);
      selectGeography({ geoType: l.name, geoCode });
    });
  });

  return map;
};

const setMapStore = (map: mapboxgl.Map) => {
  const b = map.getBounds();
  const bbox = { east: b.getEast(), north: b.getNorth(), west: b.getWest(), south: b.getSouth() };
  const zoom = map.getZoom();

  mapStore.set({
    bbox,
    geoType: getGeoTypeForCurrentZoom(zoom),
    zoom: zoom,
  });
};

const getGeoTypeForCurrentZoom = (zoom: number): GeoType => {
  for (const x of layersWithSiblings()) {
    if (zoom >= x.layer.minZoom && (!x.next || zoom < x.next.minZoom)) {
      return x.layer.name;
    }
  }
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
