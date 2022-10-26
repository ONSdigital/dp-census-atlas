import { get } from "svelte/store";
import { appBasePath } from "../buildEnv";
import content from "./content";
import { appendBaseUrlToCategories, mergeVariableGroups, sortVariableGroupVariables } from "../helpers/contentHelpers";
import { content as contentStore } from "../stores/content";
import type { ContentConfig, ContentTree, VariableGroup } from "../types";

/*
  Fetch all content.json files referenced in content.ts for the current env (specified in a back-end env var, fetched
  via the runtime-env endpoint). Return as array of objects associating the content config objects from content.ts
  with the loaded content.json.
*/
const fetchContent = async () => {
  // get content for current env and mode (publishing or web)
  const runtimeEnv = await (await fetch(`${appBasePath}/api/runtime-env`)).json();
  const envMode = runtimeEnv.isPublishing ? "publishing" : "web";
  const contentForEnvAndMode = content[runtimeEnv.envName][envMode];
  // fetch content
  const rawContent = await Promise.all(
    contentForEnvAndMode.map(async (ctcfg) => {
      try {
        const resp = await fetch(ctcfg.contentJsonUrl);
        if (resp.status != 200) {
          console.log(`Content json file ${ctcfg.contentJsonUrl} could not be fetched.`);
          return null;
        } else {
          const contentJson = await resp.json();
          if (typeof contentJson === "string") {
            console.log(`Content json file ${ctcfg.contentJsonUrl} could not be fetched: ${contentJson}.`);
            return null;
          } else {
            return {
              contentConfig: ctcfg,
              contentJson: contentJson,
            };
          }
        }
      } catch (e) {
        console.log(`Error fetching / parsing content json file ${ctcfg.contentJsonUrl}: ${e}`);
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

  // get fakeDataLoaded flag
  let fakeDataLoaded = false;
  const fakeDataUrlComponent = "/FAKE";
  for (const ct of rawContent) {
    if (ct.contentConfig.contentBaseUrl.includes(fakeDataUrlComponent)) {
      fakeDataLoaded = true;
      break;
    }
  }

  // merge variableGroups
  const allVariableGroups = rawContent.flatMap((ct) => ct.contentJson.content);
  const mergedVariableGroups = mergeVariableGroups(allVariableGroups as VariableGroup[]);

  // alphabetically sort variables within their variableGroups
  sortVariableGroupVariables(mergedVariableGroups);

  // write to store
  contentStore.set({
    releases: releases,
    variableGroups: mergedVariableGroups as VariableGroup[],
    fakeDataLoaded: fakeDataLoaded,
  } as ContentTree);
};
