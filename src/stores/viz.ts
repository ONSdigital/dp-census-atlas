import type * as dsv from "d3-dsv"; // https://github.com/d3/d3/issues/3469
import { asyncDerived } from "@square/svelte-store";
import { fetchBreaks, fetchDataForBbox } from "../data/api";
import { params } from "./params";
import { viewport } from "./viewport";

/**
 * A Svelte store containing all the data we need in order to show a vizualisation.
 * */
export const viz = asyncDerived([params, viewport], async ([$params, $viewport]) => {
  const args = {
    category: $params.category,
    geoType: $viewport.geoType,
    bbox: $viewport.bbox,
  };

  // important for feature state purging
  if (!args.category) {
    return undefined;
  }
  // current geotype is unavailable for current params
  if (!$params.classification.available_geotypes.includes($viewport.geoType)) {
    return undefined;
  }

  const [data, breaks] = await Promise.all([fetchDataForBbox(args), fetchBreaks(args)]);

  return {
    geoType: args.geoType,
    breaks: breaks.breaks[args.category.code],
    minMaxVals: breaks.minMax[args.category.code],
    places: data,
    params: {
      ...$params,
    },
  };
});
