import { asyncDerived } from "@square/svelte-store";
import { fetchBreaks, fetchDataForBbox } from "../data/api";
import { params } from "./params";
import { viewport } from "./viewport";

/**
 * A Svelte store containing all the data we need in order to show a vizualisation.
 * */
export const viz = asyncDerived([params, viewport], async ([$params, $viewport]) => {
  const dataAvailableForClassification = () => $params?.classification?.available_geotypes.includes($viewport.geoType);

  if (!$params?.category || !viewport || !dataAvailableForClassification()) {
    return undefined;
  } else {
    const args = {
      classification: $params.classification,
      category: $params.category,
      geoType: $viewport.geoType,
      bbox: $viewport.bbox,
      changeOverTime: Boolean($params.changeOverTime && $params.classification.comparison_2011_data_available_geotypes),
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
