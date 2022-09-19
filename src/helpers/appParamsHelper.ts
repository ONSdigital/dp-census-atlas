import { goto } from "$app/navigation";
import { englandAndWales } from "./spatialHelper";
import type { AppParams, GeoType } from "../types";
import { GeoTypes } from "../types";
import { appParamsStore } from "../stores/stores";

export const parseAppParams = (params: URLSearchParams): AppParams => {
  return {
    embed: params.get("embed") === "true",
    // pym: params.get("pym") ?? "600",
    ...getSelectedGeography(params),
  };
};

export const setAppParamsStore = (params: AppParams) => {
  appParamsStore.set(params);
};

export const selectGeography = (params: URLSearchParams, g: { geoType: GeoType; geoCode: string }) => {
  const newer = new URLSearchParams(params);
  newer.set(g.geoType.toLowerCase(), g.geoCode);
  gotoParams(newer);
};

export const deselectGeography = (params: URLSearchParams) => {
  const newer = new URLSearchParams(params);
  for (const param of GeoTypes) {
    newer.delete(param);
  }
  gotoParams(newer);
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

const gotoParams = (newer: URLSearchParams) => {
  goto(`?${newer.toString()}`, { keepfocus: true, replaceState: false, noscroll: true });
};
