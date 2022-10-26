import type { ContentConfig, Classification, Variable, VariableGroup, ContentTree } from "../types";

/*
  Iterate through variable groups and append the data baseUrl to each category of each classification of each variable.
*/
export const appendBaseUrlToCategories = (variableGroups: VariableGroup[], ctcfg: ContentConfig) => {
  variableGroups.forEach((vg) => {
    vg.variables.forEach((v) => {
      v.classifications.forEach((c) => {
        c.categories.forEach((ct) => {
          ct.baseUrl = ctcfg.contentBaseUrl;
        });
      });
    });
  });
};

/*
  Iterate over list of variable groups and merge variable groups with the same name.
*/
export const mergeVariableGroups = (variableGroups: VariableGroup[]): VariableGroup[] => {
  const variableGroupNames = new Set(variableGroups.map((t) => t.name));
  const mergedVariableGroups = [];
  for (const variableGroupName of variableGroupNames) {
    const variableGroupsToMerge = variableGroups.filter((t) => t.name === variableGroupName);
    const allVariables = variableGroupsToMerge.flatMap((t) => t.variables);
    mergedVariableGroups.push({
      name: variableGroupsToMerge[0].name,
      slug: variableGroupsToMerge[0].slug,
      desc: variableGroupsToMerge[0].desc,
      variables: mergeVariables(allVariables as Variable[]),
    });
  }
  return mergedVariableGroups;
};

/*
  Iterate over list of Variables and merge variables with the same name. ToDo - at the moment this just dedupes categories
  with no concept of precendence in different variable definitions from different content.jsons. This will need
  extending once we have thought about how clashes between different content.json files should be handled...
*/
const mergeVariables = (variables: Variable[]) => {
  const varNames = new Set(variables.map((v) => v.name));
  const mergedVariables = [];
  for (const varName of varNames) {
    const variablesToMerge = variables.filter((v) => v.name === varName);
    const allClassifications = variablesToMerge.flatMap((v) => v.classifications);
    mergedVariables.push({
      name: variablesToMerge[0].name,
      slug: variablesToMerge[0].slug,
      code: variablesToMerge[0].code,
      desc: variablesToMerge[0].desc,
      long_desc: variablesToMerge[0].long_desc,
      units: variablesToMerge[0].units,
      topic_code: variablesToMerge[0].topic_code,
      classifications: dedupeClassifications(allClassifications as Classification[]),
    });
  }
  return mergedVariables;
};

/*
  Iterate over list of classifications and ensure theres none with the same name (classifications cannot be merged!)
*/
const dedupeClassifications = (classifications: Classification[]) => {
  const clsCodes = new Set(classifications.map((c) => c.code));
  const dedupedClassifications = [];
  for (const clsCode of clsCodes) {
    const clsToMerge = classifications.filter((c) => c.code == clsCode);
    dedupedClassifications.push(clsToMerge[0]);
  }
  return dedupedClassifications;
};

export const isInitialReleasePeriod = (content: ContentTree) => {
  return content.variableGroups.length <= 8;
};

/*
  Compare object name properties for lexical order
*/
const compareNames = (obj1, obj2) => {
 const obj1Name = obj1.name.toLowerCase();
 const obj2Name = obj2.name.toLowerCase();
 if (obj1Name < obj2Name) //sort string ascending
  return -1;
 if (obj1Name > obj2Name)
  return 1;
 return 0; //default return value (no sorting)
}

/*
  Sort all variables within a variable group alphabetically
*/
export const sortVariableGroupVariables = (variableGroups: VariableGroup[]) => {
  variableGroups.forEach( (vg) => {vg.variables.sort(compareNames)})
};

/*
  Return "%" if variable is a percentage variable (all except two are!), otherwise return ""
*/
export const getVariableDataSuffix = (variable: Variable) => {
  if (["population_density", "median_age"].includes(variable.code)) {
    return ""
  } else {
    return "%"
  }
}