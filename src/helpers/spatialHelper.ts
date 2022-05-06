import type { Bbox, GeographyInfo } from "../types";

export const getBboxString = (args: Bbox) => {
  return [args.east, args.north, args.west, args.south].map((n) => n.toFixed(6)).join(",");
};

// simple intersection test for bboxes - do either of the bbox points for either bbox lie within the other bbox?
export const doBboxesIntersect = (args: { bbox1: Bbox; bbox2: Bbox }) => {
  const bboxAInOrOverlapsBboxB = (bboxA: Bbox, bboxB: Bbox) => {
    return (
      (bboxA.east >= bboxB.east &&
        bboxB.east >= bboxA.west &&
        bboxA.north >= bboxB.north &&
        bboxB.north >= bboxA.south) ||
      (bboxA.east >= bboxB.west && bboxB.west >= bboxA.west && bboxA.north >= bboxB.south && bboxB.south >= bboxA.south)
    );
  };
  // check intersection both ways around!
  return bboxAInOrOverlapsBboxB(args.bbox1, args.bbox2) || bboxAInOrOverlapsBboxB(args.bbox2, args.bbox1);
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
