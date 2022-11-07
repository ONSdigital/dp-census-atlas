import { derived } from "svelte/store";
import { page } from "$app/stores";
import { content } from "./content";
import { getSelectedGeography } from "../helpers/paramsHelper";

/**
 * A Svelte store reflecting the parsed application URL parameters.
 */
export const params = derived([page, content], ([$page, $content]) => {
  const variableGroup = $content?.variableGroups.find((vg) => vg.slug === $page.params.variableGroup);
  const variable = variableGroup?.variables.find((v) => v.slug === $page.params.variable);
  const classification = variable?.classifications.find((c) => c.slug === $page.params.classification);
  const category = classification?.categories.find((c) => c.slug === $page.params.category);

  return {
    variableGroup,
    variable,
    classification,
    category,
    ...parseSearchParams($page.url.searchParams),
  };
});

const parseSearchParams = (params: URLSearchParams) => {
  let embedParams = undefined;
  if (params.get("embed") === "true") {
    embedParams = {
      interactive: params.get("embedInteractive") === "true",
      areaSearch: params.get("embedAreaSearch") === "true",
      view: params.get("embedView"),
    }
    if  (params.get("embedView") === "viewport") {
      embedParams.bounds = params.get("embedBounds").split(",").map((b) => parseFloat(b));
    }
  }
  return {
    ...getSelectedGeography(params),
    embed: embedParams
  };
};
