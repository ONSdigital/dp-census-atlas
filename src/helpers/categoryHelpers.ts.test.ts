import type { Variable, Category, Classification } from "../types";
import { formatTemplateString } from "./categoryHelpers";

describe("formatTemplateString", () => {
  const testCategory: Category = {
    name: "testCat",
    slug: "test-cat",
    code: "testCatCode",
    legend_str_1: "",
    legend_str_2: "",
    legend_str_3: "",
    restrict_to_modes: [],
  };
  const testVariable: Variable = {
    name: "testVar",
    slug: "test-var",
    code: "testVarCode",
    desc: "",
    long_desc: "",
    units: "testUnits",
    topic_code: "testTopicCode",
    caveat_text: "testCaveatText",
    caveat_link: "testCaveatLink",
    base_url_2021: "testBaseUrl2021",
    base_url_2021_dev_override: "testBaseUrl2021DevOverride",
    base_url_2011_2021_comparison: "testBaseUrl20112021Comparison",
    base_url_2011_2021_comparison_dev_override: "testBaseUrl20112021ComparisonDevOverride",
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
