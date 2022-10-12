import type * as dsv from "d3-dsv"; // https://github.com/d3/d3/issues/3469
import { get } from "svelte/store";
import { fetchTileDataForBbox, fetchBreaks } from "./api";
import type { Bbox, Category, GeoType, VariableGroup } from "../types";
import { vizStore, categoryStore } from "../stores/stores";
import { getCategoryInfo } from "../helpers/categoryHelpers";

export const setVizStore = async (args: {
  category: Category;
  geoType: GeoType;
  geoCode: string;
  bbox: Bbox;
  zoom: number;
  variableGroups: VariableGroup[];
}) => {
  // Setting categoryStore before visStore seems to avoid a race condition
  if (get(categoryStore) !== args.category) categoryStore.set(args.category);
  const [places, breaksData] = await Promise.all([fetchTileDataForBbox(args), fetchBreaks(args)]);
  vizStore.set({
    geoType: args.geoType,
    breaks: breaksData.breaks[args.category.code],
    minMaxVals: breaksData.minMax[args.category.code],
    places: places.map((row) => parsePlaceData(row, args.category.code)),
    params: getCategoryInfo(args.category.code, args.variableGroups),
  });
  return Promise.resolve();
};

const parsePlaceData = (row: dsv.DSVRowString<string>, categoryCode: string) => {
  const geoCode = row.geography_code;
  const ratioToTotal = parseFloat(row[categoryCode]);
  return { geoCode, ratioToTotal };
};
