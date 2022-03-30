import { goto } from "$app/navigation";
import type { GeoType } from "../types";

export const handleLocationSelect = (place: { geoType: GeoType; geoCode: string }) => {
  const s = `?${place.geoType}=${place.geoCode}`;
  if (window.location.pathname === "/") {
    goto(`/2021/location${s}`, { keepfocus: true, replaceState: false, noscroll: true });
  } else {
    const s = `?${place.geoType}=${place.geoCode}`;
    goto(s, { keepfocus: true, replaceState: false, noscroll: true });
  }
};
