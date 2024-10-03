import { get } from "svelte/store";
import { appBasePath } from "../buildEnv";
import content from "./content";
import { getContentForStore } from "../helpers/contentHelpers";
import { content as contentStore } from "../stores/content";
import type { DataEnv, ContentTree } from "../types";

/*
  Fetch and collate all content.json files for current env, then set them in the contentStore. NB - variableGroups are
  not expected to change during the apps runtime and so this will only set the contentStore if it is not already set!
*/
export const setContentStoreOnce = async () => {
  // do nothing if store already set
  if (get(contentStore)) {
    return;
  }
  // get env config
  const dataEnv = (await (await fetch(`${appBasePath}/api/data-env`)).text()) as DataEnv;

  // fetch content for store and set
  const contentForStore = await getContentForStore(content, dataEnv);
  removeGenderIdentity(contentForStore);

  contentStore.set(contentForStore);
};

const removeGenderIdentity = (content: ContentTree) => {
  const identity = content.choropleth.variableGroups.find((vg) => vg.slug === "identity");
  if (identity) {
    identity.variables = identity.variables.filter((v) => v.code !== "gender_identity");
  }
};
