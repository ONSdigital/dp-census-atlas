import type { Topic, Variable, Classification, Category } from "../types";

/*
  Iterate over list of Topics and merge topics with the same name.
*/
export const mergeTopics = (topics: [Topic]) => {
  const topicNames = new Set(topics.map((t) => t.name));
  const mergedTopics = [];
  for (const topicName of topicNames) {
    const topicsToMerge = topics.filter((t) => t.name === topicName);
    const allVariables = topicsToMerge.flatMap((t) => t.variables);
    mergedTopics.push({
      name: topicsToMerge[0].name,
      slug: topicsToMerge[0].slug,
      desc: topicsToMerge[0].desc,
      variables: mergeVariables(allVariables as [Variable]),
    });
  }
  return mergedTopics;
};

/*
  Iterate over list of Variables and merge topics with the same name. ToDo - at the moment this just dedupes categories
  with no concept of precendence in different variable definitions from different content.jsons. This will need 
  extending once we have thought about how clashes between different content.json files should be handled...
*/
const mergeVariables = (variables: [Variable]) => {
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
      classifications: dedupeClassifications(allClassifications as [Classification]),
    });
  }
  return mergedVariables;
};

/*
  Iterate over list of classifications and ensure theres none with the same name (classifications cannot be merged!)
*/
const dedupeClassifications = (classifications: [Classification]) => {
  const clsCodes = new Set(classifications.map((c) => c.code));
  const mergedCls = [];
  for (const clsCode of clsCodes) {
    const clsToMerge = classifications.filter((c) => c.code == clsCode);
    mergedCls.push(clsToMerge[0]);
  }
  return mergedCls;
};
