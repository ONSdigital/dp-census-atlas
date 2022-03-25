import * as dsv from "d3-dsv"; // https://github.com/d3/d3/issues/3469
import { selectedGeographyStore } from "../stores/stores";
import type { GeographyLookupProps } from "../types";
import { defaultGeography } from "../helpers/spatialHelper";

const apiBaseUrl = `https://cep5lmkia0.execute-api.eu-west-1.amazonaws.com/dev`;

export const fetchGeographyData = async (args: { totalCode: string; categoryCodes: string[]; geoCode: string }) => {
  const data = await fetchSelectedGeographyData(args);
  const parsedData = parseSelectedGeographyData(data, args.totalCode);
  let displayName = defaultGeography.meta.name;
  let geoType = defaultGeography.meta.geotype;
  await fetchGeographyLookup(args.geoCode).then((response) => {
    const {
      meta: { name, geotype },
    }: GeographyLookupProps = JSON.parse(response);
    displayName = name;
    geoType = geoType.toLowerCase();
  });

  /* TODO: Grab geoType from endpoint */

  selectedGeographyStore.set({
    geoType,
    displayName,
    geoCode: args.geoCode,
    variableData: parsedData.selectedGeographyData,
    defaultGeoVariableData: parsedData.defaultGeographyData,
  });
  return Promise.resolve();
};

export const fetchGeographyLookup = async (location: string, useCode = true) => {
  // return defaultGeography if the name or code matches...
  if ((useCode && defaultGeography.meta.code == location) || defaultGeography.meta.name == location) {
    return JSON.stringify(defaultGeography);
  }
  // otherwise query API
  const url = `${apiBaseUrl}/geo/2011?${useCode ? "geocode" : "geoname"}=${location}`;
  const response = await fetch(url);
  const data = await response.text();
  return data;
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
  // parse selected geographyrow from default geography row (used for comparisons)
  var selectedGeographyRow = rawData.find((row) => row.geography_code != defaultGeography.meta.code);
  const defaultGeographyRow = rawData.find((row) => row.geography_code === defaultGeography.meta.code);

  // now row found that is NOT equal to the defaultGeography code, we must be getting data for the defaultGeography ONLY
  if (!selectedGeographyRow) {
    selectedGeographyRow = defaultGeographyRow;
  }

  // get totals categories for both
  const selectedTotal = parseInt(selectedGeographyRow[totalCode]);
  const defaultTotal = parseInt(defaultGeographyRow[totalCode]);

  // loop through non-totals categories and process
  const catCodesArr = rawData.columns.filter((catCode) => ![totalCode, "geography_code"].includes(catCode));
  console.log(catCodesArr);
  const parsedData = {
    selectedGeographyData: {},
    defaultGeographyData: {},
  };
  catCodesArr.forEach((categoryCode) => {
    // process selected geography
    const selectedCount = parseInt(selectedGeographyRow[categoryCode]);
    const selectedPercentage = (selectedCount / selectedTotal) * 100;
    parsedData.selectedGeographyData[categoryCode] = {
      count: selectedCount,
      total: selectedTotal,
      percentage: selectedPercentage,
    };

    // process default geography (used for comparisons)
    const defaultCount = parseInt(defaultGeographyRow[categoryCode]);
    const defaultPercentage = (defaultCount / defaultTotal) * 100;
    parsedData.defaultGeographyData[categoryCode] = {
      count: defaultCount,
      total: defaultTotal,
      percentage: defaultPercentage,
    };
  });
  return parsedData;
};
