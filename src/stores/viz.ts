import { asyncDerived } from "@square/svelte-store";
import {
  fetchBreaks,
  fetchSingleCategoryDataForBbox,
  fetchMultiCategoryDataForBbox,
  fetchMultiCategoryDataForEnglandAndWales,
} from "../data/api";
import { params } from "./params";
import { viewport } from "./viewport";
import { getDataBaseUrlForVariable, isDataAvailable } from "../helpers/contentHelpers";
import type { Mode } from "../types";
import { never } from "../util/typeUtil";

/**
 * A Svelte store containing all the data we need in order to show a vizualisation.
 * */
export const viz = asyncDerived([params, viewport], async ([$params, $viewport]) => {
  if (!$params?.category || !viewport || !isDataAvailable($params.classification, $params.mode, $viewport.geoType)) {
    return undefined;
  } else {
    const args = {
      mode: $params.mode,
      classification: $params.classification,
      category: $params.category,
      categories: $params.categories,
      geoType: $viewport.geoType,
      bbox: $viewport.bbox,
      baseUrl: getDataBaseUrlForVariable($params.mode, $params.variable),
    };

    const data = await getDataForMode($params.mode, args);

    return {
      ...data,
      geoType: args.geoType,
      params: { ...$params }, // make available the params used for the api call, to avoid race conditions
    };
  }
});

const getDataForMode = async (mode: Mode, args) => {
  switch (mode) {
    case "choropleth":
    case "change": {
      const [data, breaks] = await Promise.all([fetchSingleCategoryDataForBbox(args), fetchBreaks(args)]);
      return {
        kind: "single-category" as const,
        places: data,
        breaks: breaks.breaks,
      };
    }
    case "dotdensity": {
      const [data, ew] = await Promise.all([
        fetchMultiCategoryDataForBbox(args),
        fetchMultiCategoryDataForEnglandAndWales(args),
      ]);
      return {
        kind: "multi-category" as const,
        places: data,
        englandAndWales: ew.data,
      };
    }
    default: {
      return never(mode);
    }
  }
};
