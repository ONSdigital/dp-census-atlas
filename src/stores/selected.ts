import { asyncDerived } from "@square/svelte-store";
import { geography } from "./geography";
import { viz } from "./viz";
import { fetchDataForBbox } from "../data/api";
import { getBaseUrlForCurrentMapType } from "../helpers/contentHelpers";

export const selected = asyncDerived([geography, viz], async ([$geography, $viz]) => {
  if (!$geography) {
    return undefined;
  }

  const dataAvailableForClassification = $viz?.params?.classification?.available_geotypes?.includes($geography.geoType);

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
      baseUrl: getBaseUrlForCurrentMapType($viz.params.mapType, $viz.params.variable),
    };

    const data = await fetchDataForBbox(args);

    return {
      ...$geography,
      value: data.find((p) => p.geoCode === $geography.geoCode)?.categoryValue as number | undefined,
    };
  }
});
