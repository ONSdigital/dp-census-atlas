import { choroplethColours } from "../helpers/choroplethHelpers";
import type { VizData } from "../types";
import { layers } from "./layers";

export const renderMapViz = (map: mapboxgl.Map, data: VizData) => {
  if (!data) {
    return;
  }

  const layer = layers.find((l) => l.name == data.geoType);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore (typings for this overload are currently missing)
  const features = map.queryRenderedFeatures({ layers: [`${layer.name}-features`] });

  features.forEach((f) => {
    const dataForFeature = data.places.find((p) => p.geoCode === f.id);
    if (dataForFeature) {
      map.setFeatureState(
        { source: layer.name, sourceLayer: layer.sourceLayer, id: f.id },
        { colour: getChoroplethColour(dataForFeature.ratioToTotal, data.breaks) },
      );
    }
  });
};

const getChoroplethColour = (value: number, breaks: number[]) => {
  for (const b of breaks.map((b, i) => ({ breakpoint: b, colour: choroplethColours[i] }))) {
    if (value <= b.breakpoint) return b.colour;
  }
};
