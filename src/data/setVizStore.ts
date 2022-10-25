import type * as dsv from "d3-dsv"; // https://github.com/d3/d3/issues/3469
import { get } from "svelte/store";
import { fetchTileDataForBbox, fetchBreaks } from "./api";
import type { Bbox, Category, GeoType, VariableGroup } from "../types";
import { vizStore, vizLoaded } from "../stores/stores";
import { getCategoryInfo } from "../helpers/categoryHelpers";

export const setVizStore = async (args: {
  category: Category;
  geoType: GeoType;
  geoCode: string;
  bbox: Bbox;
  zoom: number;
  variableGroups: VariableGroup[];
}) => {
  const [places, breaksData] = await Promise.all([fetchTileDataForBbox(args), fetchBreaks(args)]);
  const placesNew = places.map((row) => parsePlaceData(row, args.category.code));
  vizStore.set({
    geoType: args.geoType,
    breaks: breaksData.breaks[args.category.code],
    minMaxVals: breaksData.minMax[args.category.code],
    places: placesNew,
    params: getCategoryInfo(args.category.code, args.variableGroups),
  });
  // Keep track of loaded geoCodes by geoType
  const geoCodesNew = placesNew.map(p => p.geoCode);
  let loadedCodes = get(vizLoaded) ? get(vizLoaded).geoCodes :
    {lad: new Set([]), msoa: new Set([]), oa: new Set([])};
  loadedCodes[args.geoType] = new Set([...Array.from(loadedCodes[args.geoType]), ...geoCodesNew]);
  vizLoaded.set({
    catCode: args.category.slug,
    geoCodes: loadedCodes
  });
  return Promise.resolve();
};

const parsePlaceData = (row: dsv.DSVRowString<string>, categoryCode: string) => {
  const geoCode = row.geography_code;
  const ratioToTotal = parseFloat(row[categoryCode]);
  return { geoCode, ratioToTotal };
};
