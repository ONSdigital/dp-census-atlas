import type { LoadedGeographies, VizData } from "../types";
import { layers } from "./layers";
import { choroplethColours } from "../helpers/choroplethHelpers";

let loadedGeographies: LoadedGeographies = undefined;

export const renderMapViz = (map: mapboxgl.Map, data: VizData | undefined) => {
  removeOldFeatureStates(map, data);

  if (!data) {
    return;
  }

  const layer = layers.find((l) => l.name == data.geoType);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore (queryRenderedFeatures typings appear to be wrong)
  const renderedGeos = map.queryRenderedFeatures({ layers: [`${data.geoType}-features`] }).map((g) => g.id);
  let max;
  let maxGeo;
  let min;
  let minGeo;

  data.places.forEach((p) => {
    if (renderedGeos.includes(p.geoCode)) {
      if (max === undefined) {
        min = p.categoryValue;
        minGeo = p.geoCode;
        max = p.categoryValue;
        maxGeo = p.geoCode;
      } else {
        if (p.categoryValue < min) {
          min = p.categoryValue;
          minGeo = p.geoCode;
        }
        if (p.categoryValue > max) {
          max = p.categoryValue;
          maxGeo = p.geoCode;
        }
      }
    }
    map.setFeatureState(
      { source: layer.name, sourceLayer: layer.sourceLayer, id: p.geoCode },
      { colour: getChoroplethColour(p.categoryValue, data.breaks) },
    );
  });

  map.setFeatureState({ source: layer.name, sourceLayer: layer.sourceLayer, id: minGeo }, { colour: "#FF0000" });
  map.setFeatureState({ source: layer.name, sourceLayer: layer.sourceLayer, id: maxGeo }, { colour: "#00FF00" });
};

const getChoroplethColour = (value: number, breaks: number[]) => {
  let upperBreakBounds;
  if (breaks.length === 1) {
    upperBreakBounds = breaks;
  } else {
    upperBreakBounds = breaks.slice(1);
  }
  for (const b of upperBreakBounds.map((b, i) => ({ breakpoint: b, colour: choroplethColours[i] }))) {
    if (value <= b.breakpoint) return b.colour;
  }
};

const removeOldFeatureStates = (map: mapboxgl.Map, data: VizData | undefined) => {
  const categoryCode = data?.params?.category?.code;
  const geoCodes = data ? new Set(data.places.map((d) => d.geoCode)) : new Set([]);

  if (!loadedGeographies) {
    rememberLoadedGeographies(data);
  } else if (loadedGeographies.categoryCode !== categoryCode || !data) {
    // purge loaded features
    for (const layerId in loadedGeographies.geoCodes) {
      const geoCodes = Array.from(loadedGeographies.geoCodes[layerId]);
      geoCodes.forEach((geoCode: string) => {
        map.removeFeatureState({ source: layerId, sourceLayer: layerId, id: geoCode });
      });
    }
    rememberLoadedGeographies(data);
  } else if (data) {
    // remember newly loaded geos
    const loadedCodes = Array.from(loadedGeographies.geoCodes[data.geoType]);
    loadedGeographies.geoCodes[data.geoType] = new Set([...loadedCodes, ...geoCodes]);
  }
};

const rememberLoadedGeographies = (data: VizData | undefined) => {
  const catCode = data?.params?.category?.code;
  const geoType = data?.geoType;
  const geoCodes = data ? data.places.map((d) => d.geoCode) : [];

  loadedGeographies = {
    categoryCode: catCode,
    geoCodes: {
      lad: geoType === "lad" ? new Set(geoCodes) : new Set([]),
      msoa: geoType === "msoa" ? new Set(geoCodes) : new Set([]),
      oa: geoType === "oa" ? new Set(geoCodes) : new Set([]),
    },
  };
};
