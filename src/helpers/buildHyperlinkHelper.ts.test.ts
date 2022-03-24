import { buildHyperlink } from "./buildHyperlinkHelper";
import type { SelectedGeographyData } from "../types";

const mockSelectedGeography = {
  geoType: "lad",
  displayName: "Lad name",
  geoCode: "ladCode",
  variableData: {
    catCode: { count: 0, percentage: 0, total: 0 },
  },
} as SelectedGeographyData;

test("returns correct url given all inputs", () => {
  const args = {
    topic: "topic",
    variable: "variable",
    classification: "classification",
    category: "category",
    selectedGeography: mockSelectedGeography,
  };
  expect(buildHyperlink(args)).toEqual("/2021/topic/variable/classification/category?lad=ladCode");
});

describe("index page url", () => {
  test("returns base url given no inputs", () => {
    expect(buildHyperlink({})).toEqual("/");
  });
  test("returns base url with an LAD selectedGeography but no other arguments", () => {
    expect(buildHyperlink({ selectedGeography: mockSelectedGeography })).toEqual("/");
  });
});

describe("topic url", () => {
  let args = {
    topic: "topic",
    selectedGeography: mockSelectedGeography,
  };
  test("returns topic url with geography query param given an LAD selectedGeography", () => {
    expect(buildHyperlink(args)).toEqual("/2021/topic?lad=ladCode");
  });
  test("returns topic url without geography query param if selectedGeography is not provided or is set to England and Wales", () => {
    args = { ...args, selectedGeography: { ...mockSelectedGeography, geoType: "ew" } };
    expect(buildHyperlink(args)).toEqual("/2021/topic");
    delete args.selectedGeography;
    expect(buildHyperlink(args)).toEqual("/2021/topic");
  });
});

describe("variable url", () => {
  let args = {
    topic: "topic",
    variable: "variable",
    selectedGeography: mockSelectedGeography,
  };
  test("returns variable url with geography query param given an LAD selectedGeography", () => {
    expect(buildHyperlink(args)).toEqual("/2021/topic/variable?lad=ladCode");
  });
  test("returns variable url without geography query param if selectedGeography is not provided or is set to England and Wales", () => {
    args = { ...args, selectedGeography: { ...mockSelectedGeography, geoType: "ew" } };
    expect(buildHyperlink(args)).toEqual("/2021/topic/variable");
    delete args.selectedGeography;
    expect(buildHyperlink(args)).toEqual("/2021/topic/variable");
  });
});

describe("classification url", () => {
  let args = {
    topic: "topic",
    variable: "variable",
    classification: "classification",
    selectedGeography: mockSelectedGeography,
  };
  test("returns classification url with geography query param given an LAD selectedGeography", () => {
    expect(buildHyperlink(args)).toEqual("/2021/topic/variable/classification?lad=ladCode");
  });
  test("returns classification url without geography query param if selectedGeography is not provided or is set to England and Wales", () => {
    args = { ...args, selectedGeography: { ...mockSelectedGeography, geoType: "ew" } };
    expect(buildHyperlink(args)).toEqual("/2021/topic/variable/classification");
    delete args.selectedGeography;
    expect(buildHyperlink(args)).toEqual("/2021/topic/variable/classification");
  });
});

describe("category url", () => {
  let args = {
    topic: "topic",
    variable: "variable",
    classification: "classification",
    category: "category",
    selectedGeography: mockSelectedGeography,
  };
  test("returns category url with specified classification and geography query param given an LAD selectedGeography", () => {
    expect(buildHyperlink(args)).toEqual("/2021/topic/variable/classification/category?lad=ladCode");
  });

  test("returns category url with specified classification value but without geography query param if selectedGeography is not provided or is set to England and Wales", () => {
    args = { ...args, selectedGeography: { ...mockSelectedGeography, geoType: "ew" } };
    expect(buildHyperlink(args)).toEqual("/2021/topic/variable/classification/category");
    delete args.selectedGeography;
    expect(buildHyperlink(args)).toEqual("/2021/topic/variable/classification/category");
  });

  test("returns category url with default classification value if not specified", () => {
    delete args.classification;
    expect(buildHyperlink(args)).toEqual("/2021/topic/variable/default/category");
  });
});

// describe("edge cases", () => {
//     test("")
// })
