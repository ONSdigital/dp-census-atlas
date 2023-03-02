import { hovered } from "../stores/hovered";
import { centroidsGeojson } from "../helpers/quadsHelper";
import { distinctUntilChanged, fromEventPattern } from "rxjs";
import { map as project } from "rxjs/operators";
import type { NumberQuadruple } from "../types";
import topojson from "./topojson.json";
import { feature } from "topojson-client";

const layerBounds: NumberQuadruple = [-6.418, 49.864, 1.764, 55.812];

//const topoJsonLayersToAdd = ["LTLA", "RGN", "UTLA"];
const topoJsonLayersToAdd = ["LTLA"];

const geojson = {};
topoJsonLayersToAdd.forEach((type) => {
  geojson[type] = feature(topojson, type);
});

export const initMapLayers = (map, geo, interactive: boolean) => {
  topoJsonLayersToAdd.forEach((lGeo) => {
    map.addSource(lGeo, {
      type: "geojson",
      data: geojson[lGeo],
      promoteId: "AREACD", // tells mapbox which property to use as the feature id
    });

    map.addLayer(
      {
        id: `${lGeo}-features`,
        source: lGeo,
        type: "fill",
        paint: {
          "fill-color": [
            "case",
            ["!=", ["feature-state", "colour"], null],
            ["feature-state", "colour"],
            "lightgrey", // Set to grey to confirm layer exists when data not loaded. Should be set to rgba(255,255,255,0)
          ],
        },
      },
      "mask-raster",
    );

    map.addLayer(
      {
        id: `${lGeo}-outlines`,
        type: "line",
        source: lGeo,
        layout: {
          "line-join": "round",
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
      "place_other",
    );

    fromEventPattern((handler) => {
      map.on("mousemove", `${lGeo}-features`, handler);
    })
      .pipe(
        project((e: any) => ({
          geoType: lGeo,
          geoCode: e?.features?.[0].id,
          displayName: e?.features?.[0].properties?.["AREANM"],
        })),
        distinctUntilChanged((prev, curr) => prev.geoCode === curr.geoCode),
      )
      .subscribe((g) => {
        hovered.set({ ...g });
      });

    fromEventPattern((handler) => {
      map.on("mouseleave", `${lGeo}-features`, handler);
    }).subscribe(() => {
      hovered.set(undefined);
    });

    if (interactive) {
      // cursor to pointer when hovered
      map.on("mouseenter", `${lGeo}-features`, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", `${lGeo}-features`, () => {
        map.getCanvas().style.cursor = "";
      });
    }

    // when the user moves their mouse over the state-fill layer, we'll update the
    // feature state for the feature under the mouse.
    let hoveredStateId = null; // todo: RxJS!
    map.on("mousemove", `${lGeo}-features`, (e) => {
      if (e.features.length > 0) {
        if (hoveredStateId !== null) {
          map.setFeatureState({ source: lGeo, id: hoveredStateId }, { hovered: false });
        }
        hoveredStateId = e.features[0].id;
        map.setFeatureState({ source: lGeo, id: hoveredStateId }, { hovered: true });
      }
    });

    // when the mouse leaves the fill layer, update the feature state of the
    // previously hovered feature.
    map.on("mouseleave", `${lGeo}-features`, () => {
      if (hoveredStateId !== null) {
        map.setFeatureState({ source: lGeo, id: hoveredStateId }, { hovered: false });
      }
      hoveredStateId = null;
    });
  });

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
