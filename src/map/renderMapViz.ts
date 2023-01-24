import type { LoadedGeographies, VizData } from "../types";
import { layers } from "./layers";
import { getColoursForBreaks } from "../helpers/choroplethHelpers";

let loadedGeographies: LoadedGeographies = undefined;

export const renderMapViz = (map: mapboxgl.Map, data: VizData | undefined) => {
  removeOldFeatureStates(map, data);

  if (!data) {
    return;
  }

  const layer = layers.find((l) => l.name == data.geoType);
  const changeOverTime = Boolean(
    data.params.changeOverTime && data.params.classification?.comparison_2011_data_available_geotypes,
  );

  data.places.forEach((p) => {
    map.setFeatureState(
      { source: layer.name, sourceLayer: layer.sourceLayer, id: p.geoCode },
      { colour: getChoroplethColour(p.categoryValue, data.breaks, changeOverTime) },
    );
  });
};

const getChoroplethColour = (value: number, breaks: number[], changeOverTime: boolean) => {
  const colors = getColoursForBreaks(breaks, changeOverTime);
  let upperBreakBounds;
  if (breaks.length === 1) {
    upperBreakBounds = breaks;
  } else {
    upperBreakBounds = breaks.slice(1);
  }
  for (const b of upperBreakBounds.map((b, i) => ({ breakpoint: b, colour: colors[i] }))) {
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
