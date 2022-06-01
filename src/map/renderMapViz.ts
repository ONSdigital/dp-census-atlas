import { choroplethColours } from "../helpers/choroplethHelpers";
import type { VizData } from "../types";
import { layers } from "./layers";

export const renderMapViz = (map: mapboxgl.Map, data: VizData) => {
  if (!data) return;

  const layer = layers.find((l) => l.name == data.geoType);
  // assume all data in viz store relates to a place on the map that is currently in view, so no need to filter to
  // rendered features only
  data.places.forEach((p) => {
    map.setFeatureState(
      { source: layer.name, sourceLayer: layer.sourceLayer, id: p.geoCode },
      { colour: getChoroplethColour(p.ratioToTotal, data.breaks) },
    );
  });
};

const getChoroplethColour = (value: number, breaks: number[]) => {
  for (const b of breaks.map((b, i) => ({ breakpoint: b, colour: choroplethColours[i] }))) {
    if (value <= b.breakpoint) return b.colour;
  }
};
