import content from "../../data/content";
import {
  appendBaseUrlToCategories,
  mergeVariableGroups,
  sortVariableGroupVariables,
} from "../../helpers/contentHelpers";
import type { ContentConfig, ContentTree, VariableGroup } from "../../types";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ fetch }) {
  const envName = process.env["ENV_NAME"] || import.meta.env.VITE_ENV_NAME;
  const isPublishing = (process.env["IS_PUBLISHING"] || "false").toLowerCase() === "true";
  const envMode = isPublishing ? "publishing" : "web";
  const contentForEnvAndMode = content[envName][envMode];
  // fetch content
  const rawContent = await Promise.all(
    contentForEnvAndMode.map(async (ctcfg) => {
      try {
        const resp = await fetch(ctcfg.contentJsonUrl, {
          cache: "no-cache", // always ask for latest content files
        });
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

  return {
    contentForStore: {
      releases: releases,
      variableGroups: mergedVariableGroups as VariableGroup[],
      fakeDataLoaded: fakeDataLoaded,
    } as ContentTree,
  };
}
