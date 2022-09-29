import { englandAndWales } from "./spatialHelper";
import type { AppParams } from "../types";
import { GeoTypes } from "../types";
import { appParamsStore } from "../stores/stores";

export const parseAppParams = (params: URLSearchParams): AppParams => {
  return {
    embed: params.get("embed") === "true",
    ...getSelectedGeography(params),
  };
};

export const setAppParamsStore = (params: AppParams) => {
  appParamsStore.set(params);
};

export function getSelectedGeography(params: URLSearchParams) {
  for (const param of GeoTypes) {
    if (params.has(param)) {
      return {
        geoType: param,
        geoCode: params.get(param),
      };
    }
  }
  return { geoType: englandAndWales.meta.geotype, geoCode: englandAndWales.meta.code };
}
