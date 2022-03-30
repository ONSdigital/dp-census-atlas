import type * as dsv from "d3-dsv"; // https://github.com/d3/d3/issues/3469
import { fetchBreaks, fetchQuery } from "./api";
import type { Bbox, GeoType } from "../types";
import { vizStore } from "../stores/stores";
import { getCategoryInfo } from "../helpers/categoryHelpers";

export const setVizStore = async (args: {
  totalCode: string;
  categoryCode: string;
  categoryCodes: string[];
  geoType: GeoType;
  geoCode: string;
  bbox: Bbox;
}) => {
  const [places, breaks] = await Promise.all([fetchQuery(args), fetchBreaks(args)]);
  vizStore.set({
    breaks: breaks[args.categoryCode].map((breakpoint) => parseFloat(breakpoint) * 100),
    places: places.map((row) => parsePlaceData(row, args.totalCode, args.categoryCode)),
    params: getCategoryInfo(args.categoryCode),
  });
  return Promise.resolve();
};

// TODO do we actually use the percentages now?
const parsePlaceData = (row: dsv.DSVRowString<string>, totalCode: string, categoryCode: string) => {
  const geoCode = row.geography_code;
  const total = parseInt(row[totalCode]);
  const count = parseInt(row[categoryCode]);
  const percentage = (count / total) * 100;
  return { geoCode, count, total, percentage };
};
