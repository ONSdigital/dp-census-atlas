import * as dsv from "d3-dsv"; // https://github.com/d3/d3/issues/3469
import type { Bbox, Category, Classification, DataTile, GeographyData, GeoType } from "src/types";
import { bboxToDataTiles } from "../helpers/spatialHelper";
import { uniqueRoundedClassificationBreaks } from "../helpers/classificationHelpers";

const geoBaseUrl = "https://cdn.ons.gov.uk/maptiles/cm-geos/v2";
const changeOverTimeBaseUrl = "https://ons-dp-sandbox-atlas-data.s3.eu-west-2.amazonaws.com/FAKE/2011-2021-comparison";

/*
  Fetch place data files for all data 'tiles' (predefined coordinate grid squares) that intersect with current viewport
  bounding box.
*/
export const fetchDataForBbox = async (args: {
  category: Category;
  geoType: GeoType;
  bbox: Bbox;
  changeOverTime: boolean;
}) => {
  const data = await fetchTileDataForBbox(args);
  return data.map((row) => parsePlaceData(row, args.category.code));
};

const fetchTileDataForBbox = async (args: {
  category: Category;
  geoType: GeoType;
  bbox: Bbox;
  changeOverTime: boolean;
}) => {
  // get all intersecting data tiles
  const dataTiles = bboxToDataTiles(args.bbox, args.geoType);

  // fetch data from data tile files
  const fetched = await Promise.all(
    dataTiles.map((dataTile) => {
      return fetchTileData({
        category: args.category,
        geoType: args.geoType,
        tile: dataTile,
        changeOverTime: args.changeOverTime,
      });
    }),
  );

  return fetched.flat();
};

const parsePlaceData = (row: dsv.DSVRowString<string>, categoryCode: string) => {
  const geoCode = row.geography_code;
  const categoryValue = parseFloat(row[categoryCode]);
  return { geoCode, categoryValue };
};

/*
  Fetch json with census data by for categories categoryCode and totalCode for all geographies of type 'geoType' that
  fall within geographic bounding box represented by 'tile'.
*/
export const fetchTileData = async (args: {
  category: Category;
  geoType: GeoType;
  tile: DataTile;
  changeOverTime: boolean;
}) => {
  let baseUrl = args.category.baseUrl;
  if (args.changeOverTime) {
    baseUrl = changeOverTimeBaseUrl;
  }
  const url = `${baseUrl}/tiles/${args.geoType}/${args.tile.tilename}/${args.category.code}.csv`;
  const response = await fetch(url);
  const csv = await response.text();
  return dsv.csvParse(csv);
};

/*
  Fetch json with estimated natural breakpoints (w. ckmeans algorithm) in category data. Breaks include min value for
  category as first value.
*/
export const fetchBreaks = async (args: {
  classification: Classification;
  category: Category;
  geoType: GeoType;
  changeOverTime: boolean;
}): Promise<{ breaks: number[] }> => {
  let baseUrl = args.category.baseUrl;
  if (args.changeOverTime) {
    baseUrl = changeOverTimeBaseUrl;
  }
  const url = `${baseUrl}/breaksCkmeans/${args.geoType}/${args.category.code}.json`;
  const response = await fetch(url);
  const breaksRaw = await response.json();
  const breaks = uniqueRoundedClassificationBreaks(args.classification.code, breaksRaw);
  return { breaks };
};

/*
  Fetch json with bounding box for geography.
*/
export const fetchGeography = async (geoCode: string): Promise<GeographyData> => {
  const url = `${geoBaseUrl}/${geoCode}.geojson`;
  const response = await fetch(url);
  return await response.json();
};
