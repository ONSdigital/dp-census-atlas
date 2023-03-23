import { asyncDerived } from "@square/svelte-store";
import { geography } from "./geography";
import { viz } from "./viz";
import { fetchMultiCategoryDataForBbox, fetchSingleCategoryDataForBbox } from "../data/api";
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
      geoType: $geography.geoType,
      bbox: { south, west, north, east },
      baseUrl: getDataBaseUrlForVariable($viz.params.mode, $viz.params.variable),
    };

    if ($viz.kind === "single-category") {
      const data = await fetchSingleCategoryDataForBbox({ ...args, category: $viz.params.category });
      return {
        ...$geography,
        value: data.find((p) => p.geoCode === $geography.geoCode)?.categoryValue as number | undefined,
      };
    } else {
      const data = await fetchMultiCategoryDataForBbox({ ...args, classification: $viz.params.classification });
      return {
        ...$geography,
        value: data.find((p) => p.geoCode === $geography.geoCode)?.categoryValues as Record<string, number> | undefined,
      };
    }
  }
});
