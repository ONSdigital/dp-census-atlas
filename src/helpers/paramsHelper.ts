import { GeoTypes, type GeoType } from "../types";
import { unitedKingdom } from "./spatialHelper";

export const getSelectedGeography = (params: URLSearchParams) => {
  for (const param of GeoTypes) {
    if (params.has(param)) {
      return {
        geoType: param,
        geoCode: params.get(param),
      };
    }
  }
  return { geoType: unitedKingdom.meta.geotype as GeoType, geoCode: unitedKingdom.meta.code };
};

export const getGeoLock = (params: URLSearchParams) => {
  if (params.has("geoLock")) {
    return { geoLock: params.get("geoLock") as GeoType };
  }
  return {};
};
