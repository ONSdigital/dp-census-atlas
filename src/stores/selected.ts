import { asyncDerived } from "@square/svelte-store";
import { geography } from "./geography";
import { viz } from "./viz";
import { fetchDataForBbox } from "../data/api";
import { getDataBaseUrlForVariable } from "../helpers/contentHelpers";

export const selected = asyncDerived([geography, viz], async ([$geography, $viz]) => {
  if (!$geography) {
    return undefined;
  }
  let dataAvailableForClassification;
  if ($viz?.params?.mode === "change") {
    dataAvailableForClassification = () =>
      $viz?.params?.classification?.comparison_2011_data_available_geotypes?.includes($geography.geoType);
  } else {
    dataAvailableForClassification = () =>
      $viz?.params?.classification?.available_geotypes?.includes($geography.geoType);
  }

  if (!$viz || $geography.geoType === "ew" || !dataAvailableForClassification) {
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

    const data = await fetchDataForBbox(args);

    return {
      ...$geography,
      value: data.find((p) => p.geoCode === $geography.geoCode)?.categoryValue as number | undefined,
    };
  }
});
