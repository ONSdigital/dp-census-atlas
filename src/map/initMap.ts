import mapboxgl, { Map } from "mapbox-gl";
import { fromEvent, merge } from "rxjs";
import { delay, throttleTime } from "rxjs/operators";
import type { GeoType } from "../types";
import { vizStore, mapStore, selectedGeographyStore } from "../stores/stores";
import { handleLocationSelect } from "../helpers/locationSelectHelper";
import { englandAndWales } from "../helpers/spatialHelper";
import { initMapLayers } from "./initMapLayers";
import { renderMapViz } from "./renderMapViz";
import { layers, layersWithSiblings } from "./layers";

mapboxgl.accessToken = "pk.eyJ1Ijoic3Vtb3RoZWNhdCIsImEiOiJjaWxocngyanYwMDY4dmprcTg4ODN2Z3B2In0.CockfZdHAzqOfsbw8VcQyQ";
export const maxAllowedZoom = 22;

/** Configure the map's properties and subscribe to its events. */
export const initMap = (container) => {
  const map = new Map({
    container,
    style: "mapbox://styles/mapbox/navigation-day-v1",
    center: new mapboxgl.LngLatBounds(englandAndWales.geo_json.features[0].geometry.coordinates).getCenter(),
    zoom: 6,
    maxZoom: maxAllowedZoom,
  });

  map.addControl(new mapboxgl.NavigationControl({ showCompass: false }));

  map.on("load", () => {
    initMapLayers(map);
  });

  fromEvent(map, "load")
    .pipe(
      delay(1500), // leave some time between base layer and viz to avoid "flash" of base layer on first load
    )
    .subscribe(() => {
      vizStore.subscribe((value) => {
        renderMapViz(map, value);
      });
      setMapStore(map);
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
      handleLocationSelect({ geoType: l.name, geoCode });
    });
  });

  // todo: this doesn't appear to work on inital page load
  // todo: we shouldn't flyTo/easeTo when we can already see the geography
  selectedGeographyStore.subscribe((geography) => {
    if (geography) {
      const bounds = new mapboxgl.LngLatBounds(geography.bbox);
      if (JSON.stringify(bounds) !== JSON.stringify(map.getBounds())) {
        map.easeTo({
          center: bounds.getCenter(),
        });
      }
    }
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
  });
};

const getGeoTypeForCurrentZoom = (zoom: number): GeoType => {
  for (const x of layersWithSiblings()) {
    if (zoom >= x.layer.minZoom && (!x.next || zoom < x.next.minZoom)) {
      return x.layer.name;
    }
  }
};
