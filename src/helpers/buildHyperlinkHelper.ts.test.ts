import { buildHyperlink } from "./buildHyperlinkHelper";
import { appBasePath } from "../buildEnv";

const ladSelectedUrl = new URL("/test?lad=ladCode", "https://test.com");
const ewSelectedUrl = new URL("/test", "https://test.com");

test("returns correct url given all inputs", () => {
  const urlParams = {
    variableGroup: "variableGroup",
    variable: "variable",
    category: {
      classification: "classification",
      category: "category",
    },
  };
  expect(buildHyperlink(ladSelectedUrl, urlParams)).toEqual(
    `${appBasePath}/choropleth/variableGroup/variable/classification/category?lad=ladCode`,
  );
});

describe("index page url", () => {
  test("returns base url given only url input", () => {
    expect(buildHyperlink(ladSelectedUrl)).toEqual(`${appBasePath}/?lad=ladCode`);
  });
});

describe("variableGroup url", () => {
  const urlParams = {
    variableGroup: "variableGroup",
  };
  test("returns variableGroup url with geography query param given an LAD in input url", () => {
    expect(buildHyperlink(ladSelectedUrl, urlParams)).toEqual(`${appBasePath}/choropleth/variableGroup?lad=ladCode`);
  });
  test("returns variableGroup url without geography query param given no geography in input url", () => {
    expect(buildHyperlink(ewSelectedUrl, urlParams)).toEqual(`${appBasePath}/choropleth/variableGroup`);
  });
});

describe("variable url", () => {
  const urlParams = {
    variableGroup: "variableGroup",
    variable: "variable",
  };
  test("returns variable url with geography query param given an LAD in input url", () => {
    expect(buildHyperlink(ladSelectedUrl, urlParams)).toEqual(
      `${appBasePath}/choropleth/variableGroup/variable?lad=ladCode`,
    );
  });
  test("returns variable url without geography query param given no geography in input url", () => {
    expect(buildHyperlink(ewSelectedUrl, urlParams)).toEqual(`${appBasePath}/choropleth/variableGroup/variable`);
  });
});

describe("category url", () => {
  const urlParams = {
    variableGroup: "variableGroup",
    variable: "variable",
    category: {
      classification: "classification",
      category: "category",
    },
  };
  test("returns category url with specified classification and geography query param given an LAD in input url", () => {
    expect(buildHyperlink(ladSelectedUrl, urlParams)).toEqual(
      `${appBasePath}/choropleth/variableGroup/variable/classification/category?lad=ladCode`,
    );
  });

  test("returns category url with specified classification value but without geography query param given no geography in input url", () => {
    expect(buildHyperlink(ewSelectedUrl, urlParams)).toEqual(
      `${appBasePath}/choropleth/variableGroup/variable/classification/category`,
    );
  });
});

describe("variableGroups url", () => {
  const staticPath = "variableGroups";
  test("returns variableGroups path with geography query param given an LAD in input url", () => {
    expect(buildHyperlink(ladSelectedUrl, null, staticPath)).toEqual(
      `${appBasePath}/choropleth/variableGroups?lad=ladCode`,
    );
  });
  test("returns variableGroups url without geography query param given no geography in input url", () => {
    expect(buildHyperlink(ewSelectedUrl, null, staticPath)).toEqual(`${appBasePath}/choropleth/variableGroups`);
  });
});
