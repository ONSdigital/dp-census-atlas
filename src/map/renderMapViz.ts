import { choroplethColours } from "../helpers/choroplethHelpers";
import type { VizData } from "../types";

export const renderMapViz = (map: mapboxgl.Map, data: VizData) => {
  if (!data) return;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore (typings for this overload are currently missing)
  const features2 = map.queryRenderedFeatures({ layers: ["lad-features"] });

  features2.forEach((f) => {
    const dataForFeature = data.places.find((p) => p.geoCode === f.id);

    if (dataForFeature) {
      map.setFeatureState(
        { source: "lad", sourceLayer: "lad", id: f.id },
        { colour: getChoroplethColour(dataForFeature.percentage, data.breaks) },
      );
    }
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore (typings for this overload are currently missing)
  const features = map.queryRenderedFeatures({ layers: ["msoa-features"] });

  features.forEach((f) => {
    const dataForFeature = data.places.find((p) => p.geoCode === f.id);

    if (dataForFeature) {
      map.setFeatureState(
        { source: "msoa", sourceLayer: "msoa", id: f.id },
        { colour: getChoroplethColour(dataForFeature.percentage, data.breaks) },
      );
    }
  });
};

const getChoroplethColour = (value: number, breaks: number[]) => {
  for (const b of breaks.map((b, i) => ({ breakpoint: b, colour: choroplethColours[i] }))) {
    if (value <= b.breakpoint) return b.colour;
  }
};
