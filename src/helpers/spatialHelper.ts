import { pointToTile, tileToBBOX } from "@mapbox/tilebelt";
import type { Bbox, GeographyInfo } from "../types";

export const getBboxString = (args: Bbox) => {
  return [args.east, args.north, args.west, args.south].map((n) => n.toFixed(6)).join(",");
};

export const englandAndWales: GeographyInfo = {
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
        geometry: { type: "blah", coordinates: [2.08, 55.68, -6.59, 48.53] },
      },
    ],
  },
};

// uk bounding box, taken from UK bbox value used in API
// https://github.com/ONSdigital/dp-geodata-api/blob/develop/pkg/geodata/coords.go
export const UKBbox: Bbox = {
  east: 1.76,
  north: 58.64,
  west: -7.57,
  south: 49.92,
};

// maxmium zoom level at which to subsitute UKBbox for arbitrary viewport bbox
export const MaxZoomToUseUKBbox = 6;

/*
  Snap viewport bounding box coordinates to closest slippy map tile integer X,Y values for current zoom (see
  https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames) to make bounding box requests cachable.
*/
export const getQuantisedBbox = (bbox: Bbox, zoom: number) => {
  // round down zoom level to ensure snap is to integer tile grid
  const floorZoom = Math.floor(zoom);

  // if zoom is lower than minZoomToSnapBBoxes, just return bbox for all of UK
  if (floorZoom <= MaxZoomToUseUKBbox) {
    return UKBbox;
  }

  // get map tiles for current zoom that contain bbox corners
  const neTile = pointToTile(bbox.east, bbox.north, floorZoom);
  const swTile = pointToTile(bbox.west, bbox.south, floorZoom);

  // convert map tiles to bboxes
  const neTileBbox = tileToBBOX(neTile);
  const swTileBbox = tileToBBOX(swTile);

  // return bbox for both tiles  (NB tilebelt/mapbox uses West, South, East, North bbox convention)
  return {
    east: neTileBbox[2],
    north: neTileBbox[3],
    west: swTileBbox[0],
    south: swTileBbox[1],
  };
};
