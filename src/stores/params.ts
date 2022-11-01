import { derived } from "svelte/store";
import { page } from "$app/stores";
import { content } from "./content";
import { getSelectedGeography } from "../helpers/paramsHelper";

export const params = derived([page, content], ([$page, $content]) => {
  const params = $page.params;

  const variableGroup = $content?.variableGroups.find((vg) => vg.slug === params.variableGroup);
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
    ...getSelectedGeography(params),
    embed:
      params.get("embed") === "true"
        ? {
            interactive: params.get("embedInteractive") === "true",
            areaSearch: params.get("embedAreaSearch") === "true",
            view: params.get("embedView"),
          }
        : undefined,
  };
};
