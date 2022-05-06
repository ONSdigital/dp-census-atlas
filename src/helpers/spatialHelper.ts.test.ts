import { bboxToDataTiles, doBboxesIntersect } from "./spatialHelper";

describe("doBboxesIntersect", () => {
  test("returns false for non-intersecting bboxes", () => {
    const bbox1 = { east: 4, north: 2, west: 3, south: 1 };
    const bbox2 = { east: 2, north: 2, west: 1, south: 1 };
    expect(doBboxesIntersect({ bbox1: bbox1, bbox2: bbox2 })).toBe(false);
  });
  test("returns true for overlapping bboxes, outer bbox first", () => {
    const outerBbox = { east: 8, north: 7, west: 4, south: 3 };
    const innerBbox = { east: 7, north: 5, west: 6, south: 4 };
    expect(doBboxesIntersect({ bbox1: outerBbox, bbox2: innerBbox })).toBe(true);
  });
  test("returns true for overlapping bboxes, inner bbox first", () => {
    const outerBbox = { east: 8, north: 7, west: 4, south: 3 };
    const innerBbox = { east: 7, north: 5, west: 6, south: 4 };
    expect(doBboxesIntersect({ bbox1: innerBbox, bbox2: outerBbox })).toBe(true);
  });
  test("returns true for intersecting bboxes, west bbox first", () => {
    const westBox = { east: 8, north: 7, west: 4, south: 3 };
    const eastBox = { east: 5, north: 6, west: 1, south: 2 };
    expect(doBboxesIntersect({ bbox1: westBox, bbox2: eastBox })).toBe(true);
  });
  test("returns true for intersecting bboxes, east bbox first", () => {
    const westBox = { east: 8, north: 7, west: 4, south: 3 };
    const eastBox = { east: 5, north: 6, west: 1, south: 2 };
    expect(doBboxesIntersect({ bbox1: eastBox, bbox2: westBox })).toBe(true);
  });
  test("returns true for perfectly overlapping bboxes", () => {
    const topBox = { east: 8, north: 7, west: 4, south: 3 };
    const bottomBox = { east: 8, north: 7, west: 4, south: 3 };
    expect(doBboxesIntersect({ bbox1: topBox, bbox2: bottomBox })).toBe(true);
  });
  test("returns true for bboxes that share one edge", () => {
    const northBox = { east: 10, north: 10, west: 5, south: 5 };
    const southBox = { east: 10, north: 5, west: 5, south: 0 };
    expect(doBboxesIntersect({ bbox1: northBox, bbox2: southBox })).toBe(true);
  });
  test("returns true for bboxes that share one corner", () => {
    const northEastBox = { east: 10, north: 10, west: 5, south: 5 };
    const southWestBox = { east: 5, north: 5, west: 0, south: 0 };
    expect(doBboxesIntersect({ bbox1: northEastBox, bbox2: southWestBox })).toBe(true);
  });
  test("returns true for overlapping bboxes with all negative coordinates", () => {
    const outerBbox = { east: -8, north: -7, west: -4, south: -3 };
    const innerBbox = { east: -7, north: -5, west: -6, south: -4 };
    expect(doBboxesIntersect({ bbox1: outerBbox, bbox2: innerBbox })).toBe(true);
  });
  test("returns true for intersecting bboxes with mixed negative and postive coordinates", () => {
    const bbox1 = { east: -8, north: -7, west: 4, south: 3 };
    const bbox2 = { east: -7, north: -5, west: 6, south: 4 };
    expect(doBboxesIntersect({ bbox1: bbox1, bbox2: bbox2 })).toBe(true);
  });
});

describe("bboxToDataTiles", () => {
  test("filters a set of data tiles to those intersecting with a given viewport bbox", () => {
    const viewportBbox = { east: 10, north: 10, west: 0, south: 0 };
    const dataTiles = {
      lad: [
        {
          tilename: "intersecting_tile_1",
          bbox: { east: 5, north: 5, west: -5, south: -5 },
        },
        {
          tilename: "nonintersecting_tile_1",
          bbox: { east: 25, north: 25, west: 15, south: 15 },
        },
        {
          tilename: "intersecting_tile_2",
          bbox: { east: 15, north: 5, west: 5, south: -5 },
        },
        {
          tilename: "nonintersecting_tile_2",
          bbox: { east: -25, north: -5, west: -15, south: -15 },
        },
        {
          tilename: "intersecting_tile_3",
          bbox: { east: 5, north: 15, west: -5, south: 5 },
        },
        {
          tilename: "nonintersecting_tile_3",
          bbox: { east: 105, north: 115, west: -105, south: 105 },
        },
        {
          tilename: "intersecting_tile_4",
          bbox: { east: 15, north: 15, west: 5, south: 5 },
        },
        {
          tilename: "nonintersecting_tile_4",
          bbox: { east: -115, north: -115, west: -125, south: -125 },
        },
      ],
      msoa: [],
      oa: [],
    };
    const expectedDataTiles = [
      {
        tilename: "intersecting_tile_1",
        bbox: { east: 5, north: 5, west: -5, south: -5 },
      },
      {
        tilename: "intersecting_tile_2",
        bbox: { east: 15, north: 5, west: 5, south: -5 },
      },
      {
        tilename: "intersecting_tile_3",
        bbox: { east: 5, north: 15, west: -5, south: 5 },
      },
      {
        tilename: "intersecting_tile_4",
        bbox: { east: 15, north: 15, west: 5, south: 5 },
      },
    ];
    expect(bboxToDataTiles(viewportBbox, "lad", dataTiles)).toEqual(expectedDataTiles);
  });
});
