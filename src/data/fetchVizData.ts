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
  const selectedGeographyData = parseSelectedGeographyData(table, args.totalCode);
  vizStore.set({
    breaks: breaks[args.categoryCode].map((breakpoint) => parseFloat(breakpoint) * 100),
    places: places.map((row) => parsePlaceData(row, args.totalCode, args.categoryCode)),
    params: getCategoryInfo(args.categoryCode),
    variableData: selectedGeographyData.selectedGeoData,
    defaultGeoVariableData: selectedGeographyData.defaultGeoData,
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
  const url = `${apiBaseUrl}/query/2011?cols=geography_code,${args.totalCode},${args.categoryCodes.join(",")}&rows=${
    args.geoCode
  },${defaultGeography.meta.code}`;
  const response = await fetch(url);
  const csv = await response.text();
  return dsv.csvParse(csv);
};

const parseSelectedGeographyData = (rawData: dsv.DSVRowArray, totalCode: string) => {
  // we're expecting one row for the selected geography and one row for the default geography, UNLESS the selected
  // geography IS the default geography, in which case we will only get one row.
  let selectedGeoData;
  let defaultGeoData;
  rawData.forEach((row) => {
    const parsedRow = {};
    for (const [catCode, catCount] of Object.entries(row)) {
      if (![totalCode, "geography_code"].includes(catCode)) {
        const count = parseInt(catCount);
        const total = parseInt(row[totalCode]);
        parsedRow[catCode] = {
          count: count,
          total: total,
          percentage: (count / total) * 100,
        };
      }
    }
    // NB if the selected geography IS teh default geography, the selectedGeographyData object will remain empty...
    if (row.geography_code === defaultGeography.meta.code) {
      defaultGeoData = parsedRow;
    } else {
      selectedGeoData = parsedRow;
    }
  });
  // ... and so substitute any empty selectedGeographyData objects for the default object before returning.
  return {
    selectedGeoData: selectedGeoData || defaultGeoData,
    defaultGeoData: defaultGeoData,
  };
};

const parsePlaceData = (row: dsv.DSVRowString<string>, totalCode: string, categoryCode: string) => {
  const geoCode = row.geography_code;
  const total = parseInt(row[totalCode]);
  const count = parseInt(row[categoryCode]);
  const percentage = (count / total) * 100;
  return { geoCode, count, total, percentage };
};
