import { get } from "svelte/store";
import { contentJsonUrls } from "../env";
import { topicStore } from "../stores/stores";
import { mergeTopics } from "../helpers/topicHelpers";
import type { Topic } from "../types";

// use async/await for better "error handling", non-200 returns, not JSON, etc
const fetchTopicsFromContentJsons = async () => {
  const topics = await Promise.all(
    contentJsonUrls.map(async (config_json_url) => {
      const resp = await fetch(config_json_url);
      if (resp.status != 200) {
        console.log(`Content json file ${config_json_url} could not be fetched.`);
        return null;
      } else {
        try {
          const contentJson = await resp.json();
          return contentJson;
        } catch (e) {
          console.log(`Content json file ${config_json_url} could not be parsed: ${e}`);
        }
      }
    }),
  ).then((responseArry) => {
    return responseArry.filter((t) => t != null).flat();
  });
  return topics;
};

/*
  Fetch and collate all content.json files defined in env, then set them in the topicStore. 
  NB - topics are not expected to change during the apps runtime and so this will only set the topicStore if it is 
  not already set!
*/
export const setTopicStoreOnce = async () => {
  if (get(topicStore)) {
    return;
  }
  const topics = await fetchTopicsFromContentJsons();
  const mergedTopics = mergeTopics(topics as [Topic]);
  topicStore.set(mergedTopics as [Topic]);
};
