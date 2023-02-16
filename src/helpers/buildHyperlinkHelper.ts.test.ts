import { buildHyperlink } from "./buildHyperlinkHelper";
import { appBasePath } from "../buildEnv";

const ladSelectedUrl = new URL("/test?lad=ladCode", "https://test.com");
const ewSelectedUrl = new URL("/test", "https://test.com");

test("returns correct url given all inputs", () => {
  const urlParams = {
    mode: "mode",
    variableGroup: "variableGroup",
    variable: "variable",
    category: {
      classification: "classification",
      category: "category",
    },
  };
  expect(buildHyperlink(ladSelectedUrl, urlParams)).toEqual(
    `${appBasePath}/mode/variableGroup/variable/classification/category?lad=ladCode`,
  );
});

describe("index page url", () => {
  test("returns base url given only url input", () => {
    expect(buildHyperlink(ladSelectedUrl)).toEqual(`${appBasePath}/?lad=ladCode`);
  });
});

describe("variableGroup url", () => {
  const urlParams = {
    mode: "mode",
    variableGroup: "variableGroup",
  };
  test("returns variableGroup url with geography query param given an LAD in input url", () => {
    expect(buildHyperlink(ladSelectedUrl, urlParams)).toEqual(`${appBasePath}/mode/variableGroup?lad=ladCode`);
  });
  test("returns variableGroup url without geography query param given no geography in input url", () => {
    expect(buildHyperlink(ewSelectedUrl, urlParams)).toEqual(`${appBasePath}/mode/variableGroup`);
  });
});

describe("variable url", () => {
  const urlParams = {
    mode: "mode",
    variableGroup: "variableGroup",
    variable: "variable",
  };
  test("returns variable url with geography query param given an LAD in input url", () => {
    expect(buildHyperlink(ladSelectedUrl, urlParams)).toEqual(`${appBasePath}/mode/variableGroup/variable?lad=ladCode`);
  });
  test("returns variable url without geography query param given no geography in input url", () => {
    expect(buildHyperlink(ewSelectedUrl, urlParams)).toEqual(`${appBasePath}/mode/variableGroup/variable`);
  });
});

describe("category url", () => {
  const urlParams = {
    mode: "mode",
    variableGroup: "variableGroup",
    variable: "variable",
    category: {
      classification: "classification",
      category: "category",
    },
  };
  test("returns category url with specified classification and geography query param given an LAD in input url", () => {
    expect(buildHyperlink(ladSelectedUrl, urlParams)).toEqual(
      `${appBasePath}/mode/variableGroup/variable/classification/category?lad=ladCode`,
    );
  });

  test("returns category url with specified classification value but without geography query param given no geography in input url", () => {
    expect(buildHyperlink(ewSelectedUrl, urlParams)).toEqual(
      `${appBasePath}/mode/variableGroup/variable/classification/category`,
    );
  });
});
