import { layers } from "./layers";
import type { LoadedGeos } from "../types";

export const resetMapViz = (map: mapboxgl.Map, geos: LoadedGeos) => {
  layers.forEach((layer) => {
    Array.from(geos.geoCodes[layer.name]).forEach((geoCode: string) => {
      map.removeFeatureState(
        { source: layer.name, sourceLayer: layer.sourceLayer, id: geoCode },
      );
    });
  });
};