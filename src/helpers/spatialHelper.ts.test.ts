import { doBboxesIntersect } from "./spatialHelper";

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
});
