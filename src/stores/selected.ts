import { asyncDerived } from "@square/svelte-store";
import { geography } from "./geography";
import { viz } from "./viz";
import { fetchDataForBbox } from "../data/api";

export const selected = asyncDerived([geography, viz], async ([$geography, $viz]) => {
  if (!$geography) {
    return undefined;
  }

  if (!$viz || $geography.geoType === "ew") {
    return { ...$geography, value: undefined as number };
  } else {
    const [[west, south], [east, north]] = $geography.bbox;
    const args = {
      category: $viz.params.category,
      geoType: $geography.geoType,
      bbox: { south, west, north, east },
    };

    // current geotype is unavailable for current params
    if (!$viz.params.classification.available_geotypes.includes($geography.geoType)) {
      return {
        ...$geography,
        value: undefined,
      };;
    }

    const data = await fetchDataForBbox(args);

    return {
      ...$geography,
      value: data.find((p) => p.geoCode === $geography.geoCode)?.ratioToTotal as number | undefined,
    };
  }
});
