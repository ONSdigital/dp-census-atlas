import { goto } from "$app/navigation";
import type { GeoType } from "../types";

export const setGeoSearchParam = (place: { geoType: GeoType; geoCode: string }) => {
  let s = `?${place.geoType}=${place.geoCode}`;
  goto(s, { keepfocus: true, replaceState: false, noscroll: true });
};
