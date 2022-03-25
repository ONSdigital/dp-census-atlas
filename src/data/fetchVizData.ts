import * as dsv from "d3-dsv"; // https://github.com/d3/d3/issues/3469
import type { Bbox, GeoType } from "../types";
import { vizStore } from "../stores/stores";
import { defaultGeography, getBboxString } from "../helpers/spatialHelper";
import { getCategoryInfo } from "../helpers/categoryHelpers";

const apiBaseUrl = `https://cep5lmkia0.execute-api.eu-west-1.amazonaws.com/dev`;

export const fetchVizData = async (args: {
  totalCode: string;
  categoryCode: string;
  categoryCodes: string[];
  geoType: GeoType;
  geoCode: string;
  bbox: Bbox;
}) => {
  const [places, breaks, table] = await Promise.all([
    fetchQuery(args),
    fetchBreaks(args),
    fetchSelectedGeographyData(args),
  ]);
  vizStore.set({
    breaks: breaks[args.categoryCode].map((breakpoint) => parseFloat(breakpoint) * 100),
    places: places.map((row) => parsePlaceData(row, args.totalCode, args.categoryCode)),
    params: getCategoryInfo(args.categoryCode),
    variableData: parseSelectedGeographyData(table, args.totalCode),
  });
  return Promise.resolve();
};

const fetchQuery = async (args: { totalCode: string; categoryCode: string; geoType: GeoType; bbox: Bbox }) => {
  const bboxParam = getBboxString(args.bbox);
  const url = `${apiBaseUrl}/query/2011?bbox=${bboxParam}&cols=geography_code,${args.totalCode},${args.categoryCode}&geotype=${args.geoType}`;
  const response = await fetch(url);
  const csv = await response.text();
  return dsv.csvParse(csv);
};

const fetchBreaks = async (args: { totalCode: string; categoryCodes: string[]; geoType: GeoType }) => {
  const breakCount = 5;

  // return -1s (so that all data will NOT be assigned a break, and the map will remain colorless) if its the default
  // geography (england and wales)
  if (args.geoType === defaultGeography.meta.geotype) {
    const noBreaksBreaks = {};
    for (const categoryCode of args.categoryCodes) {
      noBreaksBreaks[categoryCode] = Array(breakCount).fill(-1);
    }
    return noBreaksBreaks;
  }

  const url = `${apiBaseUrl}/ckmeans/2011?divide_by=${args.totalCode}&cat=${args.categoryCodes.join(",")}&geotype=${
    args.geoType
  }&k=${breakCount}`;
  const response = await fetch(url);
  const parsed = await response.json();

  // (ignore data from the API that we don't need)
  return Object.fromEntries(Object.keys(parsed).map((code) => [code, parsed[code][args.geoType.toUpperCase()]]));
};

const fetchSelectedGeographyData = async (args: { totalCode: string; categoryCodes: string[]; geoCode: string }) => {
  const url = `${apiBaseUrl}/query/2011?cols=${args.totalCode},${args.categoryCodes.join(",")}&rows=${args.geoCode}`;
  const response = await fetch(url);
  const csv = await response.text();
  return dsv.csvParse(csv);
};

const parseSelectedGeographyData = (rawData: dsv.DSVRowArray<string>, totalCode: string) => {
  const total = parseInt(rawData[0][totalCode]);
  const catCodesArr = rawData.columns.filter((catCode) => catCode != totalCode);
  const selectedGeographyData = {};
  catCodesArr.forEach((categoryCode) => {
    const count = parseInt(rawData[0][categoryCode]);
    const percentage = (count / total) * 100;
    selectedGeographyData[categoryCode] = { count: count, total: total, percentage: percentage };
  });
  return selectedGeographyData;
};

const parsePlaceData = (row: dsv.DSVRowString<string>, totalCode: string, categoryCode: string) => {
  const geoCode = row.geography_code;
  const total = parseInt(row[totalCode]);
  const count = parseInt(row[categoryCode]);
  const percentage = (count / total) * 100;
  return { geoCode, count, total, percentage };
};
