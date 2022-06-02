import type * as dsv from "d3-dsv"; // https://github.com/d3/d3/issues/3469
import type { GeographyInfo } from "../types";
import { englandAndWales } from "../helpers/spatialHelper";

export const parseSelectedGeographyData = (rawData: dsv.DSVRowArray, totalCode: string) => {
  // we're expecting one row for the selected geography and one row for England and Wales,
  // UNLESS it is England and Wales,in which case we will only get one row.
  let selectedGeoData;
  let englandAndWalesGeoData;
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
    selectedGeographyTotal = rawData[0][totalCode];
    englandAndWalesGeoData = parsedRow;
  });
  // ... and so substitute any empty selectedGeographyData objects for the default object before returning.
  return {
    selectedGeoData: selectedGeoData || englandAndWalesGeoData,
    englandAndWalesGeoData: englandAndWalesGeoData,
    selectedGeographyTotal: selectedGeographyTotal,
  };
};

export const parseGeographyInfo = (rawGeographyInfo: string) => {
  return JSON.parse(rawGeographyInfo) as GeographyInfo;
};
