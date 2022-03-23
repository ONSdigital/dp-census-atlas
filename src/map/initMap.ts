import mapboxgl, { Map } from "mapbox-gl";
import { fromEvent } from "rxjs";
import { delay, throttleTime } from "rxjs/operators";
import type { GeoType } from "../types";
import { vizStore, mapStore } from "../stores/stores";
import { setGeoSearchParam } from "../helpers/queryParamsHelper";
import { initMapLayers } from "./initMapLayers";
import { renderMapViz } from "./renderMapViz";

mapboxgl.accessToken = "pk.eyJ1Ijoic3Vtb3RoZWNhdCIsImEiOiJjaWxocngyanYwMDY4dmprcTg4ODN2Z3B2In0.CockfZdHAzqOfsbw8VcQyQ";

/** Configure the map's properties and subscribe to its events. */
export const initMap = (container) => {
  const map = new Map({
    container,
    style: "mapbox://styles/mapbox/navigation-day-v1",
    center: { lat: 53, lng: -2 },
    zoom: 11,
  });

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

  fromEvent(map, "moveend")
    .pipe(
      throttleTime(1000, undefined, { leading: false, trailing: true }), // don't discard the final movement
    )
    .subscribe(() => {
      setMapStore(map);
    });

  map.on("click", "msoa-features", (e) => {
    const geoCode = e.features[0].properties["areacd"];
    setGeoSearchParam({ geoType: "msoa", geoCode });
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
  // todo
  return "msoa";
};
