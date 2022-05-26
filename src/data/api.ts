import * as dsv from "d3-dsv"; // https://github.com/d3/d3/issues/3469
import type { Bbox, GeoType } from "src/types";
import mem from "mem";
import QuickLRU from "quick-lru";
import { bboxToDataTiles, englandAndWales, getBboxString } from "../helpers/spatialHelper";

export const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "https://api.develop.onsdigital.co.uk/v1/geodata";

// ToDo configure this via env var?
const FetchCensusDataFromFlatFiles = false;

/*
  Fetch place data for all data 'tiles' (predefined coordinate grid squares) that intersect with current viewport 
  bounding box. ToDo extent this to allow fetching from either API or flat files from s3 (ToDoDo - pick which one
  is to be used and deprecate the other!)
*/
export const fetchTileDataForBbox = async (args: {
  totalCode: string;
  categoryCode: string;
  geoType: GeoType;
  bbox: Bbox;
}) => {
  // get all intersecting data tiles
  const dataTiles = bboxToDataTiles(args.bbox, args.geoType);

  if (FetchCensusDataFromFlatFiles) {
    // fetch data from data tile flat files
    console.log("Flat file data fetching still not implemented!!");
  } else {
    // fetch data from api for data tile bounding boxes
    const fetchedData = await Promise.all(
      dataTiles.map((dataTile) => {
        return memFetchQuery({
          totalCode: args.totalCode,
          categoryCode: args.categoryCode,
          geoType: args.geoType,
          bbox: dataTile.bbox,
        });
      }),
    ).then((responseArry) => {
      return responseArry.flat();
    });
    return Promise.resolve(fetchedData);
  }
};

/*
  Fetch census data by for categories categoryCode and totalCode for all geographies of type 'geoType' that fall within
  geographic bounding box 'bbox'. Uses the geodata api 'query' endpoint, see documentation here:
  https://api.develop.onsdigital.co.uk/v1/geodata/swaggerui#/public/get_query__year_
  (develop env access required - ToDo replace w. public API swagger URL when available)
*/
export const fetchQuery = async (args: { totalCode: string; categoryCode: string; geoType: GeoType; bbox: Bbox }) => {
  const bboxParam = getBboxString(args.bbox);
  const url = `${apiBaseUrl}/query/2011?bbox=${bboxParam}&cols=geography_code,${args.totalCode},${args.categoryCode}&geotype=${args.geoType}`;
  const response = await fetch(url);
  const csv = await response.text();
  return dsv.csvParse(csv);
};

/*
  Memoized version of fetchQuery, used to reduce API calls.
*/
export const memFetchQuery = mem(fetchQuery, {
  cacheKey: (arguments_) => {
    return JSON.stringify(arguments_[0]);
  },
  cache: new QuickLRU({ maxSize: 100 }),
});

/*
  Fetch esimated natural breakpoints in data for all census categories in 'categoryCodes', divided by census category
  'totalCode'. Uses the geodata api 'ckmeans' endpoint, see
  documentation here: https://api.develop.onsdigital.co.uk/v1/geodata/swaggerui#/public/get_ckmeans__year_
  (develop env access required - ToDo replace w. public API swagger URL when available)
*/
export const fetchBreaks = async (args: {
  totalCode: string;
  categoryCodes: string[];
  geoType: GeoType;
}): Promise<{ breaks: { [categoryCode: string]: number[] }; minMax: { [categoryCode: string]: number[] } }> => {
  const breakCount = 5;

  // TODO improve this? or don't get here if England & Wales
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

/*
  Memoized version of fetchBreaks, used to reduce API calls.
*/
export const memFetchBreaks = mem(fetchBreaks, {
  cacheKey: (arguments_) => {
    return JSON.stringify(arguments_[0]);
  },
  cache: new QuickLRU({ maxSize: 100 }),
});

/*
  Fetch census data for geography 'geoCode' and all categoryCodes plust totalCode. Uses the geodata api 'query' 
  endpoint, see documentation here: https://api.develop.onsdigital.co.uk/v1/geodata/swaggerui#/public/get_query__year_
  (develop env access required - ToDo replace w. public API swagger URL when available)
*/
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

/*
  Fetch information about geography 'geoCode' (name, bounding box, etc). Uses the geodata api 'geo' endpoint, see
  documentation here: https://api.develop.onsdigital.co.uk/v1/geodata/swaggerui#/public/GetGeo
  (develop env access required - ToDo replace w. public API swagger URL when available)
*/
export const fetchGeographyInfo = async (geoCode: string) => {
  if (geoCode === englandAndWales.meta.code) {
    return JSON.stringify(englandAndWales);
  }
  const url = `${apiBaseUrl}/geo/2011?geocode=${geoCode}`;
  const response = await fetch(url);
  const data = await response.text();
  return data;
};
