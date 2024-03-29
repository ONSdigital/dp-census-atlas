import { colours, getChangeColours } from "./choroplethHelpers";

describe("getChangeOverTimeColours", () => {
  test("returns positive colours when breaksPlusMin all positive", () => {
    const breaksPlusMin = [1, 2, 3, 4, 5, 6];
    const returned = getChangeColours(breaksPlusMin);
    expect(returned).toEqual(colours.pos);
    expect(returned.length).toEqual(5);
  });
  test("returns positive colours when breaksPlusMin positive plus zero", () => {
    const breaksPlusMin = [0, 2, 3, 4, 5, 6];
    const returned = getChangeColours(breaksPlusMin);
    expect(returned).toEqual(colours.pos);
    expect(returned.length).toEqual(5);
  });
  test("returns negative colours when breaksPlusMin all negative", () => {
    const breaksPlusMin = [-6, -5, -4, -3, -2, -1];
    const returned = getChangeColours(breaksPlusMin);
    expect(returned).toEqual(colours.neg);
    expect(returned.length).toEqual(5);
  });
  test("returns negative colours when breaksPlusMin negative plus zero", () => {
    const breaksPlusMin = [-6, -5, -4, -3, -2, 0];
    const returned = getChangeColours(breaksPlusMin);
    expect(returned).toEqual(colours.neg);
    expect(returned.length).toEqual(5);
  });
  test("returns positive colours when first break crosses zero", () => {
    const breaksPlusMin = [-1, 2, 3, 4, 5, 6];
    const returned = getChangeColours(breaksPlusMin);
    expect(returned).toEqual(colours.pos);
    expect(returned.length).toEqual(5);
  });
  test("returns negative colours when last break crosses zero", () => {
    const breaksPlusMin = [-6, -5, -4, -3, -2, 1];
    const returned = getChangeColours(breaksPlusMin);
    expect(returned).toEqual(colours.neg);
    expect(returned.length).toEqual(5);
  });
  test("returns mixed colors when breaksPlusMin cross zero, positive-weighted", () => {
    const breaksPlusMin = [-2, -1, 1, 2, 3, 4];
    const expectedColours = [...colours.neg.slice(-2, -1), ...colours.pos.slice(0, 4)];
    const returned = getChangeColours(breaksPlusMin);
    expect(returned).toEqual(expectedColours);
    expect(returned.length).toEqual(5);
  });
  test("returns mixed colors when breaksPlusMin cross zero, negative-weighted", () => {
    const breaksPlusMin = [-4, -3, -2, -1, 1, 2];
    const expectedColours = [...colours.neg.slice(-4), ...colours.pos.slice(1, 2)];
    const returned = getChangeColours(breaksPlusMin);
    expect(returned).toEqual(expectedColours);
    expect(returned.length).toEqual(5);
  });
  test("returns positive-padded mixed colors when breaksPlusMin cross zero and n breaks < 5", () => {
    const breaksPlusMin = [-2, -1, 1, 2];
    const expectedColours = [...colours.neg.slice(-2, -1), ...colours.pos.slice(0, 4)];
    const returned = getChangeColours(breaksPlusMin);
    expect(returned).toEqual(expectedColours);
    expect(returned.length).toEqual(5);
  });
  test("returns 5 colour strings for breaks regardless of length", () => {
    [
      [1, 2, 3, 4, 5, 6],
      [1, 2, 3, 4, 5],
      [1, 2, 3, 4],
      [1, 2, 3],
      [1, 2],
      [1],
      [0],
      [-1],
      [-2, -1],
      [-3, -2, -1],
      [-4, -3, -2, -1],
      [-5, -4, -3, -2, -1],
      [-6, -5, -4, -3, -2, -1],
      [-6, -5, -4, -3, -2, 1],
      [-6, -5, -4, -3, 2],
      [-6, -5, -4, 3],
      [-6, -5, 4],
      [-6, 5],
    ].forEach((breaksPlusMin) => {
      const returned = getChangeColours(breaksPlusMin).filter((c) => c != undefined);
      expect(returned.length).toEqual(5);
    });
  });
});
