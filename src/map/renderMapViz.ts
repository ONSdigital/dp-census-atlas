import type { LoadedGeographies, VizData } from "../types";
import { layers } from "./layers";
import { choroplethColours, getHeatMapColours } from "../helpers/choroplethHelpers";
import { heatMapColours } from "../stores/heatMapColours";
let loadedGeographies: LoadedGeographies = undefined;

export const renderMapViz = (map: mapboxgl.Map, data: VizData | undefined) => {
  removeOldFeatureStates(map, data);
  if (!data) {
    return;
  }

  const hmColours = getStuff(map, data);

  const layer = layers.find((l) => l.name == data.geoType);

  data.places.forEach((p) => {
    map.setFeatureState(
      { source: layer.name, sourceLayer: layer.sourceLayer, id: p.geoCode },
      { colour: getChoroplethColour(p.categoryValue, hmColours.breaks, hmColours.colours) },
    );
  });

  heatMapColours.set(hmColours);
};

const getChoroplethColour = (value: number, breaks: number[], colors: string[] = choroplethColours) => {
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

const getStuff = (map: mapboxgl.Map, data: VizData) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore (queryRenderedFeatures typings appear to be wrong)
  const renderedGeos = map.queryRenderedFeatures({ layers: [`${data.geoType}-features`] }).map((f) => f.id);
  console.log(renderedGeos);
  const renderedPlaces = renderedGeos.map((g) => data.places.find((p) => p.geoCode === g));
  const breaks = [...new Set(renderedPlaces.map((p) => p.categoryValue))].sort((a, b) => a - b);
  let legendBreaks = [];
  if (breaks.length <= 5) {
    legendBreaks = breaks;
  } else {
    legendBreaks = [
      breaks[0],
      breaks[Math.round(breaks.length / 4) * 1],
      breaks[Math.round(breaks.length / 4) * 2],
      breaks[Math.round(breaks.length / 4) * 3],
      ...breaks.slice(-1),
    ];
  }
  const colours = getHeatMapColours(breaks);
  return { legendBreaks, breaks, colours };
};
