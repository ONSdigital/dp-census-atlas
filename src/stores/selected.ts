import { asyncDerived } from "@square/svelte-store";
import { geography } from "./geography";
import { viz } from "./viz";
import { fetchSingleCategoryDataForBbox } from "../data/api";
import { getDataBaseUrlForVariable, isDataAvailable } from "../helpers/contentHelpers";

export const selected = asyncDerived([geography, viz], async ([$geography, $viz]) => {
  if (!$geography) {
    return undefined;
  }

  if (
    !$viz ||
    $geography.geoType === "ew" ||
    !isDataAvailable($viz.params.classification, $viz.params.mode, $geography.geoType)
  ) {
    return {
      ...$geography,
      value: undefined as number,
    };
  } else {
    const [[west, south], [east, north]] = $geography.bbox;

    const args = {
      category: $viz.params.category,
      geoType: $geography.geoType,
      bbox: { south, west, north, east },
      baseUrl: getDataBaseUrlForVariable($viz.params.mode, $viz.params.variable),
    };

    const data = await fetchSingleCategoryDataForBbox(args);

    return {
      ...$geography,
      value: data.find((p) => p.geoCode === $geography.geoCode)?.categoryValue as number | undefined,
    };
  }
});
