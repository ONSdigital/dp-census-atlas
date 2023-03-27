import { hovered } from "../stores/hovered";
import { layersWithSiblings, dotDensityPath } from "./layers";
import { centroidsGeojson } from "../helpers/quadsHelper";
import { distinctUntilChanged, fromEventPattern } from "rxjs";
import { map as project } from "rxjs/operators";
import type { NumberQuadruple } from "../types";
import { get } from "svelte/store";
import { params } from "../stores/params";
import type mapboxgl from "mapbox-gl";

const layerBounds: NumberQuadruple = [-6.418, 49.864, 1.764, 55.812];
const dotDensityColors = ["#3bb2d0", "#e55e5e", "#223b53", "#fbb03b", "#ccc"];

export const makeColors = (categories) => {
  const cols = ["match", ["get", "cat"]];
  categories.forEach((cat, i) => {
    cols.push(cat);
    cols.push(dotDensityColors[i]);
  });
  cols.push("rgba(0,0,0,0)");
  return cols;
};

export const initDotDensityLayers = (map: mapboxgl.Map, params) => {
  if (map.getLayer("dots")) map.removeLayer("dots");
  if (map.getSource("dots")) map.removeSource("dots");

  if (params.classification) {
    map.addSource("dots", {
      type: "vector",
      tiles: [`${dotDensityPath}/${params.classification.code}/{z}/{x}/{y}.pbf`],
      maxzoom: 11,
    });
    map.addLayer(
      {
        id: "dots",
        type: "circle",
        source: "dots",
        "source-layer": params.classification.code,
        filter: ["in", "cat", ...params.categories.map((c) => c?.code)],
        paint: {
          "circle-color": makeColors(params.classification.categories.map((c) => c.code)),
          "circle-radius": {
            stops: [
              [8, 0.7],
              [12, 1.2],
              [15, 3],
            ],
          },
        },
      },
      "place_other",
    );
  }
};

export const initMapLayers = (map, geo, interactive: boolean) => {
  const paramsData = get(params);

  layersWithSiblings().forEach((l) => {
    map.addSource(l.layer.name, {
      type: "vector",
      tiles: [l.layer.urlTemplate],
      promoteId: l.layer.idProperty, // tells mapbox which property to use as the feature id
      maxzoom: l.layer.sourceMaxZoom, // This is the maximum zoom level that the map tiles are available for (tiles can be over-zoomed)
      layerBounds,
    });

    map.addLayer(
      {
        id: `${l.layer.name}-features`,
        minzoom: l.layer.minZoom,
        source: l.layer.name,
        "source-layer": l.layer.sourceLayer,
        type: "fill",
        // maxzoom: l.next ? l.next.minZoom : maxAllowedZoom,
        layout: { visibility: l.layer.name == "lad" ? "visible" : "none" }, // could just be "none"
        paint:
          paramsData.mode === "dotdensity"
            ? { "fill-color": "rgba(0,0,0,0)" }
            : {
                "fill-color": [
                  "case",
                  ["!=", ["feature-state", "colour"], null],
                  ["feature-state", "colour"],
                  "lightgrey", // Set to grey to confirm layer exists when data not loaded. Should be set to rgba(255,255,255,0)
                ],
              },
      },
      paramsData.mode === "dotdensity" ? null : "mask-raster",
    );

    map.addLayer(
      {
        id: `${l.layer.name}-outlines`,
        type: "line",
        source: l.layer.name,
        "source-layer": l.layer.sourceLayer,
        minzoom: l.layer.minZoom,
        // maxzoom: l.next ? l.next.minZoom : maxAllowedZoom,
        layout: {
          "line-join": "round",
          visibility: l.layer.name == "lad" ? "visible" : "none",
        },
        paint: {
          "line-color": [
            "case",
            ["==", ["feature-state", "selected"], true],
            "black",
            ["==", ["feature-state", "hovered"], true],
            "black",
            "rgba(0,0,0,0.3)",
          ],
          "line-width": [
            "case",
            ["==", ["feature-state", "selected"], true],
            3,
            ["==", ["feature-state", "hovered"], true],
            2,
            0.5,
          ],
        },
      },
      "place_suburb",
    );

    fromEventPattern((handler) => {
      map.on("mousemove", `${l.layer.name}-features`, handler);
    })
      .pipe(
        project((e: any) => ({
          geoType: l.layer.name,
          geoCode: e?.features?.[0].id,
          displayName: e?.features?.[0].properties?.[l.layer.displayNameProperty],
        })),
        distinctUntilChanged((prev, curr) => prev.geoCode === curr.geoCode),
      )
      .subscribe((g) => {
        hovered.set({ ...g });
      });

    fromEventPattern((handler) => {
      map.on("mouseleave", `${l.layer.name}-features`, handler);
    }).subscribe(() => {
      hovered.set(undefined);
    });

    if (interactive) {
      // cursor to pointer when hovered
      map.on("mouseenter", `${l.layer.name}-features`, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", `${l.layer.name}-features`, () => {
        map.getCanvas().style.cursor = "";
      });
    }

    // when the user moves their mouse over the state-fill layer, we'll update the
    // feature state for the feature under the mouse.
    let hoveredStateId = null; // todo: RxJS!
    map.on("mousemove", `${l.layer.name}-features`, (e) => {
      if (e.features.length > 0) {
        if (hoveredStateId !== null) {
          map.setFeatureState(
            { source: l.layer.name, sourceLayer: l.layer.sourceLayer, id: hoveredStateId },
            { hovered: false },
          );
        }
        hoveredStateId = e.features[0].id;
        map.setFeatureState(
          { source: l.layer.name, sourceLayer: l.layer.sourceLayer, id: hoveredStateId },
          { hovered: true },
        );
      }
    });

    // when the mouse leaves the fill layer, update the feature state of the
    // previously hovered feature.
    map.on("mouseleave", `${l.layer.name}-features`, () => {
      if (hoveredStateId !== null) {
        map.setFeatureState(
          { source: l.layer.name, sourceLayer: l.layer.sourceLayer, id: hoveredStateId },
          { hovered: false },
        );
      }
      hoveredStateId = null;
    });
  });

  if (paramsData.mode === "dotdensity") {
    initDotDensityLayers(map, paramsData);
  }

  // selected geography layer
  map.addSource("selected-geography", {
    type: "geojson",
    data: geo?.boundary ?? {
      type: "FeatureCollection",
      features: [],
    },
  });
  map.addLayer({
    id: "selected-geography-highlight",
    type: "line",
    source: "selected-geography",
    layout: { "line-join": "round" },
    paint: {
      "line-color": "#fff",
      "line-width": 4.5,
    },
  });
  map.addLayer({
    id: "selected-geography-outline",
    type: "line",
    source: "selected-geography",
    layout: { "line-join": "round" },
    paint: {
      "line-color": "#000",
      "line-width": 3,
    },
  });

  // add OA quad centroid layer for feature density calculation
  map.addSource("centroids", centroidsGeojson);
  map.addLayer({
    id: "centroids",
    type: "circle",
    source: "centroids",
    paint: {
      "circle-radius": 1,
      "circle-color": "rgba(255,255,255,0)",
    },
  });
};
