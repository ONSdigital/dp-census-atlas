import type { Bbox, GeographyLookupProps } from "../types";

export const getBboxString = (args: Bbox) => {
  return [args.east, args.north, args.west, args.south].map((n) => n.toFixed(6)).join(",");
};

export const englandAndWales: GeographyLookupProps = {
  meta: {
    name: "England and Wales",
    code: "K04000001",
    geotype: "ew",
  },
  geo_json: {
    type: "FeatureCollection",
    features: [],
  },
};
