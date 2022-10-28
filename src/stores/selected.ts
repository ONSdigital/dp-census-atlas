import type { GeoType } from "../types";
import { derived, type Readable } from "svelte/store";
import { geography } from "./geography";
import { viz } from "./viz";

// TODO... this is work-in-progress...

type Selected = {
  geoType: GeoType;
  geoCode: string;
  displayName: string;
  value: number;
};

export const selected: Readable<Selected> = derived([geography, viz], ([$geography, $viz], set) => {
  // only update when we should...
  if ($geography && $viz && $viz.geoType === $geography.geoType) {
    console.log("selected updating...", { $geography, $viz });
    const val: Selected = {
      geoType: $geography.geoType,
      geoCode: $geography.geoCode,
      displayName: $geography.displayName,
      value: $viz?.places.find((p) => p.geoCode === $geography.geoCode)?.ratioToTotal,
    };
    set(val);
  }
  if (!$geography) {
    set(undefined);
  }
});
