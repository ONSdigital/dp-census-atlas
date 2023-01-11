import { GeoTypes, type GeoType } from "../types";
import { englandAndWales } from "./spatialHelper";

export const getSelectedGeography = (params: URLSearchParams) => {
  for (const param of GeoTypes) {
    if (params.has(param)) {
      return {
        geoType: param,
        geoCode: params.get(param),
      };
    }
  }
  return { geoType: englandAndWales.meta.geotype as GeoType, geoCode: englandAndWales.meta.code };
};

export const getGeoLock = (params: URLSearchParams) => {
  if (params.has("geoLock")) {
    return { geoLock: params.get("geoLock") as GeoType };
  }
  return {};
};
