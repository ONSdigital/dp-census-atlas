import * as dsv from "d3-dsv"; // https://github.com/d3/d3/issues/3469
import type { Bbox, GeoType, DataTile } from "src/types";
import mem from "mem";
import QuickLRU from "quick-lru";
import { bboxToDataTiles, englandAndWales } from "../helpers/spatialHelper";

const s3BaseUrl = "https://find-insights-db-dumps.s3.eu-central-1.amazonaws.com/quads";

/*
  Fetch place data files for all data 'tiles' (predefined coordinate grid squares) that intersect with current viewport 
  bounding box.
*/
export const fetchTileDataForBbox = async (args: { categoryCode: string; geoType: GeoType; bbox: Bbox }) => {
  // get all intersecting data tiles
  const dataTiles = bboxToDataTiles(args.bbox, args.geoType);

  // fetch data from data tile files
  const fetchedData = await Promise.all(
    dataTiles.map((dataTile) => {
      return memFetchTileData({
        categoryCode: args.categoryCode,
        geoType: args.geoType,
        tile: dataTile,
      });
    }),
  ).then((responseArry) => {
    return responseArry.flat();
  });
  return Promise.resolve(fetchedData);
};

/*
  Fetch census data by for categories categoryCode and totalCode for all geographies of type 'geoType' that fall within
  geographic bounding box 'bbox'. Uses the geodata api 'query' endpoint, see documentation here:
  https://api.develop.onsdigital.co.uk/v1/geodata/swaggerui#/public/get_query__year_
  (develop env access required - ToDo replace w. public API swagger URL when available)
*/
export const fetchTileData = async (args: { categoryCode: string; geoType: GeoType; tile: DataTile }) => {
  const url = `${s3BaseUrl}/${args.geoType}/${args.tile.tilename}/${args.categoryCode}.csv`;
  const response = await fetch(url);
  const csv = await response.text();
  return dsv.csvParse(csv);
};

/*
  Memoized version of fetchQuery, used to reduce API calls.
*/
export const memFetchTileData = mem(fetchTileData, {
  cacheKey: (arguments_) => {
    return JSON.stringify(arguments_[0]);
  },
  cache: new QuickLRU({ maxSize: 100 }),
});

// ToDo This function needs some love!
/*
  Fetch esimated natural breakpoints in data for all census categories in 'categoryCodes', divided by census category
  'totalCode'. Uses the geodata api 'ckmeans' endpoint, see
  documentation here: https://api.develop.onsdigital.co.uk/v1/geodata/swaggerui#/public/get_ckmeans__year_
  (develop env access required - ToDo replace w. public API swagger URL when available)
*/
export const fetchBreaks = async (args: {
  categoryCode: string;
  geoType: GeoType;
}): Promise<{ breaks: { [categoryCode: string]: number[] }; minMax: { [categoryCode: string]: number[] } }> => {
  const breakCount = 5;

  // TODO improve this? or don't get here if England & Wales
  // return -1s (so that all data will NOT be assigned a break, and the map will remain colorless) if its the default
  // geography (england and wales)
  if (args.geoType === englandAndWales.meta.geotype) {
    const noBreaksBreaks = {
      [args.categoryCode]: Array(breakCount).fill(-1),
    };
    const noBreaksMinMax = {
      [args.categoryCode]: Array(2).fill(-1),
    };
    return { breaks: noBreaksBreaks, minMax: noBreaksMinMax };
  }

  const url = `${s3BaseUrl}/breaks/${args.geoType}/${args.categoryCode}.json`;
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
  DUMMY FUNCTION (to be removed!) Just returns 1 for every category requested.
*/
export const fetchSelectedGeographyData = async (args: {
  totalCode: string;
  categoryCodes: string[];
  geoCode: string;
}) => {
  const dummyData = `geography_code,${args.totalCode},${args.categoryCodes.join(",")}\n${
    args.geoCode
  },1,${args.categoryCodes.map(() => 1).join(",")}`;
  return dsv.csvParse(dummyData);
};

/*
  DUMMY FUNCTION (to be removed!) Just returns England and Wales data with the geocode changed.
*/
export const fetchGeographyInfo = async (geoCode: string) => {
  const dummyData = englandAndWales;
  dummyData.meta.code = geoCode;
  return JSON.stringify(dummyData);
};
