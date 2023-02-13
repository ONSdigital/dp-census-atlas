import { get } from "svelte/store";
import { appBasePath } from "../buildEnv";
import content from "./content";
import { getContentForStore } from "../helpers/contentHelpers";
import { content as contentStore } from "../stores/content";

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
  const runtimeEnv = await (await fetch(`${appBasePath}/api/runtime-env`)).json();

  // use dev content if dev, netlify or sandbox env
  const isDev = ["dev", "netlify", "sandbox"].includes(runtimeEnv.envName);

  // fetch content for store and set
  const contentForStore = await getContentForStore(content, isDev, runtimeEnv.isPublishing);
  contentStore.set(contentForStore);
};
