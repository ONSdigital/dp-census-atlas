import type { Topic, Variable, Category } from "../types";
import { mergeTopics } from "./topicHelpers";

const makeTestTopics = (n: number) => {
  const topics = [];
  for (let i = 0; i < n; i++) {
    topics.push({
      name: `test topic ${i}`,
      slug: `test-topic-${i}`,
      desc: `${i} test category`,
      variables: makeTestVariables(n, `topic_${i}`) as [Variable],
    });
  }
  return topics;
};

const makeTestVariables = (n: number, parentName: string) => {
  const variables = [];
  for (let i = 0; i < n; i++) {
    variables.push({
      name: `test variable ${parentName} ${i}`,
      slug: `test-variable-${parentName}-${i}`,
      code: `tv${parentName}${i}`,
      desc: `${parentName}${i} test variable`,
      classifications: makeTestClassifications(n, `${parentName}_${i}`) as [Category],
    });
  }
  return variables;
};

const makeTestClassifications = (n: number, parentName: string) => {
  const classifications = [];
  for (let i = 0; i < n; i++) {
    classifications.push({
      code: `tcls${parentName}${i}`,
      slug: `test-classification-${parentName}-${i}`,
      desc: `${parentName}${i} test classification`,
      categories: makeTestCategories(n, `${parentName}_${i}`) as [Category],
    });
  }
  return classifications;
};

const makeTestCategories = (n: number, parentName: string) => {
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

describe("mergeTopics", () => {
  test("does not merge topics with different names", () => {
    // GIVEN a set of topics with unique names
    const topicsToMerge = makeTestTopics(5);
    const expectedTopics = topicsToMerge;
    // WHEN we call mergeTopics on them, we expect them NOT to change
    expect(mergeTopics(topicsToMerge as [Topic])).toEqual(expectedTopics);
  });
  test("does dedupe topics with the same names and content", () => {
    // GIVEN two sets of identical topics combined into a single array
    const topicsToMerge1 = makeTestTopics(5);
    const topicsToMerge2 = makeTestTopics(5);
    const topicsToMerge = [...topicsToMerge1, ...topicsToMerge2];
    const expectedTopics = topicsToMerge1;
    // WHEN we call mergeTopics on them, we expect them to be de-duplicated
    expect(mergeTopics(topicsToMerge as [Topic])).toEqual(expectedTopics);
  });
  test("does merge topics with the same names and different variables", () => {
    // GIVEN two sets of topics with the same names but different variables
    const topicsToMerge1 = makeTestTopics(6);
    const topicsToMerge2 = makeTestTopics(6);
    // pop last three variables from topics in topicsToMerge1
    for (const topic of topicsToMerge1) {
      for (let i = 0; i < 3; i++) {
        topic.variables.pop();
      }
    }
    // shift first three variables from topics in topicsToMerge2
    for (const topic of topicsToMerge2) {
      for (let i = 0; i < 3; i++) {
        topic.variables.shift();
      }
    }
    const topicsToMerge = [...topicsToMerge1, ...topicsToMerge2];
    const expectedTopics = makeTestTopics(6);
    // WHEN we call mergeTopics on them, we expect them to have merged back into complete topics
    expect(mergeTopics(topicsToMerge as [Topic])).toEqual(expectedTopics);
  });
});
