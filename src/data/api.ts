import * as dsv from "d3-dsv"; // https://github.com/d3/d3/issues/3469
import type { Bbox, GeoType } from "src/types";
import { englandAndWales, getBboxString, doBboxesIntersect } from "../helpers/spatialHelper";
import cacheGrid from "./cacheGrid";

export const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "https://cep5lmkia0.execute-api.eu-west-1.amazonaws.com/dev";

/* 
  Fetch place data from api as bounding box requests, via closure with shallow cache (one request deep) - reasoning is 
  that using the caching grid (which has quads bigger than the viewport will typically be) will mean that small-medium 
  map movements are likely to result in the same grid quad or set of grid quads being repeatedly requested.
*/
export const getFetchPlaceData = () => {
  const prevReq = {
    totalCode: "",
    categoryCode: "",
    geoType: "",
    quads: [],
    apiResponse: [],
  };

  // returned function actually does the API place data fetching
  return async (args: { totalCode: string; categoryCode: string; geoType: GeoType; bbox: Bbox }) => {
    // pass straight through to fetch function if no caching grid available for geoTypes
    // (ToDo - caching grid for LADs?), so pass args straight through to fetchQuery
    if (!["msoa", "lsoa", "oa"].includes(args.geoType)) {
      return fetchQuery(args);
    }

    // filter cache grid to only quads that intersect with viewport bbox
    const intersectingQuads = cacheGrid[args.geoType].filter((quad) => {
      return doBboxesIntersect({ bbox1: args.bbox, bbox2: quad });
    });

    // check if the set of intersecting quads was previously requested for the same categories / geotype, return 
    // previous flattened response if so
    if (
      prevReq.totalCode === args.totalCode &&
      prevReq.categoryCode === args.categoryCode &&
      prevReq.geoType === args.geoType &&
      intersectingQuads.every((quad) => prevReq.quads.includes(quad))
    ) {
      return Promise.resolve(prevReq.apiResponse);
    }

    // otherwise call fetchQuery on all intersecting quads and flatten results
    const apiResponse = await Promise.all(
      // call fetch on all
      intersectingQuads.map((quad) => {
        return fetchQuery({
          totalCode: args.totalCode,
          categoryCode: args.categoryCode,
          geoType: args.geoType,
          bbox: quad,
        });
      }),
    ).then((responseArry) => {
      return responseArry.flat();
    });

    // set shallow response cache with new values
    prevReq.totalCode = args.totalCode;
    prevReq.categoryCode = args.categoryCode;
    prevReq.geoType = args.geoType;
    prevReq.quads = intersectingQuads;
    prevReq.apiResponse = apiResponse;

    return Promise.resolve(apiResponse);
  };
};

export const fetchQuery = async (args: { totalCode: string; categoryCode: string; geoType: GeoType; bbox: Bbox }) => {
  const bboxParam = getBboxString(args.bbox);
  const url = `${apiBaseUrl}/query/2011?bbox=${bboxParam}&cols=geography_code,${args.totalCode},${args.categoryCode}&geotype=${args.geoType}`;
  const response = await fetch(url);
  const csv = await response.text();
  return dsv.csvParse(csv);
};

export const fetchBreaks = async (args: {
  totalCode: string;
  categoryCodes: string[];
  geoType: GeoType;
}): Promise<{ breaks: { [categoryCode: string]: number[] }; minMax: { [categoryCode: string]: number[] } }> => {
  const breakCount = 5;

  // TODO imporove this? or don't get here if England & Wales
  // return -1s (so that all data will NOT be assigned a break, and the map will remain colorless) if its the default
  // geography (england and wales)
  if (args.geoType === englandAndWales.meta.geotype) {
    const noBreaksBreaks = {};
    const noBreaksMinMax = {};
    for (const categoryCode of args.categoryCodes) {
      noBreaksBreaks[categoryCode] = Array(breakCount).fill(-1);
      noBreaksMinMax[categoryCode] = Array(2).fill(-1);
    }
    return { breaks: noBreaksBreaks, minMax: noBreaksMinMax };
  }

  const url = `${apiBaseUrl}/ckmeans/2011?divide_by=${args.totalCode}&cat=${args.categoryCodes.join(",")}&geotype=${
    args.geoType
  }&k=${breakCount}`;
  const response = await fetch(url);
  const parsed = await response.json();

  // (ignore data from the API for geotypes we don't need)
  const breaks = Object.fromEntries(
    Object.keys(parsed).map((code) => [code, parsed[code][args.geoType.toUpperCase()]]),
  );
  const minMax = Object.fromEntries(
    Object.keys(parsed).map((code) => [code, parsed[code][`${args.geoType.toUpperCase()}_min_max`]]),
  );

  return { breaks, minMax };
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
