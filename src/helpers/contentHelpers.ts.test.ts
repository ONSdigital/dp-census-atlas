import type { Mode } from "../types";
import type { Category, Classification, Variable, VariableGroup } from "../types";
import { internal } from "./contentHelpers";

const makeTestVariableGroups = (n: number, parentName = ""): VariableGroup[] => {
  const variableGroups = [];
  for (let i = 0; i < n; i++) {
    variableGroups.push({
      name: `test variable group ${parentName} ${i}`,
      slug: `test-variable-group-${parentName}-${i}`,
      desc: `${parentName}${i} test variableGroup`,
      variables: makeTestVariables(n, `${parentName}_${i}`) as Variable[],
    });
  }
  return variableGroups;
};

const makeTestVariables = (n: number, parentName: string): Variable[] => {
  const variables = [];
  for (let i = 0; i < n; i++) {
    variables.push({
      name: `test variable ${parentName} ${i}`,
      slug: `test-variable-${parentName}-${i}`,
      code: `tv${parentName}${i}`,
      desc: `${parentName}${i} test variable`,
      units: "test_units",
      topic_code: `tp-${parentName}`,
      classifications: makeTestClassifications(n, `${parentName}_${i}`) as Classification[],
    });
  }
  return variables;
};

const makeTestClassifications = (n: number, parentName: string): Classification[] => {
  const classifications = [];
  for (let i = 0; i < n; i++) {
    classifications.push({
      code: `tcls${parentName}${i}`,
      slug: `test-classification-${parentName}-${i}`,
      desc: `${parentName}${i} test classification`,
      categories: makeTestCategories(n, `${parentName}_${i}`) as Category[],
    });
  }
  return classifications;
};

const makeTestCategories = (n: number, parentName: string): Category[] => {
  const categories = [];
  for (let i = 0; i < n; i++) {
    categories.push({
      name: `test category ${parentName} ${i}`,
      slug: `test-category-${parentName}-${i}`,
      code: `tc${parentName}${i}`,
      legend_str_1: `lorem ${parentName}${i}`,
      legend_str_2: `ipsum ${parentName}${i}`,
      legend_str_3: `whatever comes after lorem ipsum ${parentName}${i}`,
    });
  }
  return categories;
};

describe("mergeVariableGroups", () => {
  test("does not merge variable groups with different names", () => {
    // GIVEN a set of variable groups with unique names
    const variableGroupsToMerge = makeTestVariableGroups(5);
    const expectedVariableGroups = variableGroupsToMerge;
    // WHEN we call mergeVariableGroups on them, we expect them NOT to change
    expect(internal.mergeVariableGroups(variableGroupsToMerge)).toEqual(expectedVariableGroups);
  });
  test("does dedupe variable groups with the same names and content", () => {
    // GIVEN two sets of identical variable groups combined into a single array
    const variableGroupsToMerge1 = makeTestVariableGroups(5);
    const variableGroupsToMerge2 = makeTestVariableGroups(5);
    const variableGroupsToMerge = [...variableGroupsToMerge1, ...variableGroupsToMerge2];
    const expectedVariableGroups = variableGroupsToMerge1;
    // WHEN we call mergeVariableGroups on them, we expect them to be de-duplicated
    expect(internal.mergeVariableGroups(variableGroupsToMerge)).toEqual(expectedVariableGroups);
  });
  test("does merge variable groups with the same names and different variables", () => {
    // GIVEN two sets of variable groups with the same names but different variables
    const variableGroupsToMerge1 = makeTestVariableGroups(6);
    const variableGroupsToMerge2 = makeTestVariableGroups(6);
    // pop last three variable from variableGroupsToMerge1
    for (const variableGroup of variableGroupsToMerge1) {
      for (let i = 0; i < 3; i++) {
        variableGroup.variables.pop();
      }
    }
    // shift first three variables from variableGroupsToMerge2
    for (const variableGroup of variableGroupsToMerge2) {
      for (let i = 0; i < 3; i++) {
        variableGroup.variables.shift();
      }
    }
    const variableGroupsToMerge = [...variableGroupsToMerge1, ...variableGroupsToMerge2];
    const expectedVariableGroups = makeTestVariableGroups(6);
    // WHEN we call mergeVariableGroups on them, we expect them to have merged back into complete topics
    expect(internal.mergeVariableGroups(variableGroupsToMerge)).toEqual(expectedVariableGroups);
  });
});

