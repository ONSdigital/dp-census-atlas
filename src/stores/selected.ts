import type { GeoType } from "../types";
import { derived, type Readable } from "svelte/store";
import { geography } from "./geography";
import { viz } from "./viz";

type Selected = {
  geoType: GeoType;
  geoCode: string;
  displayName: string;
  value: number;
};

export const selected: Readable<Selected> = derived([geography, viz], ([$geography, $viz], set) => {
  // only update when we should...
  console.log("selected updating...");
  if ($geography && $viz && $viz.geoType === $geography.geoType) {
    const val: Selected = {
      geoType: $geography.geoType,
      geoCode: $geography.geoCode,
      displayName: $geography.displayName,
      value: $viz?.places.find((p) => p.geoCode === $geography.geoCode)?.ratioToTotal,
    };
    set(val);
  }
});
