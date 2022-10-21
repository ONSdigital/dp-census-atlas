import { GeoTypes, type GeoType } from "../types";

export const setGeographyParam = (params: URLSearchParams, g: { geoType: GeoType; geoCode: string }) => {
  const newer = new URLSearchParams(params);
  for (const param of GeoTypes) {
    newer.delete(param);
  }
  newer.set(g.geoType.toLowerCase(), g.geoCode);
  return newer;
};
