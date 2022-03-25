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
  // we're expecting one row for the selected geography and one row for the default geography, UNLESS the selected
  // geography IS the default geography, in which case we will only get one row.
  var selectedGeographyData;
  var defaultGeographyData;
  rawData.forEach((row) => {
    var parsedRow = {};
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
      defaultGeographyData = parsedRow;
    } else {
      selectedGeographyData = parsedRow;
    }
  });
  // ... and so substitute any empty selectedGeographyData objects for the default object before returning.
  return {
    selectedGeographyData: selectedGeographyData || defaultGeographyData,
    defaultGeographyData: defaultGeographyData,
  };
};
