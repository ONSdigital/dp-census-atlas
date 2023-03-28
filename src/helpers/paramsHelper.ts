import { GeoTypes, type GeoType, modes, type Mode, type Classification } from "../types";
import { englandAndWales } from "./spatialHelper";

export const getMode = (params: Record<string, string>): Mode => {
  const maybeMode = modes.find((m) => m === params["mode"]);

  // default to choropleth
  return maybeMode ?? "choropleth";
};

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
