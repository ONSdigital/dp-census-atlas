export const initMapLayers = (map) => {
  map.addSource("lad", {
    type: "vector",
    tiles: ["https://cdn.jsdelivr.net/gh/VivianAllen/maptiles/authorities-2011/v4/{z}/{x}/{y}.pbf"],
    promoteId: "lad11cd", // tells mapbox which property to use as the feature id
  });

  map.addLayer({
    id: "lad-features",
    minzoom: 6,
    source: "lad",
    "source-layer": "lad",
    type: "fill",
    paint: {
      "fill-color": [
        "case",
        ["!=", ["feature-state", "colour"], null],
        ["feature-state", "colour"],
        "rgba(255, 255, 255, 0)",
      ],
    },
  });

  map.addLayer({
    id: "lad-outlines",
    type: "line",
    source: "lad",
    "source-layer": "lad",
    minzoom: 6,
    paint: {
      "line-color": "black",
      // "line-width": 1,
      "line-width": [
        "case",
        ["==", ["feature-state", "selected"], true],
        5,
        ["==", ["feature-state", "hovered"], true],
        2,
        1,
      ],
    },
  });

  map.addSource("msoa", {
    type: "vector",
    tiles: ["https://cdn.ons.gov.uk/maptiles/administrative/msoa/v2/boundaries/{z}/{x}/{y}.pbf"],
    promoteId: "areacd", // tells mapbox which property to use as the feature id
  });

  map.addLayer({
    id: "msoa-features",
    minzoom: 9,
    source: "msoa",
    "source-layer": "msoa",
    type: "fill",
    paint: {
      "fill-color": [
        "case",
        ["!=", ["feature-state", "colour"], null],
        ["feature-state", "colour"],
        "rgba(255, 255, 255, 0)",
      ],
    },
  });

  map.addLayer({
    id: "msoa-outlines",
    type: "line",
    source: "msoa",
    "source-layer": "msoa",
    minzoom: 11,
    paint: {
      "line-color": "black",
      // "line-width": 1,
      "line-width": [
        "case",
        ["==", ["feature-state", "selected"], true],
        5,
        ["==", ["feature-state", "hovered"], true],
        2,
        1,
      ],
    },
  });

  map.addLayer({
    id: "msoa-labels",
    type: "symbol",
    source: "msoa",
    "source-layer": "msoa",
    minzoom: 9,
    layout: {
      "text-field": ["get", "hclnm"], // 'hclnm' is the feature property name of the display name
      "text-size": 13,
      "text-justify": "auto",
    },
    paint: {
      "text-color": "#000",
      "text-halo-color": "#fff",
      "text-halo-width": 100,
    },
  });

  // pointer cursor when hovered
  map.on("mouseenter", "msoa-features", () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "msoa-features", () => {
    map.getCanvas().style.cursor = "";
  });

  // ====================
  // hover and select....
  // ====================

  // fromEvent(map, "mousemove").pipe(
  // ).subscribe((e: any) => {
  //   console.log(e.features);
  // });

  // When the user moves their mouse over the state-fill layer, we'll update the
  // feature state for the feature under the mouse.
  let hoveredStateId = null; // todo: RxJS!
  map.on("mousemove", "msoa-features", (e) => {
    if (e.features.length > 0) {
      if (hoveredStateId !== null) {
        map.setFeatureState({ source: "msoa", sourceLayer: "msoa", id: hoveredStateId }, { hovered: false });
      }
      hoveredStateId = e.features[0].id;
      map.setFeatureState({ source: "msoa", sourceLayer: "msoa", id: hoveredStateId }, { hovered: true });
    }
  });

  // When the mouse leaves the state-fill layer, update the feature state of the
  // previously hovered feature.
  map.on("mouseleave", "msoa-outlines", () => {
    if (hoveredStateId !== null) {
      map.setFeatureState({ source: "msoa", sourceLayer: "msoa", id: hoveredStateId }, { hovered: false });
    }
    hoveredStateId = null;
  });
};
