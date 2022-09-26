import type { Category, Classification, Variable, VariableGroup } from "../types";
import { mergeVariableGroups } from "./contentHelpers";


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
    expect(mergeVariableGroups(variableGroupsToMerge)).toEqual(expectedVariableGroups);
  });
  test("does dedupe variable groups with the same names and content", () => {
    // GIVEN two sets of identical variable groups combined into a single array
    const variableGroupsToMerge1 = makeTestVariableGroups(5);
    const variableGroupsToMerge2 = makeTestVariableGroups(5);
    const variableGroupsToMerge = [...variableGroupsToMerge1, ...variableGroupsToMerge2];
    const expectedVariableGroups = variableGroupsToMerge1;
    // WHEN we call mergeVariableGroups on them, we expect them to be de-duplicated
    expect(mergeVariableGroups(variableGroupsToMerge)).toEqual(expectedVariableGroups);
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
    expect(mergeVariableGroups(variableGroupsToMerge)).toEqual(expectedVariableGroups);
  });
});
