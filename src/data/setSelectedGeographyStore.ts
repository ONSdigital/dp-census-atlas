import type * as dsv from "d3-dsv"; // https://github.com/d3/d3/issues/3469
// import * as dsv from "d3-dsv"; // https://github.com/d3/d3/issues/3469
import { getCodesForCategory } from "../helpers/categoryHelpers";
import { englandAndWales } from "../helpers/spatialHelper";
import type { GeographyInfo, GeoType } from "../types";
import { selectedGeographyStore } from "../stores/stores";
import { fetchGeographyInfoByGeoCode, fetchSelectedGeographyData } from "./api";

export const setSelectedGeographyStore = async (args: { geoType: GeoType; geoCode: string }) => {
  const peopleCodes = getCodesForCategory("health", "general-health", "default", "very-good-health");
  const householdsCodes = getCodesForCategory("housing", "size-of-household", "default", "1-person-households");

  const [geographyinfo, peopleTotal, householdTotal] = await Promise.all([
    fetchGeographyInfoByGeoCode(args.geoCode),
    fetchSelectedGeographyData({
      totalCode: peopleCodes.totalCode,
      categoryCodes: peopleCodes.categoryCodes,
      geoCode: args.geoCode,
    }),
    fetchSelectedGeographyData({
      totalCode: householdsCodes.totalCode,
      categoryCodes: householdsCodes.categoryCodes,
      geoCode: args.geoCode,
    }),
  ]);
  const parsedGeographyInfo = parseGeographyInfo(geographyinfo);
  console.log(parseGeographyInfo);
  selectedGeographyStore.set({
    geoType: parsedGeographyInfo.meta.geotype.toLowerCase(),
    geoCode: parsedGeographyInfo.meta.code,
    displayName: parsedGeographyInfo.meta.name,
    bbox: parsedGeographyInfo.geo_json.features.find((f) => f.id === "bbox").geometry.coordinates as [
      number,
      number,
      number,
      number,
    ],
    allHouseholdsTotal: parseSelectedGeographyData(householdTotal, householdsCodes.totalCode).selectedGeographyTotal,
    allPeopleTotal: parseSelectedGeographyData(peopleTotal, peopleCodes.totalCode).selectedGeographyTotal,
  });
  return Promise.resolve();
};

export const parseGeographyInfo = (rawGeographyInfo: string) => {
  console.log(rawGeographyInfo);
  return JSON.parse(rawGeographyInfo) as GeographyInfo;
};
export const parseSelectedGeographyData = (rawData: dsv.DSVRowArray, totalCode: string) => {
  // we're expecting one row for the selected geography and one row for the default geography, UNLESS the selected
  // geography IS the default geography, in which case we will only get one row.
  let selectedGeoData;
  let defaultGeoData;
  let selectedGeographyTotal;
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
    // if the selected geography IS the default geography,
    // the selectedGeographyData object will remain empty...
    if (row.geography_code === englandAndWales.meta.code) {
      selectedGeographyTotal = rawData[0][totalCode];
      defaultGeoData = parsedRow;
    } else {
      selectedGeographyTotal = rawData[1][totalCode];
      selectedGeoData = parsedRow;
    }
  });
  // ... and so substitute any empty selectedGeographyData objects for the default object before returning.
  return {
    selectedGeoData: selectedGeoData || defaultGeoData,
    defaultGeoData: defaultGeoData,
    selectedGeographyTotal: selectedGeographyTotal,
  };
};
