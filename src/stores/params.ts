import { derived } from "svelte/store";
import { page } from "$app/stores";
import { content } from "./content";
import { getSelectedGeography } from "../helpers/paramsHelper";
import { parseEmbedParams } from "../helpers/embedHelper";

/**
 * A Svelte store reflecting the parsed application URL parameters.
 */
export const params = derived([page, content], ([$page, $content]) => {
  const variableGroup = $content?.variableGroups.find((vg) => vg.slug === $page.params.variableGroup);
  const variable = variableGroup?.variables.find((v) => v.slug === $page.params.variable);
  const classification = variable?.classifications.find((c) => c.slug === $page.params.classification);
  const category = classification?.categories.find((c) => c.slug === $page.params.category);
  const changeOverTime = !!$page.url.searchParams.get("changeOverTime");

  return {
    variableGroup,
    variable,
    classification,
    category,
    changeOverTime,
    ...getSelectedGeography($page.url.searchParams),
    ...parseEmbedParams($page.url.searchParams),
  };
});
