import * as dsv from "d3-dsv"; // https://github.com/d3/d3/issues/3469
import type { Bbox, Category, Classification, DataTile, GeographyData, GeoType } from "src/types";
import { bboxToDataTiles } from "../helpers/spatialHelper";
import { uniqueRoundedClassificationBreaks } from "../helpers/classificationHelpers";

const geoBaseUrl = "https://cdn.ons.gov.uk/maptiles/cm-geos/v2";

/*
  Fetch place data files for all data 'tiles' (predefined coordinate grid squares) that intersect with current viewport
  bounding box.
*/
export const fetchDataForBbox = async (args: { category: Category; geoType: GeoType; bbox: Bbox }) => {
  const data = await fetchTileDataForBbox(args);
  return data.map((row) => parsePlaceData(row, args.category.code));
};

const fetchTileDataForBbox = async (args: { category: Category; geoType: GeoType; bbox: Bbox }) => {
  // get all intersecting data tiles
  const dataTiles = bboxToDataTiles(args.bbox, args.geoType);

  // fetch data from data tile files
  const fetched = await Promise.all(
    dataTiles.map((dataTile) => {
      return fetchTileData({
        category: args.category,
        geoType: args.geoType,
        tile: dataTile,
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
export const fetchTileData = async (args: { category: Category; geoType: GeoType; tile: DataTile }) => {
  const url = `${args.category.baseUrl}/tiles/${args.geoType}/${args.tile.tilename}/${args.category.code}.csv`;
  const response = await fetch(url);
  const csv = await response.text();
  return dsv.csvParse(csv);
};

/*
  Fetch json with estimated natural breakpoints (w. ckmeans algorithm) in data for all census category 'categoryCode'
  divided by total for that category.
*/
export const fetchBreaks = async (args: {
  classification: Classification;
  category: Category;
  geoType: GeoType;
}): Promise<{ breaks: number[] }> => {
  const url = `${args.category.baseUrl}/breaks/${args.geoType}/${args.category.code}.json`;
  const response = await fetch(url);
  const breaksRaw = await response.json();
  /*
    breaks json files have legacy format from when it was an API response:
    e.g.
    {
      "KS103EW0002": {
        "LAD": [
            0.283667019342937,
            0.32603232256525966,
            0.3817375703709814,
            0.4696799398260561,
            0.5993594922100404
        ],
        "LAD_min_max": [
            0.21006838234294492,
            0.5993594922100404
        ]
      }
    }
  */
  const breaks = uniqueRoundedClassificationBreaks(args.classification.code, [
    breaksRaw[args.category.code][`${args.geoType.toUpperCase()}_min_max`][0],
    ...breaksRaw[args.category.code][args.geoType.toUpperCase()],
  ]);
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
