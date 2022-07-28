import { goto } from "$app/navigation";
import { preventFlyToGeographyStore } from "../stores/stores";
import type { GeoType } from "../types";

export const englandAndWalesBbox = [2, 58, -6, 48] as [number, number, number, number];
// [
//   [2, 58],
//   [-6, 48],
// ];

// TODO: this code unfortunately assumes there's only ever one querystring parameter
// (we will need to improve this for embedding)

export const deselectGeography = () => {
  goto("?", { keepfocus: true, replaceState: false, noscroll: true });
};

export const selectGeography = (place: { geoType: GeoType; geoCode: string }) => {
  const s = `?${place.geoType}=${place.geoCode}`;
  goto(s, { keepfocus: true, replaceState: false, noscroll: true });
};

export const preventFlyToGeography = (geoCode: string) => {
  preventFlyToGeographyStore.set(geoCode);
};

export const geoTypeDescriptions = {
  lad: "Local Authority Districts",
  msoa: "Middle Layer Super Output Areas",
  oa: "Output Areas",
};
