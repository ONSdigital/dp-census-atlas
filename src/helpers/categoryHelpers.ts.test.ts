import { GeoTypes, type Variable, type Category, type Classification } from "../types";
import { englandAndWales } from "./spatialHelper";
import { getSelectedGeography, formatPercentage, formatTemplateString } from "./categoryHelpers";

describe("formatPercentage", () => {
  test("rounds percentage to nearest single decimal place and returns as string - single decimal place input", () => {
    expect(formatPercentage(10.1)).toEqual("10.1");
  });
  test("rounds percentage to nearest single decimal place and returns as string - no decimal place input", () => {
    expect(formatPercentage(10)).toEqual("10.0");
  });
  test("rounds percentage to nearest single decimal place and returns as string - multiple decimal place input", () => {
    expect(formatPercentage(10.58098340980878)).toEqual("10.6");
  });
});

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
    expect(getSelectedGeography(testURL)).toEqual({
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
      expect(getSelectedGeography(testURL)).toEqual(testSelectedGeography);
    });
    test("retrives selected geography from longer url", () => {
      const testURL = new URL(
        `https://dp.aws.onsdigital.uk/census-atlas/2021/population?${testSelectedGeography.geoType}=${testSelectedGeography.geoCode}`,
      );
      expect(getSelectedGeography(testURL)).toEqual(testSelectedGeography);
    });
    test("retrives selected geography from longest url", () => {
      const testURL = new URL(
        `https://dp.aws.onsdigital.uk/census-atlas/2021/population/marital-status/default/single-never-married-or-in-a-civil-partnership?${testSelectedGeography.geoType}=${testSelectedGeography.geoCode}`,
      );
      expect(getSelectedGeography(testURL)).toEqual(testSelectedGeography);
    });
  }
});
