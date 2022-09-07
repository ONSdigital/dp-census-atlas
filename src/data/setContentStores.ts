import { get } from "svelte/store";
import { geodataBaseUrlStore, topicStore } from "../stores/stores";
import { mergeTopics } from "../helpers/topicHelpers";
import type { Topic } from "../types";

const fetchTopicsFromContentJsons = async (contentJsonUrls: [string]) => {
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
  Fetch and collate all content.json files defined in env (fetched from endpoint call), then set them in the topicStore. 
  NB - topics are not expected to change during the apps runtime and so this will only set the topicStore if it is 
  not already set!
  Also fetch and set the geodataBaseUrl in the geodataBaseUrlStore. Assume this is also already set if the topicStore
  is already populated.
*/
export const setContentStoresOnce = async () => {
  if (get(topicStore)) {
    return;
  }
  const env = await (await fetch("/runtime-env")).json();
  geodataBaseUrlStore.set(env.geodataBaseUrl);
  const topics = await fetchTopicsFromContentJsons(env.contentJsonUrls);
  const mergedTopics = mergeTopics(topics as [Topic]);
  topicStore.set(mergedTopics as [Topic]);
};