describe("filterVariableGroupsForMode", () => {
  const testContent = [
    {
      name: "Test VG",
      slug: "testvg",
      desc: "Test variable group",
      variables: [
        {
          name: "Test Var1",
          code: "test_var_1",
          slug: "test-var-1",
          desc: "Test Var1 for both choropleth and change modes.",
          long_desc: "",
          base_url_2021: "https://test_base_url_2021",
          base_url_2011_2021_comparison: "https://test_base_url_2011_2021",
          classifications: [
            {
              code: "Test Var1 Cls1",
              slug: "test-var1-cls1",
              desc: "Test Cls1 with all categories for both choropleth and change",
              available_geotypes: ["msoa", "lad"],
              comparison_2011_data_available_geotypes: ["lad"],
              categories: [
                {
                  name: "Common to choropleth and change 1",
                  slug: "common-to-choropleth-and-change 1",
                  code: "v1cls1-001",
                  legend_str_1: "",
                  legend_str_2: "",
                  legend_str_3: "",
                },
                {
                  name: "Common to choropleth and change 2",
                  slug: "common-to-choropleth-and-change 2",
                  code: "v1cls1-002",
                  legend_str_1: "",
                  legend_str_2: "",
                  legend_str_3: "",
                },
              ],
            },
          ],
        },
        {
          name: "Test Var2",
          code: "test_var_2",
          slug: "test-var-2",
          desc: "Test Var2 with mix of choropleth-specific and change-specific categories.",
          long_desc: "",
          base_url_2021: "https://test_base_url_2021",
          base_url_2011_2021_comparison: "https://test_base_url_2011_2021",
          classifications: [
            {
              code: "Test Var2 Cls1",
              slug: "test-var2-cls1",
              desc: "Test Cls1 with mix of choropleth-specific and change-specific categories.",
              available_geotypes: ["msoa", "lad"],
              comparison_2011_data_available_geotypes: ["lad"],
              categories: [
                {
                  name: "Choropleth specific category",
                  slug: "choropleth-specific-category",
                  code: "v2cls1-001",
                  legend_str_1: "",
                  legend_str_2: "",
                  legend_str_3: "",
                  restrict_to_modes: ["choropleth"],
                },
                {
                  name: "Change specific category",
                  slug: "change-specific-category",
                  code: "v2cls1-002",
                  legend_str_1: "",
                  legend_str_2: "",
                  legend_str_3: "",
                  restrict_to_modes: ["change"],
                },
                {
                  name: "Common to choropleth and change",
                  slug: "common-to-choropleth-and-change",
                  code: "v2cls1-003",
                  legend_str_1: "",
                  legend_str_2: "",
                  legend_str_3: "",
                },
              ],
            },
          ],
        },
        {
          name: "Test Var3",
          code: "test_var_3",
          slug: "test-var-3",
          desc: "Test Var3 for choropleth only (no classification with comparison_2011_data_available_geotypes).",
          long_desc: "",
          base_url_2021: "https://test_base_url_2021",
          base_url_2011_2021_comparison: "https://test_base_url_2011_2021",
          classifications: [
            {
              code: "Test Var3 Cls1",
              slug: "test-var3-cls1",
              desc: "Test Cls1 with all categories for choropleth only",
              available_geotypes: ["msoa", "lad"],
              categories: [
                {
                  name: "Choropleth only 1",
                  slug: "choropleth-only-1",
                  code: "v3cls1-001",
                  legend_str_1: "",
                  legend_str_2: "",
                  legend_str_3: "",
                },
                {
                  name: "Choropleth only 1",
                  slug: "choropleth-only-2",
                  code: "v3cls1-002",
                  legend_str_1: "",
                  legend_str_2: "",
                  legend_str_3: "",
                },
              ],
            },
          ],
        },
        {
          name: "Test Var4",
          code: "test_var_4",
          slug: "test-var-4",
          desc: "Test Var4 for choropleth only (no variable with base_url_2011_2021_comparison).",
          long_desc: "",
          base_url_2021: "https://test_base_url_2021",
          classifications: [
            {
              code: "Test Var3 Cls1",
              slug: "test-var3-cls1",
              desc: "Test Cls1 with all categories for choropleth only",
              available_geotypes: ["msoa", "lad"],
              comparison_2011_data_available_geotypes: ["lad"],
              categories: [
                {
                  name: "Choropleth only 1",
                  slug: "choropleth-only-1",
                  code: "v4cls1-001",
                  legend_str_1: "",
                  legend_str_2: "",
                  legend_str_3: "",
                },
                {
                  name: "Choropleth only 1",
                  slug: "choropleth-only-2",
                  code: "v4cls1-002",
                  legend_str_1: "",
                  legend_str_2: "",
                  legend_str_3: "",
                },
              ],
            },
          ],
        },
      ],
    },
  ] as VariableGroup[];
  const expectedChoroplethContent = [
    {
      name: "Test VG",
      slug: "testvg",
      desc: "Test variable group",
      variables: [
        {
          name: "Test Var1",
          code: "test_var_1",
          slug: "test-var-1",
          desc: "Test Var1 for both choropleth and change modes.",
          long_desc: "",
          base_url_2021: "https://test_base_url_2021",
          base_url_2011_2021_comparison: "https://test_base_url_2011_2021",
          classifications: [
            {
              code: "Test Var1 Cls1",
              slug: "test-var1-cls1",
              desc: "Test Cls1 with all categories for both choropleth and change",
              available_geotypes: ["msoa", "lad"],
              comparison_2011_data_available_geotypes: ["lad"],
              categories: [
                {
                  name: "Common to choropleth and change 1",
                  slug: "common-to-choropleth-and-change 1",
                  code: "v1cls1-001",
                  legend_str_1: "",
                  legend_str_2: "",
                  legend_str_3: "",
                },
                {
                  name: "Common to choropleth and change 2",
                  slug: "common-to-choropleth-and-change 2",
                  code: "v1cls1-002",
                  legend_str_1: "",
                  legend_str_2: "",
                  legend_str_3: "",
                },
              ],
            },
          ],
        },
        {
          name: "Test Var2",
          code: "test_var_2",
          slug: "test-var-2",
          desc: "Test Var2 with mix of choropleth-specific and change-specific categories.",
          long_desc: "",
          base_url_2021: "https://test_base_url_2021",
          base_url_2011_2021_comparison: "https://test_base_url_2011_2021",
          classifications: [
            {
              code: "Test Var2 Cls1",
              slug: "test-var2-cls1",
              desc: "Test Cls1 with mix of choropleth-specific and change-specific categories.",
              available_geotypes: ["msoa", "lad"],
              comparison_2011_data_available_geotypes: ["lad"],
              categories: [
                {
                  name: "Choropleth specific category",
                  slug: "choropleth-specific-category",
                  code: "v2cls1-001",
                  legend_str_1: "",
                  legend_str_2: "",
                  legend_str_3: "",
                  restrict_to_modes: ["choropleth"],
                },
                // CHANGE-SPECIFIC CONTENT SHOULD BE REMOVED
                // {
                //   name: "Change specific category",
                //   slug: "change-specific-category",
                //   code: "v2cls1-002",
                //   legend_str_1: "",
                //   legend_str_2: "",
                //   legend_str_3: "",
                //   restrict_to_modes: ["change"],
                // },
                {
                  name: "Common to choropleth and change",
                  slug: "common-to-choropleth-and-change",
                  code: "v2cls1-003",
                  legend_str_1: "",
                  legend_str_2: "",
                  legend_str_3: "",
                },
              ],
            },
          ],
        },
        {
          name: "Test Var3",
          code: "test_var_3",
          slug: "test-var-3",
          desc: "Test Var3 for choropleth only (no classification with comparison_2011_data_available_geotypes).",
          long_desc: "",
          base_url_2021: "https://test_base_url_2021",
          base_url_2011_2021_comparison: "https://test_base_url_2011_2021",
          classifications: [
            {
              code: "Test Var3 Cls1",
              slug: "test-var3-cls1",
              desc: "Test Cls1 with all categories for choropleth only",
              available_geotypes: ["msoa", "lad"],
              categories: [
                {
                  name: "Choropleth only 1",
                  slug: "choropleth-only-1",
                  code: "v3cls1-001",
                  legend_str_1: "",
                  legend_str_2: "",
                  legend_str_3: "",
                },
                {
                  name: "Choropleth only 1",
                  slug: "choropleth-only-2",
                  code: "v3cls1-002",
                  legend_str_1: "",
                  legend_str_2: "",
                  legend_str_3: "",
                },
              ],
            },
          ],
        },
        {
          name: "Test Var4",
          code: "test_var_4",
          slug: "test-var-4",
          desc: "Test Var4 for choropleth only (no variable with base_url_2011_2021_comparison).",
          long_desc: "",
          base_url_2021: "https://test_base_url_2021",
          classifications: [
            {
              code: "Test Var3 Cls1",
              slug: "test-var3-cls1",
              desc: "Test Cls1 with all categories for choropleth only",
              available_geotypes: ["msoa", "lad"],
              comparison_2011_data_available_geotypes: ["lad"],
              categories: [
                {
                  name: "Choropleth only 1",
                  slug: "choropleth-only-1",
                  code: "v4cls1-001",
                  legend_str_1: "",
                  legend_str_2: "",
                  legend_str_3: "",
                },
                {
                  name: "Choropleth only 1",
                  slug: "choropleth-only-2",
                  code: "v4cls1-002",
                  legend_str_1: "",
                  legend_str_2: "",
                  legend_str_3: "",
                },
              ],
            },
          ],
        },
      ],
    },
  ] as VariableGroup[];
  const expectedChangeContent = [
    {
      name: "Test VG",
      slug: "testvg",
      desc: "Test variable group",
      variables: [
        {
          name: "Test Var1",
          code: "test_var_1",
          slug: "test-var-1",
          desc: "Test Var1 for both choropleth and change modes.",
          long_desc: "",
          base_url_2021: "https://test_base_url_2021",
          base_url_2011_2021_comparison: "https://test_base_url_2011_2021",
          classifications: [
            {
              code: "Test Var1 Cls1",
              slug: "test-var1-cls1",
              desc: "Test Cls1 with all categories for both choropleth and change",
              available_geotypes: ["msoa", "lad"],
              comparison_2011_data_available_geotypes: ["lad"],
              categories: [
                {
                  name: "Common to choropleth and change 1",
                  slug: "common-to-choropleth-and-change 1",
                  code: "v1cls1-001",
                  legend_str_1: "",
                  legend_str_2: "",
                  legend_str_3: "",
                },
                {
                  name: "Common to choropleth and change 2",
                  slug: "common-to-choropleth-and-change 2",
                  code: "v1cls1-002",
                  legend_str_1: "",
                  legend_str_2: "",
                  legend_str_3: "",
                },
              ],
            },
          ],
        },
        {
          name: "Test Var2",
          code: "test_var_2",
          slug: "test-var-2",
          desc: "Test Var2 with mix of choropleth-specific and change-specific categories.",
          long_desc: "",
          base_url_2021: "https://test_base_url_2021",
          base_url_2011_2021_comparison: "https://test_base_url_2011_2021",
          classifications: [
            {
              code: "Test Var2 Cls1",
              slug: "test-var2-cls1",
              desc: "Test Cls1 with mix of choropleth-specific and change-specific categories.",
              available_geotypes: ["msoa", "lad"],
              comparison_2011_data_available_geotypes: ["lad"],
              categories: [
                // CHOROPLETH-SPECIFIC CONTENT SHOULD BE REMOVED
                // {
                //   name: "Choropleth specific category",
                //   slug: "choropleth-specific-category",
                //   code: "v2cls1-001",
                //   legend_str_1: "",
                //   legend_str_2: "",
                //   legend_str_3: "",
                //   restrict_to_modes: ["choropleth"],
                // },
                {
                  name: "Change specific category",
                  slug: "change-specific-category",
                  code: "v2cls1-002",
                  legend_str_1: "",
                  legend_str_2: "",
                  legend_str_3: "",
                  restrict_to_modes: ["change"],
                },
                {
                  name: "Common to choropleth and change",
                  slug: "common-to-choropleth-and-change",
                  code: "v2cls1-003",
                  legend_str_1: "",
                  legend_str_2: "",
                  legend_str_3: "",
                },
              ],
            },
          ],
        },
        // CHOROPLETH-SPECIFIC CONTENT SHOULD BE REMOVED
        // {
        //   name: "Test Var3",
        //   code: "test_var_3",
        //   slug: "test-var-3",
        //   desc: "Test Var3 for choropleth only (no classification with comparison_2011_data_available_geotypes).",
        //   long_desc: "",
        //   base_url_2021: "https://test_base_url_2021",
        //   base_url_2011_2021_comparison: "https://test_base_url_2011_2021",
        //   classifications: [
        //     {
        //       code: "Test Var3 Cls1",
        //       slug: "test-var3-cls1",
        //       desc: "Test Cls1 with all categories for choropleth only",
        //       available_geotypes: ["msoa", "lad"],
        //       categories: [
        //         {
        //           name: "Choropleth only 1",
        //           slug: "choropleth-only-1",
        //           code: "v3cls1-001",
        //           legend_str_1: "",
        //           legend_str_2: "",
        //           legend_str_3: "",
        //         },
        //         {
        //           name: "Choropleth only 1",
        //           slug: "choropleth-only-2",
        //           code: "v3cls1-002",
        //           legend_str_1: "",
        //           legend_str_2: "",
        //           legend_str_3: "",
        //         },
        //       ],
        //     },
        //   ],
        // },
        // {
        //   name: "Test Var4",
        //   code: "test_var_4",
        //   slug: "test-var-4",
        //   desc: "Test Var4 for choropleth only (no variable with base_url_2011_2021_comparison).",
        //   long_desc: "",
        //   base_url_2021: "https://test_base_url_2021",
        //   classifications: [
        //     {
        //       code: "Test Var3 Cls1",
        //       slug: "test-var3-cls1",
        //       desc: "Test Cls1 with all categories for choropleth only",
        //       available_geotypes: ["msoa", "lad"],
        //       comparison_2011_data_available_geotypes: ["lad"],
        //       categories: [
        //         {
        //           name: "Choropleth only 1",
        //           slug: "choropleth-only-1",
        //           code: "v4cls1-001",
        //           legend_str_1: "",
        //           legend_str_2: "",
        //           legend_str_3: "",
        //         },
        //         {
        //           name: "Choropleth only 1",
        //           slug: "choropleth-only-2",
        //           code: "v4cls1-002",
        //           legend_str_1: "",
        //           legend_str_2: "",
        //           legend_str_3: "",
        //         },
        //       ],
        //     },
        //   ],
        // },
      ],
    },
  ] as VariableGroup[];
  test("filters for change and choropleth content", () => {
    // GIVEN test content with parts specific to either choropleth or change modes
    // WHEN we call filterVariableGroupsForMode for choropleth on it, we expect to get the choropleth-specific content
    expect(internal.getContentForMode(testContent, "choropleth")).toEqual(expectedChoroplethContent);
    // WHEN we call filterVariableGroupsForMode for change on it, we expect to get the change-specific content
    expect(internal.getContentForMode(testContent, "change")).toEqual(expectedChangeContent);
  });
});
