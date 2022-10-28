import { derived } from "svelte/store";
import { asyncDerived } from "@square/svelte-store";
import type { GeoType, GeographyInfo, GeographyData } from "../types";
import { fetchGeography } from "../data/api";
import { selection } from "./selection";
import { englandAndWales } from "../helpers/spatialHelper";

// primitive-valued derived stores don't emit when the value doesn't change
// (we don't want the geography store to update unless the geoCode/geoType changes)
const geoCode = derived(selection, ($selection) => $selection.geoCode);
const geoType = derived(selection, ($selection) => $selection.geoType);

/**
 * A Svelte store containing all the data we need to show the selected geography.
 */
export const geography = asyncDerived([geoCode, geoType], async ([$geoCode, $geoType]) => {
  const data = $geoType === "ew" ? englandAndWales : await fetchGeography($geoCode);
  return getGeographyInfo(data);
});

function getGeographyInfo(data: GeographyData): GeographyInfo {
  return {
    geoType: data.meta.geotype.toLowerCase() as GeoType,
    geoCode: data.meta.code,
    displayName: data.meta.name,
    bbox: data.geo_json.features.find((f) => f.id === "bbox").geometry.coordinates,
    boundary: data.geo_json.features.find((f) => f.id === "boundary"),
  };
}
