import { asyncDerived } from "@square/svelte-store";
import { fetchBreaks, fetchTileData } from "../data/api";
import { params } from "./params";
import { viewport } from "./viewport";

/**
 * A Svelte store containing all the data we need in order to show a vizualisation.
 * */
export const viz = asyncDerived([params, viewport], async ([$params, $viewport]) => {
  if (!$params?.category || !viewport) {
    return undefined;
  } else {
    const args = {
      classification: $params.classification,
      category: $params.category,
      geoType: $viewport.geoType,
      base_url: $params.variable.base_url_2021,
    };

    const [data, breaks] = await Promise.all([fetchTileData(args), fetchBreaks(args)]);

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
