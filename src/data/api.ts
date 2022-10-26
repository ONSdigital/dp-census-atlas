import * as dsv from "d3-dsv"; // https://github.com/d3/d3/issues/3469
import type { Bbox, Category, DataTile, GeographyData, GeoType } from "src/types";
import { bboxToDataTiles, englandAndWales } from "../helpers/spatialHelper";
import { uniqueRoundedBreaks, roundedData } from "../helpers/percentageHelpers";

const geoBaseUrl = "https://cdn.ons.gov.uk/maptiles/cm-geos/v2";

/*
  Fetch place data files for all data 'tiles' (predefined coordinate grid squares) that intersect with current viewport 
  bounding box.
*/
export const fetchTileDataForBbox = async (args: { category: Category; geoType: GeoType; bbox: Bbox }) => {
  // get all intersecting data tiles
  const dataTiles = bboxToDataTiles(args.bbox, args.geoType);

  // fetch data from data tile files
  const fetchedData = await Promise.all(
    dataTiles.map((dataTile) => {
      return fetchTileData({
        category: args.category,
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
  category: Category;
  geoType: GeoType;
}): Promise<{ breaks: { [categoryCode: string]: number[] }; minMax: { [categoryCode: string]: number[] } }> => {
  const url = `${args.category.baseUrl}/breaks/${args.geoType}/${args.category.code}.json`;
  const breaksRaw = await fetch(url).then((resp) => resp.json());
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
    ToDo - refactor json files to match required format (see function output defintions above)
  */
  const breaks = Object.fromEntries(
    Object.keys(breaksRaw).map((code) => [code, uniqueRoundedBreaks(breaksRaw[code][args.geoType.toUpperCase()])]),
  );
  const minMax = Object.fromEntries(
    Object.keys(breaksRaw).map((code) => [
      code,
      breaksRaw[code][`${args.geoType.toUpperCase()}_min_max`].map((n) => roundedData(n)),
    ]),
  );
  return { breaks, minMax };
};

/*
  Fetch json with bounding box for geography.
*/
export const fetchGeography = async (geoCode: string) => {
  // : Promise<GeographyData>
  const url = `${geoBaseUrl}/${geoCode}.geojson`;
  const response = await fetch(url);
  return await response.json();
};
