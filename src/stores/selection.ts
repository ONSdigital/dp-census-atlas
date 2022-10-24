import { derived } from "svelte/store";
import { page } from "$app/stores";
import { contentStore } from "./stores";
import { getSelectedGeography } from "../helpers/selectionHelper";

export const selection = derived([page, contentStore], ([$page, $contentStore]) => {
  const params = $page.params;

  const variableGroup = $contentStore?.variableGroups.find((vg) => vg.slug === params.variableGroup);
  const variable = variableGroup?.variables.find((v) => v.slug === params.variable);
  const classification = variable?.classifications.find((c) => c.slug === params.classification);
  const category = classification?.categories.find((c) => c.slug === params.category);

  return {
    variableGroup,
    variable,
    classification,
    category,
    ...parseSearchParams($page.url.searchParams),
  };
});

const parseSearchParams = (params: URLSearchParams) => {
  return {
    embed: params.get("embed") === "true",
    ...getSelectedGeography(params),
  };
};
