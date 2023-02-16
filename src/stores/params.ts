import { derived } from "svelte/store";
import { page } from "$app/stores";
import { content } from "./content";
import { getSelectedGeography, getGeoLock, getMode } from "../helpers/paramsHelper";
import { parseEmbedParams } from "../helpers/embedHelper";

/**
 * A Svelte store reflecting the *parsed* application URL parameters.
 */
export const params = derived([page, content], ([$page, $content]) => {
  const mode = getMode($page.params);

  // query the content tree to find references to the content objects picked out by the path parameters
  const variableGroup = $content?.[mode]?.variableGroups.find((vg) => vg.slug === $page.params.variableGroup);
  const variable = variableGroup?.variables.find((v) => v.slug === $page.params.variable);
  const classification = variable?.classifications.find((c) => c.slug === $page.params.classification);
  const category = classification?.categories.find((c) => c.slug === $page.params.category);

  return {
    mode,
    variableGroup,
    variable,
    classification,
    category,
    ...getSelectedGeography($page.url.searchParams),
    ...getGeoLock($page.url.searchParams),
    ...parseEmbedParams($page.url.searchParams),
  };
});
