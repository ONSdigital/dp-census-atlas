import { asyncDerived } from "@square/svelte-store";
import type { GeoType, GeographyInfo, GeographyData } from "../types";
import { fetchGeography } from "../data/api";
import { selection } from "./selection";
import { englandAndWales } from "../helpers/spatialHelper";

/**
 * A Svelte store containing all the data we need to show the selected geography.
 */
export const geography = asyncDerived(
  selection,
  async ($selection) => {
    const data = $selection.geoType === "ew" ? englandAndWales : await fetchGeography($selection.geoCode);
    return getGeographyInfo(data);
  },
  { initial: getGeographyInfo(englandAndWales), reloadable: true },
);

function getGeographyInfo(data: GeographyData): GeographyInfo {
  return {
    geoType: data.meta.geotype as GeoType,
    geoCode: data.meta.code,
    displayName: data.meta.name,
    bbox: data.geo_json.features.find((f) => f.id === "bbox").geometry.coordinates,
    boundary: data.geo_json.features.find((f) => f.id === "boundary"),
  };
}
