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
