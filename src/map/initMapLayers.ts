import { hovered } from "../stores/hovered";
import { layersWithSiblings } from "./layers";
import { centroidsGeojson } from "../helpers/quadsHelper";
import { distinctUntilChanged, fromEventPattern } from "rxjs";
import { map as project } from "rxjs/operators";

export const initMapLayers = (map) => {
  layersWithSiblings().forEach((l) => {
    map.addSource(l.layer.name, {
      type: "vector",
      tiles: [l.layer.urlTemplate],
      promoteId: l.layer.idProperty, // tells mapbox which property to use as the feature id
      maxzoom: l.layer.sourceMaxZoom, // This is the maximum zoom level that the map tiles are available for (tiles can be over-zoomed)
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
        id: `${l.layer.name}-outlines`,
        type: "line",
        source: l.layer.name,
        "source-layer": l.layer.sourceLayer,
        minzoom: l.layer.minZoom,
        // maxzoom: l.next ? l.next.minZoom : maxAllowedZoom,
        layout: { visibility: l.layer.name == "lad" ? "visible" : "none" },
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

    // cursor to pointer when hovered
    map.on("mouseenter", `${l.layer.name}-features`, () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", `${l.layer.name}-features`, () => {
      map.getCanvas().style.cursor = "";
    });

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

  // selected geography layer
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
