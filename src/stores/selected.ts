import { asyncDerived } from "@square/svelte-store";
import { geography } from "./geography";
import { viz } from "./viz";
import { fetchTileData } from "../data/api";

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
    const args = {
      category: $viz.params.category,
      geoType: $geography.geoType,
      base_url: $viz.params.variable.base_url_2021,
    };

    const data = await fetchTileData(args);

    return {
      ...$geography,
      value: data.find((p) => p.geoCode === $geography.geoCode)?.categoryValue as number | undefined,
    };
  }
});
