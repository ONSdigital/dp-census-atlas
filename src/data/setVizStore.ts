import type * as dsv from "d3-dsv"; // https://github.com/d3/d3/issues/3469
import { fetchTileDataForBbox, fetchBreaks } from "./api";
import type { Bbox, GeoType, Topic } from "../types";
import { vizStore } from "../stores/stores";
import { getCategoryInfo } from "../helpers/categoryHelpers";

export const setVizStore = async (args: {
  categoryCode: string;
  geoType: GeoType;
  geoCode: string;
  bbox: Bbox;
  zoom: number;
  topics: [Topic]
}) => {
  const [places, breaksData] = await Promise.all([fetchTileDataForBbox(args), fetchBreaks(args)]);
  vizStore.set({
    geoType: args.geoType,
    breaks: breaksData.breaks[args.categoryCode],
    minMaxVals: breaksData.minMax[args.categoryCode],
    places: places.map((row) => parsePlaceData(row, args.categoryCode)),
    params: getCategoryInfo(args.categoryCode, args.topics),
  });
  return Promise.resolve();
};

const parsePlaceData = (row: dsv.DSVRowString<string>, categoryCode: string) => {
  const geoCode = row.geography_code;
  const ratioToTotal = parseFloat(row[categoryCode]);
  return { geoCode, ratioToTotal };
};
