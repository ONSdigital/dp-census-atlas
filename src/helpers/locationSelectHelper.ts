import { goto } from "$app/navigation";
import type { GeoType } from "../types";

export const handleLocationSelect = (place: { geoType: GeoType; geoCode: string }) => {
  const s = `?${place.geoType}=${place.geoCode}`;
  if (window.location.pathname === "/") {
    //if user selects a location from the index page, redirect to location page
    goto(`/2021/location${s}`, { keepfocus: true, replaceState: false, noscroll: true });
  } else {
    //on all other pages, just add geo search param to url
    const s = `?${place.geoType}=${place.geoCode}`;
    goto(s, { keepfocus: true, replaceState: false, noscroll: true });
  }
};
