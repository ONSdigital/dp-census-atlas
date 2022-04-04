import type { Variable, VariableData, Category } from "../types";
import { formatPercentage, formatTemplateString } from "./categoryHelpers";

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
    desc: "",
    category_h_pt2: "",
    category_h_pt3: "",
    cat_location_summary_pt2: "",
  };
  const testVariable: Variable = {
    name: "testVar",
    slug: "test-var",
    code: "testVarCode",
    desc: "",
    units: "testUnits",
    categories: [],
    total: {
      name: "testTotal",
      slug: "test-total",
      code: "testTotalCode",
    },
  };
  const testVariableData: VariableData = {
    testCatCode: {
      total: 100000,
      count: 10000,
      percentage: 50,
    },
  };
  const testLocation = "testLocation";

  test("formats {variable_name}", () => {
    expect(
      formatTemplateString(testVariable, testVariableData, testCategory, testLocation, "{variable_name} in a sentence"),
    ).toEqual("testVar in a sentence");
  });
  test("formats {category_name}", () => {
    expect(
      formatTemplateString(testVariable, testVariableData, testCategory, testLocation, "{category_name} in a sentence"),
    ).toEqual("testCat in a sentence");
  });
  test("formats {category_unit}", () => {
    expect(
      formatTemplateString(testVariable, testVariableData, testCategory, testLocation, "{category_unit} in a sentence"),
    ).toEqual("testUnits in a sentence");
  });
  test("formats {category_total} to comma-seperated number", () => {
    expect(
      formatTemplateString(
        testVariable,
        testVariableData,
        testCategory,
        testLocation,
        "{category_total} in a sentence",
      ),
    ).toEqual("100,000 in a sentence");
  });
  test("formats {category_value} to comma-seperated number", () => {
    expect(
      formatTemplateString(
        testVariable,
        testVariableData,
        testCategory,
        testLocation,
        "{category_value} in a sentence",
      ),
    ).toEqual("10,000 in a sentence");
  });
  test("formats {location}", () => {
    expect(
      formatTemplateString(testVariable, testVariableData, testCategory, testLocation, "{location} in a sentence"),
    ).toEqual("testLocation in a sentence");
  });
  test("formats all in same string", () => {
    expect(
      formatTemplateString(
        testVariable,
        testVariableData,
        testCategory,
        testLocation,
        "{variable_name}, {category_name}, {category_unit}, {category_total}, {category_value}, {location} in a sentence",
      ),
    ).toEqual("testVar, testCat, testUnits, 100,000, 10,000, testLocation in a sentence");
  });
  test("formats all occurences in string", () => {
    expect(
      formatTemplateString(
        testVariable,
        testVariableData,
        testCategory,
        testLocation,
        "{variable_name}, {variable_name}, {category_name}, {category_name} in a sentence",
      ),
    ).toEqual("testVar, testVar, testCat, testCat in a sentence");
  });
});
