
import { choroplethColours } from "../helpers/choroplethHelpers";
import type { VizData } from "../types";

export const renderMapViz = (map: mapboxgl.Map, data: VizData) => {

  if (!data)
    return;

  // @ts-ignore (typings for this overload are currently missing)
  let features = map.queryRenderedFeatures({ layers: ['msoa-features'] });

  features.forEach(f => {
    let dataForFeature = data.places.find(p => p.geoCode === f.id);

    if (dataForFeature) {
      map.setFeatureState(
        { source: "msoa", sourceLayer: "msoa", id: f.id },
        { colour: getChoroplethColour(dataForFeature.percentage, data.breaks) },
      );
    }
  });
}

const getChoroplethColour = (value: number, breaks: number[]) => {

  for (let b of breaks.map((b, i) => ({ breakpoint: b, colour: choroplethColours[i] }))) {
    if (value <= b.breakpoint)
      return b.colour;
  }
}
