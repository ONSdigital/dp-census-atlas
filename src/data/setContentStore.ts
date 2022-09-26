import { get } from "svelte/store";
import { appBasePath } from "../buildEnv";
import content from "./content";
import { appendBaseUrlToCategories, mergeVariableGroups } from "../helpers/contentHelpers";
import { contentStore } from "../stores/stores";
import type { ContentConfig, ContentStore, VariableGroup } from "../types";

/*
  Fetch all content.json files referenced in content.ts for the current env (specified in a back-end env var, fetched
  via the runtime-env endpoint). Return as array of objects associating the content config objects from content.ts
  with the loaded content.json.
*/
const fetchContent = async () => {
  const runtimeEnv = await (await fetch(`${appBasePath}/runtime-env`)).json();
  const contentForEnv = content[runtimeEnv.envName];
  const rawContent = await Promise.all(
    contentForEnv.map(async (ctcfg) => {
      const resp = await fetch(ctcfg.contentJsonUrl);
      if (resp.status != 200) {
        console.log(`Content json file ${ctcfg.contentJsonUr} could not be fetched.`);
        return null;
      } else {
        try {
          const contentJson = await resp.json();
          return {
            contentConfig: ctcfg,
            contentJson: contentJson,
          };
        } catch (e) {
          console.log(`Content json file ${ctcfg.contentJsonUr} could not be parsed: ${e}`);
        }
      }
    }),
  ).then((responseArry) => {
    // filter out nulls from failed loads here
    return responseArry.filter((tg) => tg != null).flat();
  });
  return rawContent;
};

/*
  Fetch and collate all content.json files for current env, then set them in the contentStore. NB - variableGroups are
  not expected to change during the apps runtime and so this will only set the contentStore if it is not already set!
*/
export const setContentStoreOnce = async () => {
  if (get(contentStore)) {
    return;
  }
  // fetch content
  const rawContent = await fetchContent();

  // append the data baseUrl from each release to each associated category to simplify data fetching later on
  rawContent.forEach((ct) => {
    appendBaseUrlToCategories(ct.contentJson.content as VariableGroup[], ct.contentConfig as ContentConfig);
  });

  // extract all successfully loaded releases
  const releases = rawContent.map((ct) => ct.contentJson.meta.release);

  // merge variableGroups
  const allVariableGroups = rawContent.flatMap((ct) => ct.contentJson.content);
  const mergedVariableGroups = mergeVariableGroups(allVariableGroups as VariableGroup[]);

  // write to store
  contentStore.set({
    releases: releases,
    variableGroups: mergedVariableGroups as VariableGroup[],
  } as ContentStore);
};
