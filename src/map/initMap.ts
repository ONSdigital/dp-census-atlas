import { get } from "svelte/store";
import { page } from "$app/stores";
import mapboxgl, { GeoJSONSource, Map } from "mapbox-gl";
import { combineLatest, fromEvent, merge } from "rxjs";
import { throttleTime } from "rxjs/operators";
import type { GeoType, GeographyInfo, Classification } from "../types";
import { params } from "../stores/params";
import { geography } from "../stores/geography";
import { englandAndWalesBbox } from "../helpers/geographyHelper";
import { selectGeography } from "../helpers/navigationHelper";
import { initMapLayers } from "./initMapLayers";
import { renderMapViz } from "./renderMapViz";
import { layers } from "./layers";
import { style, maxBounds } from "./style";
import { viewport } from "../stores/viewport";
import { viz } from "../stores/viz";
import { toObservable } from "../util/rxUtil";

const defaultZoom = 6;
const maxAllowedZoom = 16;

/** Configure the map's properties and subscribe to its events. */
export const initMap = (container: HTMLElement) => {
  const embed = get(params).embed;
  const interactive = !embed || embed.interactive;

  const map = new Map({
    container,
    style,
    zoom: defaultZoom, // inexplicably necessary to set (even though we fitBounds next)
    minZoom: 5, // prevent accidental zoom out, especially on mobile
    maxZoom: maxAllowedZoom - 0.001, // prevent layers from disappearing at absolute max zoom
    maxBounds,
    interactive,
  });

  setPosition(map, get(geography));
  if (interactive) {
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }));
  }

  map.on("load", () => {
    initMapLayers(map, get(geography));
    viz.subscribe((value) => {
      renderMapViz(map, value);
    });
    geography.subscribe((geography) => {
      listenToSelectedGeographyStore(map, geography);
    });
  });

  // when the map loads or moves, or then when the selecion changes, emit an event at most once per second
  combineLatest([merge(fromEvent(map, "load"), fromEvent(map, "move")), toObservable(params)])
    .pipe(
      throttleTime(1000, undefined, { leading: false, trailing: true }), // don't discard the final movement
    )
    .subscribe(([_, $params]) => {
      setViewportStoreAndLayerVisibility(map, $params.classification);
    });

  if (interactive) {
    layers.forEach((l) => {
      map.on("click", `${l.name}-features`, (e) => {
        const geoCode = e.features[0].properties[l.idProperty];
        selectGeography(get(page).url.searchParams, { geoType: l.name, geoCode });
      });
    });
  }

  return map;
};

const setViewportStoreAndLayerVisibility = (map: mapboxgl.Map, classification: Classification) => {
  const b = map.getBounds();
  const bbox = { east: b.getEast(), north: b.getNorth(), west: b.getWest(), south: b.getSouth() };
  const geoType = getGeoType(map, classification);

  setMapLayerVisibility(map, geoType);

  viewport.set({
    bbox,
    geoType: geoType,
  });
};

const getGeoType = (map: mapboxgl.Map, classification?: Classification): GeoType => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore (queryRenderedFeatures typings appear to be wrong)
  const features = map.queryRenderedFeatures({ layers: ["centroids"] });
  if (Array.isArray(features)) {
    const count = features.length;
    const canvas = map.getCanvas();
    const pixelArea = canvas.clientWidth * canvas.clientHeight;
    const preferredGeotype = (count * 1e6) / pixelArea > 40 ? "lad" : (count * 1e6) / pixelArea > 3 ? "msoa" : "oa";
    const availableGeotypes = classification?.available_geotypes;
    if (availableGeotypes) {
      // the first available_geotype is the lowest-level
      return availableGeotypes.includes(preferredGeotype) ? preferredGeotype : availableGeotypes[0];
    } else {
      return preferredGeotype;
    }
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
    // set the selected lasso
    const source = map.getSource("selected-geography") as GeoJSONSource;
    const boundary = geography.geoType === "ew" ? emptyFeatureCollection : geography.boundary;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore types here are no good
    source.setData(boundary);

    // zoom there
    if (geography.geoType !== "ew") {
      setPosition(map, geography, { animate: true });
    }
  }
};

const setPosition = (map: mapboxgl.Map, g: GeographyInfo, options: { animate: boolean } = { animate: false }) => {
  if (g.geoType === "ew") {
    const bounds = new mapboxgl.LngLatBounds(englandAndWalesBbox);
    map.fitBounds(bounds, { padding: 0, animate: false });
  } else {
    const width = map.getContainer().offsetWidth;
    const bounds = new mapboxgl.LngLatBounds(g.bbox);
    const layer = layers.find((l) => l.name === g.geoType);
    const geoPadFactor = layer.geoPadFactor;
    map.fitBounds(bounds, { padding: width / geoPadFactor, animate: options.animate });
  }
};

const emptyFeatureCollection = {
  type: "FeatureCollection",
  features: [],
};
