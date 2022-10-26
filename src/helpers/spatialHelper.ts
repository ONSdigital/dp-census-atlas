import type { Bbox, DataTileGrid, GeographyData, GeoType } from "../types";
import censusDataTileGrid from "../quadsDataTileGrid.json";
import booleanIntersects from "@turf/boolean-intersects";
import bboxPolygon from "@turf/bbox-polygon";

export const getBboxString = (args: Bbox) => {
  return [args.east, args.north, args.west, args.south].map((n) => n.toFixed(6)).join(",");
};

/*
  Test for bbox intersection using turf functions, after converting both bbox to geojson features 
*/
export const doBboxesIntersect = (args: { bbox1: Bbox; bbox2: Bbox }) => {
  const bbox1Feature = bboxPolygon([args.bbox1.south, args.bbox1.west, args.bbox1.north, args.bbox1.east]);
  const bbox2Feature = bboxPolygon([args.bbox2.south, args.bbox2.west, args.bbox2.north, args.bbox2.east]);
  return booleanIntersects(bbox1Feature, bbox2Feature);
};

export const doBboxArraysIntersect = (
  bbox1: [number, number, number, number],
  bbox2: [number, number, number, number],
) => {
  const bbox1Feature = bboxPolygon(bbox1);
  const bbox2Feature = bboxPolygon(bbox2);
  return booleanIntersects(bbox1Feature, bbox2Feature);
};

/*
  filter data tile grid to those data tiles that intersect with the supplied bbox
*/
export const bboxToDataTiles = (bbox: Bbox, geoType: GeoType, dataTileGrid: DataTileGrid = censusDataTileGrid) => {
  return dataTileGrid[geoType].filter((dataTile) => {
    return doBboxesIntersect({ bbox1: bbox, bbox2: dataTile.bbox });
  });
};

export const englandAndWales: GeographyData = {
  meta: {
    name: "England and Wales",
    code: "K04000001",
    geotype: "ew",
  },
  geo_json: {
    type: "FeatureCollection",
    features: [
      {
        id: "bbox",
        type: "blah",
        geometry: {
          type: "blah",
          coordinates: [
            [2, 58],
            [-6, 48],
          ],
          // coordinates: [
          //   [2.08, 55.68],
          //   [-6.59, 48.53],
          // ],
        },
      },
    ],
  },
};
