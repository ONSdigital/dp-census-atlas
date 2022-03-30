import * as dsv from "d3-dsv"; // https://github.com/d3/d3/issues/3469
import type { Bbox, GeoType } from "src/types";
import { englandAndWales, getBboxString } from "../helpers/spatialHelper";

export const apiBaseUrl = `https://cep5lmkia0.execute-api.eu-west-1.amazonaws.com/dev`;

export const fetchQuery = async (args: { totalCode: string; categoryCode: string; geoType: GeoType; bbox: Bbox }) => {
  const bboxParam = getBboxString(args.bbox);
  const url = `${apiBaseUrl}/query/2011?bbox=${bboxParam}&cols=geography_code,${args.totalCode},${args.categoryCode}&geotype=${args.geoType}`;
  const response = await fetch(url);
  const csv = await response.text();
  return dsv.csvParse(csv);
};

export const fetchBreaks = async (args: { totalCode: string; categoryCodes: string[]; geoType: GeoType }) => {
  const breakCount = 5;

  // TODO imporove this? or don't get here if England & Wales
  // return -1s (so that all data will NOT be assigned a break, and the map will remain colorless) if its the default
  // geography (england and wales)
  if (args.geoType === englandAndWales.meta.geotype) {
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

export const fetchSelectedGeographyData = async (args: {
  totalCode: string;
  categoryCodes: string[];
  geoCode: string;
}) => {
  const url = `${apiBaseUrl}/query/2011?cols=geography_code,${args.totalCode},${args.categoryCodes.join(",")}&rows=${
    args.geoCode
  },${englandAndWales.meta.code}`;
  const response = await fetch(url);
  const csv = await response.text();
  return dsv.csvParse(csv);
};

export const fetchGeographyInfo = async (geoCode: string) => {
  if (geoCode === englandAndWales.meta.code) {
    return JSON.stringify(englandAndWales);
  }
  const url = `${apiBaseUrl}/geo/2011?geocode=${geoCode}`;
  const response = await fetch(url);
  const data = await response.text();
  return data;
};
