import * as dsv from "d3-dsv"; // https://github.com/d3/d3/issues/3469
import { selectedGeographyStore } from "../stores/stores";
import type { GeographyLookupProps } from "../types";
import { defaultGeography } from "../helpers/spatialHelper";

const apiBaseUrl = `https://cep5lmkia0.execute-api.eu-west-1.amazonaws.com/dev`;

export const fetchGeographyData = async (args: { totalCode: string; categoryCodes: string[]; geoCode: string }) => {
  const data = await fetchSelectedGeographyData(args);
  const parsedData = parseSelectedGeographyData(data, args.totalCode);
  let displayName = "England and Wales";
  let geoType = "lad";
  await fetchGeographyLookup(args.geoCode).then((response) => {
    const {
      meta: { name, geotype },
    }: GeographyLookupProps = JSON.parse(response);
    displayName = name;
    geoType = geoType;
  });

  /* TODO: Grab geoType from endpoint */

  selectedGeographyStore.set({
    geoType,
    displayName,
    geoCode: args.geoCode,
    variableData: parsedData,
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
