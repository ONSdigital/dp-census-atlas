import { asyncDerived } from "@square/svelte-store";
import { fetchBreaks, fetchSingleCategoryDataForBbox, fetchMultiCategoryDataForBbox } from "../data/api";
import { params } from "./params";
import { viewport } from "./viewport";
import { getDataBaseUrlForVariable, isDataAvailable } from "../helpers/contentHelpers";

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

    if ($params.mode === "dotdensity") {
      const [data, englandAndWales] = await Promise.all([fetchMultiCategoryDataForBbox(args), new Promise(() => true)]);
      return {
        kind: "dotdensity",
        geoType: args.geoType,
        englandAndWales,
        places: data,
        params: {
          ...$params,
        },
      };
    } else {
      const [data, breaks] = await Promise.all([fetchSingleCategoryDataForBbox(args), fetchBreaks(args)]);
      return {
        kind: "choropleth", // `change` is the same choropleth in terms of the viz data
        geoType: args.geoType,
        breaks: breaks.breaks,
        places: data,
        params: {
          ...$params,
        },
      };
    }
  }
});
