import { buildHyperlink } from "./buildHyperlinkHelper";
import type { SelectedGeographyData } from "../types";

const ladSelectedUrl = new URL("/test?lad=ladCode", "https://test.com");
const ewSelectedUrl = new URL("/test", "https://test.com");

test("returns correct url given all inputs", () => {
  const urlParams = {
    topic: "topic",
    variable: "variable",
    classification: "classification",
    category: "category",
  };
  expect(buildHyperlink(ladSelectedUrl, urlParams)).toEqual("/2021/topic/variable/classification/category?lad=ladCode");
});

describe("index page url", () => {
  test("returns base url given only url input", () => {
    expect(buildHyperlink(ladSelectedUrl)).toEqual("/?lad=ladCode");
  });
});

describe("topic url", () => {
  let urlParams = {
    topic: "topic",
  };
  test("returns topic url with geography query param given an LAD in input url", () => {
    expect(buildHyperlink(ladSelectedUrl, urlParams)).toEqual("/2021/topic?lad=ladCode");
  });
  test("returns topic url without geography query param given no geography in input url", () => {
    expect(buildHyperlink(ewSelectedUrl, urlParams)).toEqual("/2021/topic");
  });
});

describe("variable url", () => {
  let urlParams = {
    topic: "topic",
    variable: "variable",
  };
  test("returns variable url with geography query param given an LAD in input url", () => {
    expect(buildHyperlink(ladSelectedUrl, urlParams)).toEqual("/2021/topic/variable?lad=ladCode");
  });
  test("returns variable url without geography query param given no geography in input url", () => {
    expect(buildHyperlink(ewSelectedUrl, urlParams)).toEqual("/2021/topic/variable");
  });
});

describe("classification url", () => {
  let urlParams = {
    topic: "topic",
    variable: "variable",
    classification: "classification",
  };
  test("returns classification url with geography query param given an LAD in input url", () => {
    expect(buildHyperlink(ladSelectedUrl, urlParams)).toEqual("/2021/topic/variable/classification?lad=ladCode");
  });
  test("returns classification url without geography query param given no geography in input url", () => {
    expect(buildHyperlink(ewSelectedUrl, urlParams)).toEqual("/2021/topic/variable/classification");
  });
});

describe("category url", () => {
  let urlParams = {
    topic: "topic",
    variable: "variable",
    classification: "classification",
    category: "category",
  };
  test("returns category url with specified classification and geography query param given an LAD in input url", () => {
    expect(buildHyperlink(ladSelectedUrl, urlParams)).toEqual(
      "/2021/topic/variable/classification/category?lad=ladCode",
    );
  });

  test("returns category url with specified classification value but without geography query param given no geography in input url", () => {
    expect(buildHyperlink(ewSelectedUrl, urlParams)).toEqual("/2021/topic/variable/classification/category");
  });

  test("returns category url with default classification value if not specified", () => {
    delete urlParams.classification;
    expect(buildHyperlink(ewSelectedUrl, urlParams)).toEqual("/2021/topic/variable/default/category");
  });
});
