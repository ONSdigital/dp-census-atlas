import { goto } from "$app/navigation";
import type { GeoType } from "../types";
import { GeoTypes } from "../types";
import { setGeographyParam } from "./urlHelper";

export const selectGeography = (params: URLSearchParams, g: { geoType: GeoType; geoCode: string }) => {
  const newer = setGeographyParam(params, g);
  gotoParams(newer);
};

export const deselectGeography = (params: URLSearchParams) => {
  const newer = new URLSearchParams(params);
  for (const param of GeoTypes) {
    newer.delete(param);
  }
  gotoParams(newer);
};

export const selectGeoTypeLock = (params: URLSearchParams, geoType: GeoType) => {
  const newer = new URLSearchParams(params);
  newer.set("geoLock", geoType);
  gotoParams(newer);
};

export const deselectGeoTypeLock = (params: URLSearchParams) => {
  const newer = new URLSearchParams(params);
  newer.delete("geoLock");
  gotoParams(newer);
};

const gotoParams = (newer: URLSearchParams) => {
  goto(`?${newer.toString()}`, { keepFocus: true, noScroll: true });
};

export const gotoUrl = (url: string) => {
  goto(url, { keepFocus: true, noScroll: true });
};
