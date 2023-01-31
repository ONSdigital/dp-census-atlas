import { get } from "svelte/store";
import { appBasePath } from "../buildEnv";
import content from "./content";
import { mergeVariableGroups, sortVariableGroupVariables } from "../helpers/contentHelpers";
import { content as contentStore } from "../stores/content";
import type { ContentConfig, ContentTree, VariableGroup } from "../types";

/*
  Fetch all content.json files referenced in content.ts for the current env (specified in a back-end env var, fetched
  via the runtime-env endpoint). Return as array of content jsons that will later be merged.
*/
const fetchContent = async (contentConfig: ContentConfig[], isLocal: boolean, isPublishing: boolean) => {
  const rawContent = await Promise.all(
    contentConfig.map(async (ctcfg) => {
      // set appropriate content json url
      let contentJsonUrl = ctcfg.webContentJsonUrl;
      if (isLocal) {
        contentJsonUrl = ctcfg.localContentJsonUrl;
      } else if (isPublishing) {
        contentJsonUrl = ctcfg.publishingContentJsonUrl;
      }
      // fetch content
      try {
        const resp = await fetch(contentJsonUrl, {
          cache: "no-cache", // always ask for latest content files
        });
        if (resp.status != 200) {
          console.log(`Content json file ${contentJsonUrl} could not be fetched.`);
          return null;
        } else {
          const contentJson = await resp.json();
          if (typeof contentJson === "string") {
            console.log(`Content json file ${contentJsonUrl} could not be fetched: ${contentJson}.`);
            return null;
          } else {
            return contentJson;
          }
        }
      } catch (e) {
        console.log(`Error fetching / parsing content json file ${contentJsonUrl}: ${e}`);
      }
    }),
  ).then((responseArry) => {
    // filter out nulls from failed loads here
    return responseArry.filter((tg) => tg != null).flat();
  });

  // load and append any additional content jsons specced in already loaded content
  const additionalRawContent = await Promise.all(
    rawContent.map(async (contentJson) => {
      if ("additional_content_jsons" in contentJson.meta) {
        const moreContent = await fetchContent(contentJson.meta.additional_content_jsons, isLocal, isPublishing);
        return moreContent;
      }
    }),
  ).then((responseArry) => {
    // filter out nulls from failed loads here
    return responseArry.filter((tg) => tg != null).flat();
  });
  rawContent.push(...additionalRawContent);

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
  // get env config
  const runtimeEnv = await (await fetch(`${appBasePath}/api/runtime-env`)).json();

  // fetch content
  const rawContent = await fetchContent(content, runtimeEnv.envName === "dev", runtimeEnv.isPublishing);

  // extract all successfully loaded releases
  const releases = rawContent.map((ct) => ct.meta.release);

  // merge variableGroups
  const allVariableGroups = rawContent.flatMap((ct) => ct.content);
  const mergedVariableGroups = mergeVariableGroups(allVariableGroups as VariableGroup[]);

  // alphabetically sort variables within their variableGroups
  sortVariableGroupVariables(mergedVariableGroups);

  // write to store
  contentStore.set({
    releases: releases,
    variableGroups: mergedVariableGroups as VariableGroup[],
    fakeDataLoaded: false,
  } as ContentTree);
};
