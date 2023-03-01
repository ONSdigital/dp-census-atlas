import { asyncDerived } from "@square/svelte-store";
import { fetchBreaks, fetchDataForBbox } from "../data/api";
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
      geoType: $viewport.geoType,
      bbox: $viewport.bbox,
      baseUrl: getDataBaseUrlForVariable($params.mode, $params.variable),
    };

    const [data, breaks] = await Promise.all([fetchDataForBbox(args), fetchBreaks(args)]);

    return {
      geoType: args.geoType,
      breaks: breaks.breaks,
      places: data,
      params: {
        ...$params,
      },
    };
  }
});
