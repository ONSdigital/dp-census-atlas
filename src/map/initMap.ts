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
import { initMapLayers, initDotDensityLayers } from "./initMapLayers";
import { renderMapViz } from "./renderMapViz";
import { layers } from "./layers";
import { style, styleDotDensity, maxBounds } from "./style";
import { viewport } from "../stores/viewport";
import { viz } from "../stores/viz";
import { toObservable } from "../util/rxUtil";
import { commands, type Command } from "../stores/commands";
import { isAppInteractive, type EmbedParams } from "../helpers/embedHelper";

const defaultZoom = 6;
const maxAllowedZoom = 15;
const minZoom = 5;

let mode, classification, categories;

/** Configure the map's properties and subscribe to its events. */
export const initMap = (container: HTMLElement) => {
  const paramsData = get(params);
  const embed = paramsData.embed;
  const interactive = isAppInteractive(embed);

  const map = new Map({
    container,
    style: paramsData.mode === "dotdensity" ? styleDotDensity : style,
    zoom: defaultZoom, // inexplicably necessary to set (even though we fitBounds next)
    minZoom: minZoom, // prevent accidental zoom out, especially on mobile
    maxZoom: maxAllowedZoom,
    maxBounds,
    interactive,
    dragRotate: false,
    pitchWithRotate: false,
    touchPitch: false,
  });

  setInitialPosition(map, embed);

  map.touchZoomRotate.disableRotation();

  setMinZoomIfGeoLock(map, paramsData?.geoLock);

  if (interactive) {
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }));
  }

  map.on("load", () => {
    mode = paramsData.mode;
    classification = paramsData.classification;
    categories = paramsData.categories;

    initMapLayers(map, get(geography), interactive);
    viz.subscribe((value) => renderMapViz(map, value));
    geography.subscribe((geography) => listenToGeographyStore(map, geography));
    commands.subscribe((command) => listenToCommandStore(map, command));
    params.subscribe((params) => listenToParamStore(map, params));
  });

  // when the map loads or moves, or then when the selection changes, emit an event at most once per second
  combineLatest([merge(fromEvent(map, "load"), fromEvent(map, "move")), toObservable(params)])
    .pipe(
      throttleTime(1000, undefined, { leading: false, trailing: true }), // don't discard the final movement
    )
    .subscribe(([_, $params]) => {
      setViewportStoreAndLayerVisibility(map, $params.classification, $params?.geoLock);
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

const setViewportStoreAndLayerVisibility = (
  map: mapboxgl.Map,
  classification: Classification,
  geoLock: GeoType | undefined,
) => {
  const b = map.getBounds();
  const bbox = { east: b.getEast(), north: b.getNorth(), west: b.getWest(), south: b.getSouth() };
  let geoType;
  if (geoLock) {
    geoType = { actual: geoLock, ideal: geoLock };
  } else {
    geoType = getGeoType(map, classification);
  }

  setMapLayerVisibility(map, geoType.actual);

  viewport.set({
    bbox,
    geoType: geoType.actual,
    idealGeoType: geoType.ideal,
  });
};

const getGeoType = (map: mapboxgl.Map, classification?: Classification): { actual: GeoType; ideal: GeoType } => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore (queryRenderedFeatures typings appear to be wrong)
  const features = map.queryRenderedFeatures({ layers: ["centroids"] });
  if (Array.isArray(features)) {
    const count = features.length;
    const canvas = map.getCanvas();
    const pixelArea = canvas.clientWidth * canvas.clientHeight;
    const idealGeotype = (count * 1e6) / pixelArea > 40 ? "lad" : (count * 1e6) / pixelArea > 3 ? "msoa" : "oa";
    let availableGeotypes = classification?.available_geotypes;
    // available geotypes should be the ones for change over time data if thats whats being shown
    if (get(params).mode === "change") {
      availableGeotypes = classification?.comparison_2011_data_available_geotypes;
    }
    if (availableGeotypes) {
      // the first available_geotype is the lowest-level
      return {
        actual: availableGeotypes.includes(idealGeotype) ? idealGeotype : availableGeotypes[0],
        ideal: idealGeotype,
      };
    } else {
      return { actual: idealGeotype, ideal: idealGeotype };
    }
  } else {
    return { actual: "lad", ideal: "lad" };
  }
};

const setMapLayerVisibility = (map: mapboxgl.Map, geoType: string) => {
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

const listenToGeographyStore = (map: mapboxgl.Map, geography: GeographyInfo) => {
  if (geography && map.isStyleLoaded()) {
    // set the selected lasso
    const source = map.getSource("selected-geography") as GeoJSONSource;
    const boundary = geography.geoType === "ew" ? emptyFeatureCollection : geography.boundary;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore types here are no good
    source.setData(boundary);

    // don't change position for EW
    if (geography.geoType !== "ew") {
      setPosition(map, geography, { animate: true });
    }
  }
};

const setInitialPosition = (map: mapboxgl.Map, embed: EmbedParams) => {
  if (embed?.view === "viewport") {
    map.fitBounds(new mapboxgl.LngLatBounds(embed.bounds), { padding: 0, animate: false });
  } else {
    setPosition(map, get(geography));
  }
};

const setPosition = (map: mapboxgl.Map, g: GeographyInfo, options: { animate: boolean } = { animate: false }) => {
  if (g.geoType === "ew") {
    const bounds = new mapboxgl.LngLatBounds(englandAndWalesBbox);
    map.fitBounds(bounds, { padding: 0, animate: false });
  } else {
    const bounds = new mapboxgl.LngLatBounds(g.bbox);
    const layer = layers.find((l) => l.name === g.geoType);
    // ensure that we don't pad more than the viewport
    const padding = Math.min(
      map.getContainer().offsetWidth / layer.geoPadFactor,
      map.getContainer().offsetHeight / layer.geoPadFactor,
    );
    map.fitBounds(bounds, { padding, animate: options.animate });
  }
};

const emptyFeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

const getSuitableZoomForGeoType = (g: GeoType) => {
  // todo: improve this to use density centroids?
  return layers.find((l) => l.name === g).defaultZoom;
};

const listenToCommandStore = (map: mapboxgl.Map, command: Command) => {
  if (command?.kind === "zoom") {
    const zoom = getSuitableZoomForGeoType(command.geoType);
    map.zoomTo(zoom, { duration: 6000 });
  }
};

const setMinZoomIfGeoLock = (map: mapboxgl.Map, geoLock: GeoType | undefined) => {
  if (geoLock) {
    if (geoLock === "oa") {
      // 9 seems a sensible compromise min zoom for urban and rural areas when OA is geolocked
      map.setMinZoom(9);
    } else {
      const minZoomForGeoLock = layers.find((l) => l.name === geoLock).minZoom;
      map.setMinZoom(minZoomForGeoLock);
    }
  } else {
    map.setMinZoom(minZoom);
  }
};

const listenToParamStore = (map: mapboxgl.Map, params) => {
  setMinZoomIfGeoLock(map, params?.geoLock);
  if (params.mode !== mode) {
    // Change maps layers for new mode
    updateMapLayers(map, params);
  } else if (params.mode === "dotdensity") {
    if (params.classification !== classification) {
      // Change dots source + layer for new classification
      initDotDensityLayers(map, params);
    } else if (params.categories !== categories) {
      // Filter dots when category selection changed
      updateDotLayerFilter(map, params);
    }
  }
  mode = params.mode;
  classification = params.classification;
  categories = params.categories;
};

const updateMapLayers = (map: mapboxgl.Map, params) => {
  const embed = params.embed;
  const interactive = isAppInteractive(embed);

  map.setStyle(params.mode === "dotdensity" ? styleDotDensity : style);
  map.once("styledata", () => {
    initMapLayers(map, get(geography), interactive);
  });
};

const updateDotLayerFilter = (map: mapboxgl.Map, params) => {
  if (map.getLayer("dots")) map.setFilter("dots", ["in", "cat", ...params.categories.map((c) => c?.code)]);
};
