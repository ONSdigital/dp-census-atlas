import type { TopicGroup, Topic, Variable, Category } from "../types";
import { flattenTopicGroupsToTopics, mergeTopicGroups, mergeTopics } from "./contentHelpers";

const makeTestTopicGroups = (n: number) => {
  const topicGroups = [];
  for (let i = 0; i < n; i++) {
    topicGroups.push({
      name: `test topic group ${i}`,
      slug: `test-topic-group-${i}`,
      desc: `${i} test topic group`,
      topics: makeTestTopics(n, `topic_group_${i}`) as [Topic],
    });
  }
  return topicGroups;
};

const makeTestTopics = (n: number, parentName = "") => {
  const topics = [];
  for (let i = 0; i < n; i++) {
    topics.push({
      name: `test topic ${parentName} ${i}`,
      slug: `test-topic-${parentName}-${i}`,
      desc: `${parentName}${i} test topic`,
      variables: makeTestVariables(n, `${parentName}_${i}`) as [Variable],
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
      units: "test_units",
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

describe("mergeTopicGroups", () => {
  test("does not merge topic groups with different names", () => {
    // GIVEN a set of topic groups with unique names
    const topicGroupsToMerge = makeTestTopicGroups(5);
    const expectedTopicGroups = topicGroupsToMerge;
    // WHEN we call mergeTopicGroups on them, we expect them NOT to change
    expect(mergeTopicGroups(topicGroupsToMerge as [TopicGroup])).toEqual(expectedTopicGroups);
  });
  test("does dedupe topicGroups with the same names and content", () => {
    // GIVEN two sets of identical topic groups combined into a single array
    const topicGroupsToMerge1 = makeTestTopicGroups(5);
    const topicGroupsToMerge2 = makeTestTopicGroups(5);
    const topicGroupsToMerge = [...topicGroupsToMerge1, ...topicGroupsToMerge2];
    const expectedTopicGroups = topicGroupsToMerge1;
    // WHEN we call mergeTopicGroups on them, we expect them to be de-duplicated
    expect(mergeTopicGroups(topicGroupsToMerge as [TopicGroup])).toEqual(expectedTopicGroups);
  });
  test("does merge topicGroups with the same names and different topics", () => {
    // GIVEN two sets of topic groups with the same names but different variables
    const topicGroupsToMerge1 = makeTestTopicGroups(6);
    const topicGroupsToMerge2 = makeTestTopicGroups(6);
    // pop last three topics from topicGroups in topicGroupsToMerge1
    for (const topicGroup of topicGroupsToMerge1) {
      for (let i = 0; i < 3; i++) {
        topicGroup.topics.pop();
      }
    }
    // shift first three topics from topicGroups in topicGroupsToMerge2
    for (const topicGroup of topicGroupsToMerge2) {
      for (let i = 0; i < 3; i++) {
        topicGroup.topics.shift();
      }
    }
    const topicGroupsToMerge = [...topicGroupsToMerge1, ...topicGroupsToMerge2];
    const expectedTopicGroups = makeTestTopicGroups(6);
    // WHEN we call mergeTopicGroups on them, we expect them to have merged back into complete topics
    expect(mergeTopicGroups(topicGroupsToMerge as [TopicGroup])).toEqual(expectedTopicGroups);
  });
});

describe("flattenTopicGroupsToTopics", () => {
  test("flattens topic groups to topics with the same properties as the original topicGroup", () => {
    // GIVEN a set of topic groups with unique names
    const topicGroupsToFlatten = makeTestTopicGroups(5);
    // WHEN we call flattenTopicGroupsToTopics on them
    const returnedTopics = flattenTopicGroupsToTopics(topicGroupsToFlatten as [TopicGroup]);
    // THEN we expect there to be five topics returned
    expect(returnedTopics.length).toEqual(5);
    // AND we expect each topic to have the basic properties of the original topic group
    returnedTopics.forEach((topic, i) => {
      const tg = topicGroupsToFlatten[i];
      expect([topic.name, topic.slug, topic.desc]).toEqual([tg.name, tg.slug, tg.desc]);
    });
    // AND we expect each topic to have 25 variables, which are the variables nested under the original topics
    returnedTopics.forEach((topic, i) => {
      const expected_variables = topicGroupsToFlatten[i].topics.flatMap((t) => t.variables);
      expect(topic.variables).toEqual(expected_variables);
    })
  });
});
