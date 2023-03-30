import * as dsv from "d3-dsv"; // https://github.com/d3/d3/issues/3469
import type { Bbox, Category, Classification, DataTile, GeographyData, GeoType } from "../types";
import bbox from "@turf/bbox";
import { bboxToDataTiles } from "../helpers/spatialHelper";
import { uniqueRoundedClassificationBreaks } from "../helpers/classificationHelpers";
import { geojson } from "../map/initMapLayers";

const geoBaseUrl = "https://cdn.ons.gov.uk/maptiles/cm-geos/v2";

/*
  Fetch place data files for all data 'tiles' (predefined coordinate grid squares) that intersect with current viewport
  bounding box.
*/
export const fetchDataForBbox = async (args: {
  category: Category;
  geoType: GeoType;
  bbox: Bbox;
  base_url: string;
}) => {
  const data = await fetchTileDataForBbox(args);
  return data.map((row) => parsePlaceData(row, args.category.code));
};

const fetchTileDataForBbox = async (args: { category: Category; geoType: GeoType; bbox: Bbox; base_url: string }) => {
  // get all intersecting data tiles
  const dataTiles = bboxToDataTiles(args.bbox, args.geoType);

  // fetch data from data tile files
  const fetched = await Promise.all(
    dataTiles.map((dataTile) => {
      return fetchTileData({
        category: args.category,
        geoType: args.geoType,
        base_url: args.base_url,
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
export const fetchTileData = async (args: { category: Category; geoType: GeoType; base_url: string }) => {
  const url = `${args.base_url}/tiles/${args.geoType}/${args.category.code}.csv`;
  const response = await fetch(url);
  const csv = await response.text();
  const data = dsv.csvParse(csv);
  return data.map((row) => parsePlaceData(row, args.category.code));
};

/*
  Fetch json with estimated natural breakpoints (w. ckmeans algorithm) in category data. Breaks include min value for
  category as first value.
*/
export const fetchBreaks = async (args: {
  classification: Classification;
  category: Category;
  geoType: GeoType;
  base_url: string;
}): Promise<{ breaks: number[] }> => {
  const url = `${args.base_url}/breaksCkmeans/${args.geoType}/${args.category.code}.json`;
  const response = await fetch(url);
  const breaksRaw = await response.json();
  const breaks = uniqueRoundedClassificationBreaks(args.classification.code, breaksRaw);
  return { breaks };
};

/*
  Fetch json with bounding box for geography.
*/
export const fetchGeography = async (geoType: string, geoCode: string): Promise<GeographyData> => {
  if (geojson && geojson[geoType.toLocaleUpperCase()]) {
    const feature = geojson[geoType.toLocaleUpperCase()].features.find((f) => f.properties.AREACD === geoCode);
    feature.id = "boundary";
    const bounds = bbox(feature);
    const centroid = [(bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2];
    const geo = {
      meta: { code: geoCode, name: feature.properties.AREANM, geotype: geoType },
      geo_json: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            id: "centroid",
            geometry: { type: "Point", coordinates: centroid },
          },
          {
            type: "Feature",
            id: "bbox",
            geometry: {
              type: "LineString",
              coordinates: [
                [bounds[0], bounds[1]],
                [bounds[2], bounds[3]],
              ],
            },
          },
          feature,
        ],
      },
    };
    return geo;
  }
};
