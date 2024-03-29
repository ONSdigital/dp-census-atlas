import * as dsv from "d3-dsv"; // https://github.com/d3/d3/issues/3469
import type { Bbox, Category, Classification, DataTile, GeographyData, GeoType, Mode } from "../types";
import { bboxToDataTiles } from "../helpers/spatialHelper";
import { uniqueRoundedClassificationBreaks } from "../helpers/classificationHelpers";

const geoBaseUrl = "https://cdn.ons.gov.uk/maptiles/cm-geos/v2";

const getSingleCategoryUrl = (args: any) =>
  `${args.baseUrl}/tiles/${args.geoType}/${args.tile.tilename}/${args.category.code}.csv`;

const getMultiCategoryUrl = (args: any) => {
  // https://onsvisual.github.io/dot-density-data/output/data/tiles/msoa/126-83-8/country_of_birth_3a.csv
  return `${args.baseUrl}/tiles/${args.geoType}/${args.tile.tilename}/${args.classification.code}.csv`;
};

/*
  Fetch place data files for all data 'tiles' (predefined coordinate grid squares) that intersect with current viewport
  bounding box.
*/
export const fetchSingleCategoryDataForBbox = async (args: {
  category: Category;
  geoType: GeoType;
  bbox: Bbox;
  baseUrl: string;
}) => {
  const data = await fetchTileDataForBbox(args, getSingleCategoryUrl);
  return data.map((row) => parseSingleCategoryData(row, args.category.code));
};

export const fetchMultiCategoryDataForBbox = async (args: {
  classification: Classification;
  geoType: GeoType;
  bbox: Bbox;
  baseUrl: string;
}) => {
  const data = await fetchTileDataForBbox(args, getMultiCategoryUrl);
  return data.map((row) =>
    parseMultiCategoryData(
      row,
      args.classification.categories.map((c) => c.code),
    ),
  );
};

const fetchTileDataForBbox = async (
  args: { geoType: GeoType; bbox: Bbox; baseUrl: string },
  getUrl: (args: any) => string,
) => {
  // get all intersecting data tiles
  const dataTiles = bboxToDataTiles(args.bbox, args.geoType);

  // fetch data from data tile files
  const fetched = await Promise.all(
    dataTiles.map((tile) => {
      const url = getUrl({ ...args, tile });
      return fetchTileData(url);
    }),
  );

  return fetched.flat();
};

/*
  Fetch json with census data by for categories categoryCode and totalCode for all geographies of type 'geoType' that
  fall within geographic bounding box represented by 'tile'.
*/
const fetchTileData = async (url: string) => {
  const response = await fetch(url);
  const csv = await response.text();
  return dsv.csvParse(csv);
};

const parseSingleCategoryData = (row: dsv.DSVRowString<string>, categoryCode: string) => {
  const geoCode = row.geography_code;
  const categoryValue = parseFloat(row[categoryCode]);
  return { geoCode, categoryValue };
};

const parseMultiCategoryData = (row: dsv.DSVRowString<string>, categoryCodes: string[]) => {
  const geoCode = row.geography_code;
  const categoryValues = categoryCodes.map((c) => ({ code: c, value: parseFloat(row[c]) }));
  return { geoCode, categoryValues };
};

/*
  Fetch json with estimated natural breakpoints (w. ckmeans algorithm) in category data. Breaks include min value for
  category as first value.
*/
export const fetchBreaks = async (args: {
  mode: Mode;
  classification: Classification;
  category: Category;
  geoType: GeoType;
  baseUrl: string;
}): Promise<{ breaks: number[] }> => {
  const url = `${args.baseUrl}/breaksCkmeans/${args.geoType}/${args.category.code}.json`;
  const response = await fetch(url);
  const breaksRaw = await response.json();
  const breaks = uniqueRoundedClassificationBreaks(args.classification.code, args.mode, breaksRaw);
  return { breaks };
};

export const fetchMultiCategoryDataForEnglandAndWales = async (args: {
  mode: Mode;
  classification: Classification;
  category: Category;
  geoType: GeoType;
  baseUrl: string;
}) => {
  const url = `${args.baseUrl}/ew/${args.classification.code}.json`;
  const response = await fetch(url);
  const data = (await response.json()) as Record<string, number>;
  return { data };
};

/*
  Fetch json with bounding box for geography.
*/
export const fetchGeography = async (geoCode: string): Promise<GeographyData> => {
  const url = `${geoBaseUrl}/${geoCode}.geojson`;
  const response = await fetch(url);
  return await response.json();
};
