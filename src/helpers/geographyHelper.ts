import { preventFlyToGeographyStore } from "../stores/stores";

export const englandAndWalesBbox = [2, 58, -6, 48] as [number, number, number, number];

export const preventFlyToGeography = (geoCode: string) => {
  preventFlyToGeographyStore.set(geoCode);
};

export const geoTypeDescriptions = {
  lad: "Local Authority Districts",
  msoa: "Middle Layer Super Output Areas",
  oa: "Output Areas",
};
