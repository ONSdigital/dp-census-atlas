import * as dsv from "d3-dsv"; // https://github.com/d3/d3/issues/3469
import type { Bbox, GeoType } from "../types";
import { vizStore, selectedLocationDataStore } from "../stores/stores";
import { getBboxString } from "../helpers/spatialHelper";
import { getCategoryInfo } from "../helpers/categoryHelper";

const apiBaseUrl = `https://cep5lmkia0.execute-api.eu-west-1.amazonaws.com/dev`;

export const fetchVizData = async (args: {
  totalCode: string;
  categoryCode: string;
  categoryCodes: string[];
  geoType: GeoType;
  bbox: Bbox;
}) => {
  let vizData = await Promise.all([fetchQuery(args), fetchBreaks(args)]);
  vizStore.set({
    breaks: vizData[1][args.categoryCode].map((breakpoint) => parseFloat(breakpoint) * 100),
    places: vizData[0].map((row) => parsePlaceData(row, args.totalCode, args.categoryCode)),
    params: getCategoryInfo(args.categoryCode),
  });

  return Promise.resolve();
};

const fetchQuery = async (args: { totalCode: string; categoryCode: string; geoType: GeoType; bbox: Bbox }) => {
  let bboxParam = getBboxString(args.bbox);
  let url = `${apiBaseUrl}/query/2011?bbox=${bboxParam}&cols=geography_code,${args.totalCode},${args.categoryCode}&geotype=${args.geoType}`;
  let response = await fetch(url);
  let csv = await response.text();
  return dsv.csvParse(csv);
};

const fetchBreaks = async (args: { totalCode: string; categoryCodes: string[]; geoType: GeoType }) => {
  const breakCount = 5;

  let url = `${apiBaseUrl}/ckmeans/2011?divide_by=${args.totalCode}&cat=${args.categoryCodes.join(",")}&geotype=${
    args.geoType
  }&k=${breakCount}`;
  let response = await fetch(url);
  let parsed = await response.json();

  // (ignore data from the API that we don't need)
  return Object.fromEntries(Object.keys(parsed).map((code) => [code, parsed[code][args.geoType.toUpperCase()]]));
};

export const fetchCensusTableData = async (args: { geoCode: string; tableCode: string; totalCode: string }) => {
  const data = await fetchTableQuery({ geoCode: args.geoCode, tableCode: args.tableCode });
  selectedLocationDataStore.set(parseTableData(data, args.totalCode));
};

const fetchTableQuery = async (args: { geoCode: string; tableCode: string }) => {
  const url = `${apiBaseUrl}/query/2011?rows=${args.geoCode}&censustable=${args.tableCode}`;
  const response = await fetch(url);
  const csv = await response.text();
  return dsv.csvParse(csv);
};

const parsePlaceData = (row: dsv.DSVRowString<string>, totalCode: string, categoryCode: string) => {
  let geoCode = row.geography_code;
  let total = parseInt(row[totalCode]);
  let count = parseInt(row[categoryCode]);
  let percentage = (count / total) * 100;
  return { geoCode, count, total, percentage };
};

const parseTableData = (rawTableData: dsv.DSVRowArray<string>, totalCode: string) => {
  const total = parseInt(rawTableData[0][totalCode]);
  const catCodesArr = rawTableData.columns.filter((catCode) => catCode != totalCode);
  const selectedLocationData = {}
  catCodesArr.forEach((categoryCode) => {
    const count = parseInt(rawTableData[0][categoryCode]);
    const percentage = (count / total) * 100;
    selectedLocationData[categoryCode] = { count: count, total: total, percentage: percentage };
  });
  return selectedLocationData
};
