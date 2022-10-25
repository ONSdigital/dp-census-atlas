import { GeoTypes, type Variable, type Category, type Classification } from "../types";
import { englandAndWales } from "./spatialHelper";
import { formatTemplateString } from "./categoryHelpers";
import { getSelectedGeography } from "./appParamsHelper";


describe("formatTemplateString", () => {
  const testCategory: Category = {
    name: "testCat",
    slug: "test-cat",
    code: "testCatCode",
    legend_str_1: "",
    legend_str_2: "",
    legend_str_3: "",
    baseUrl: "",
  };
  const testVariable: Variable = {
    name: "testVar",
    slug: "test-var",
    code: "testVarCode",
    desc: "",
    long_desc: "",
    units: "testUnits",
    topic_code: "testTopicCode",
    classifications: [] as Classification[],
  };
  const testLocation = "testLocation";

  test("formats {variable_name}", () => {
    expect(formatTemplateString(testVariable, testCategory, testLocation, "{variable_name} in a sentence")).toEqual(
      "testVar in a sentence",
    );
  });
  test("formats {category_name}", () => {
    expect(formatTemplateString(testVariable, testCategory, testLocation, "{category_name} in a sentence")).toEqual(
      "testCat in a sentence",
    );
  });
  test("formats {category_unit}", () => {
    expect(formatTemplateString(testVariable, testCategory, testLocation, "{category_unit} in a sentence")).toEqual(
      "testUnits in a sentence",
    );
  });
  test("formats {location}", () => {
    expect(formatTemplateString(testVariable, testCategory, testLocation, "{location} in a sentence")).toEqual(
      "testLocation in a sentence",
    );
  });
  test("formats all in same string", () => {
    expect(
      formatTemplateString(
        testVariable,
        testCategory,
        testLocation,
        "{variable_name}, {category_name}, {category_unit}, {location} in a sentence",
      ),
    ).toEqual("testVar, testCat, testUnits, testLocation in a sentence");
  });
  test("formats all occurences in string", () => {
    expect(
      formatTemplateString(
        testVariable,
        testCategory,
        testLocation,
        "{variable_name}, {variable_name}, {category_name}, {category_name} in a sentence",
      ),
    ).toEqual("testVar, testVar, testCat, testCat in a sentence");
  });
});

describe("getSelectedGeography", () => {
  test("returns ew when no geography in url", () => {
    const testURL = new URL("https://dp.aws.onsdigital.uk/census-atlas");
    expect(getSelectedGeography(testURL.searchParams)).toEqual({
      geoType: englandAndWales.meta.geotype,
      geoCode: englandAndWales.meta.code,
    });
  });
  // test all known geotypes are found
  for (const g of GeoTypes) {
    const testSelectedGeography = {
      geoType: g,
      geoCode: `testGeoCode${g}`,
    };
    test("retrives selected geography from short url", () => {
      const testURL = new URL(
        `https://dp.aws.onsdigital.uk/census-atlas?${testSelectedGeography.geoType}=${testSelectedGeography.geoCode}`,
      );
      expect(getSelectedGeography(testURL.searchParams)).toEqual(testSelectedGeography);
    });
    test("retrives selected geography from longer url", () => {
      const testURL = new URL(
        `https://dp.aws.onsdigital.uk/census-atlas/choropleth/population?${testSelectedGeography.geoType}=${testSelectedGeography.geoCode}`,
      );
      expect(getSelectedGeography(testURL.searchParams)).toEqual(testSelectedGeography);
    });
    test("retrives selected geography from longest url", () => {
      const testURL = new URL(
        `https://dp.aws.onsdigital.uk/census-atlas/choropleth/population/marital-status/default/single-never-married-or-in-a-civil-partnership?${testSelectedGeography.geoType}=${testSelectedGeography.geoCode}`,
      );
      expect(getSelectedGeography(testURL.searchParams)).toEqual(testSelectedGeography);
    });
  }
});
