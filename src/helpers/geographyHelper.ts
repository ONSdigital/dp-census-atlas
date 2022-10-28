import { preventFlyToGeographyStore } from "../stores/flyto";

export const englandAndWalesBbox = [1, 55.8, -5, 49.7] as [number, number, number, number];

export const preventFlyToGeography = (geoCode: string) => {
  preventFlyToGeographyStore.set(geoCode);
};

export const geoTypeDescriptions = {
  lad: "Local Authority Districts",
  msoa: "Middle Layer Super Output Areas",
  oa: "Census Output Areas",
};
