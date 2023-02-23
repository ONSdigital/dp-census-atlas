import type {
  Classification,
  Variable,
  VariableGroup,
  ContentTree,
  ContentConfig,
  Mode,
  DataEnv,
  Category,
} from "../types";
import staticContentJsons from "../data/staticContentJsons/index";
import { never } from "../util/typeUtil";

type ContentJson = (typeof staticContentJsons)["2021-MASTER.json"];

/*
  Fetch all content.json files referenced in content.ts for the current env, return as ContentTree
*/
export const getContentForStore = async (contentConfigs: ContentConfig[], dataEnv: DataEnv): Promise<ContentTree> => {
  // load content as specced in content configs
  let rawContent = await Promise.all(
    contentConfigs.map((ctcfg) => {
      return fetchContentForEnv(ctcfg, dataEnv);
    }),
  );

  // load and append any additional content jsons specced in meta.additional_content_jsons sections of the loaded content
  const additionalRawContent = await Promise.all(
    rawContent.map(async (contentJson) => {
      if (contentJson?.meta?.additional_content_jsons) {
        const additional_content_for_content_json = await Promise.all(
          contentJson.meta.additional_content_jsons.map(async (ctcfg) => {
            const contentJson = await fetchContentForEnv(ctcfg, dataEnv);
            return contentJson;
          }),
        );
        return additional_content_for_content_json;
      }
    }),
  );

  // combine, filter out failed loads, flatten
  rawContent.push(...additionalRawContent.flat());
  rawContent = rawContent.filter((c) => c != null).flat();

  // extract releases and variable groups
  const releases = rawContent.map((ct) => ct.meta.release);
  const allVariableGroups = rawContent.flatMap((ct) => ct.content);

  // merge and sort variableGroups
  const mergedVariableGroups = mergeVariableGroups(allVariableGroups as VariableGroup[]);
  sortVariableGroupVariables(mergedVariableGroups);

  // override data base urls with any configured fake data urls if in dev
  // removes the override property after use to avoid clutter
  let fakeDataLoaded = false;
  if (dataEnv === "dev") {
    mergedVariableGroups.forEach((vg) => {
      vg.variables.forEach((v) => {
        if (v.base_url_2021_dev_override) {
          fakeDataLoaded = true;
          v.base_url_2021 = v.base_url_2021_dev_override;
          v.base_url_2011_2021_comparison_dev_override = undefined;
        }
        if (v.base_url_2011_2021_comparison_dev_override) {
          fakeDataLoaded = true;
          v.base_url_2011_2021_comparison = v.base_url_2011_2021_comparison_dev_override;
          v.base_url_2011_2021_comparison_dev_override = undefined;
        }
      });
    });
  }

  // filter different content sets
  const choroplethContent = {
    releases: releases,
    variableGroups: filterVariableGroupsForMode(mergedVariableGroups, "choropleth") as VariableGroup[],
    fakeDataLoaded: fakeDataLoaded,
  };
  const changeOverTimeContent = {
    releases: releases,
    variableGroups: filterVariableGroupsForMode(mergedVariableGroups, "change") as VariableGroup[],
    fakeDataLoaded: fakeDataLoaded,
  };

  return {
    choropleth: choroplethContent,
    change: changeOverTimeContent,
  } as ContentTree;
};

// todo: ensure we're not shipping the statically-loaded content to prod
// todo: don't use a large try-catch statement
// todo: don't return null
/*
  Fetch content.json file from appropriate url for current env.
*/
const fetchContentForEnv = async (contentConfig: ContentConfig, dataEnv: DataEnv): Promise<ContentJson> => {
  const contentJsonUrl = getContentJsonUrl(dataEnv, contentConfig);

  // if content json url is blank, skip this (means that the current content is not configured for this env)
  if (contentJsonUrl === "") {
    return null;
  }

  // load from static if not url
  if (!contentJsonUrl.startsWith("http")) {
    if (contentJsonUrl in staticContentJsons) {
      return staticContentJsons[contentJsonUrl];
    } else {
      console.error(`${contentJsonUrl} not found in static content jsons.`);
      return null;
    }
  }

  // otherwise fetch content (NB try-catch as responses _can_ be 200-status, but really failed and not JSON...)
  try {
    const resp = await fetch(contentJsonUrl, {
      cache: "no-cache", // always ask for latest content files
    });
    if (resp.status !== 200) {
      console.error(`Content json file ${contentJsonUrl} could not be fetched.`);
      return null;
    } else {
      const contentJson = await resp.json();
      if (typeof contentJson === "string") {
        console.error(`Content json file ${contentJsonUrl} could not be fetched: ${contentJson}.`);
        return null;
      } else {
        return contentJson;
      }
    }
  } catch (e) {
    console.error(`Error fetching / parsing content json file ${contentJsonUrl}: ${e}`);
    return null;
  }
};

const getContentJsonUrl = (dataEnv: DataEnv, contentConfig: ContentConfig) => {
  switch (dataEnv) {
    case "dev":
      return contentConfig.devContentJsonUrl;
    case "publishing":
      return contentConfig.publishingContentJsonUrl;
    case "web":
      return contentConfig.webContentJsonUrl;
    default:
      never(dataEnv);
  }
};

/*
  Iterate over list of variable groups and merge variable groups with the same name.
*/
const mergeVariableGroups = (variableGroups: VariableGroup[]): VariableGroup[] => {
  const variableGroupNames = new Set(variableGroups.map((t) => t.name));
  const mergedVariableGroups = [];
  for (const variableGroupName of variableGroupNames) {
    const variableGroupsToMerge = variableGroups.filter((t) => t.name === variableGroupName);
    const allVariables = variableGroupsToMerge.flatMap((t) => t.variables);
    mergedVariableGroups.push({
      name: variableGroupsToMerge[0].name,
      slug: variableGroupsToMerge[0].slug,
      desc: variableGroupsToMerge[0].desc,
      variables: mergeVariables(allVariables as Variable[]),
    });
  }
  return mergedVariableGroups;
};

/*
  Iterate over list of Variables and merge variables with the same name. ToDo - at the moment this just dedupes categories
  with no concept of precendence in different variable definitions from different content.jsons. This will need
  extending once we have thought about how clashes between different content.json files should be handled...
*/
const mergeVariables = (variables: Variable[]) => {
  const varNames = new Set(variables.map((v) => v.name));
  const mergedVariables = [];
  for (const varName of varNames) {
    const variablesToMerge = variables.filter((v) => v.name === varName);
    const allClassifications = variablesToMerge.flatMap((v) => v.classifications);
    mergedVariables.push({
      name: variablesToMerge[0].name,
      slug: variablesToMerge[0].slug,
      code: variablesToMerge[0].code,
      desc: variablesToMerge[0].desc,
      long_desc: variablesToMerge[0].long_desc,
      units: variablesToMerge[0].units,
      topic_code: variablesToMerge[0].topic_code,
      caveat_text: variablesToMerge[0].caveat_text,
      caveat_link: variablesToMerge[0].caveat_link,
      base_url_2021: variablesToMerge[0].base_url_2021,
      base_url_2021_dev_override: variablesToMerge[0].base_url_2021_dev_override,
      base_url_2011_2021_comparison: variablesToMerge[0].base_url_2011_2021_comparison,
      base_url_2011_2021_comparison_dev_override: variablesToMerge[0].base_url_2011_2021_comparison_dev_override,
      classifications: dedupeClassifications(allClassifications as Classification[]),
    });
  }
  return mergedVariables;
};

/*
  Iterate over list of classifications and ensure theres none with the same name (classifications cannot be merged!)
*/
const dedupeClassifications = (classifications: Classification[]) => {
  const clsCodes = new Set(classifications.map((c) => c.code));
  const dedupedClassifications = [];
  for (const clsCode of clsCodes) {
    const clsToMerge = classifications.filter((c) => c.code == clsCode);
    dedupedClassifications.push(clsToMerge[0]);
  }
  return dedupedClassifications;
};

export const isInitialReleasePeriod = (content: ContentTree) => {
  return content.choropleth.variableGroups.length < 6;
};

/*
  Compare object name properties for lexical order
*/
const compareNames = (obj1, obj2) => {
  const obj1Name = obj1.name.toLowerCase();
  const obj2Name = obj2.name.toLowerCase();
  if (obj1Name < obj2Name)
    //sort string ascending
    return -1;
  if (obj1Name > obj2Name) return 1;
  return 0; //default return value (no sorting)
};

/*
  Sort all variables within a variable group alphabetically
*/
export const sortVariableGroupVariables = (variableGroups: VariableGroup[]) => {
  variableGroups.forEach((vg) => {
    vg.variables.sort(compareNames);
  });
};

const filterVariableGroupsForMode = (variableGroups: VariableGroup[], mode: Mode) => {
  return variableGroups
    .map((vg) => {
      const filtVariables = vg.variables
        .map((v) => {
          const filtClassifications = v.classifications
            .map((cl) => {
              // filter categories to those that either DO NOT have a defined 'restrict_to_modes' array, OR have one
              // that includes the current mode
              const filtCategories = cl.categories.filter((cat) => {
                return !cat.restrict_to_modes || cat.restrict_to_modes.includes(mode);
              });
              if (filtCategories.length > 0) {
                // additional mode-dependent filtering goes here
                const filtClassification = { ...cl };
                filtClassification.categories = filtCategories;
                switch (mode) {
                  // no constraints on choropleth classifications
                  case "choropleth": {
                    return filtClassification;
                  }
                  // change classifications must have comparison_2011_data_available_geotypes defined
                  case "change": {
                    if (
                      cl.comparison_2011_data_available_geotypes &&
                      cl.comparison_2011_data_available_geotypes.length > 0
                    ) {
                      return filtClassification;
                    }
                    break;
                  }
                  default: {
                    return never(mode);
                  }
                }
              }
            })
            .filter((c) => c);
          if (filtClassifications.length > 0) {
            const filtVariable = { ...v };
            filtVariable.classifications = filtClassifications;
            // additional mode-dependent filtering goes here
            switch (mode) {
              // no constraints on choropleth variables
              case "choropleth": {
                return filtVariable;
              }
              // change variables must have base_url_2011_2021_comparison defined
              case "change": {
                if (v.base_url_2011_2021_comparison) {
                  return filtVariable;
                }
                break;
              }
              default: {
                return never(mode);
              }
            }
          }
        })
        .filter((v) => v);
      if (filtVariables.length > 0) {
        const filtVariableGroup = { ...vg };
        filtVariableGroup.variables = filtVariables;
        return filtVariableGroup;
      }
    })
    .filter((vg) => vg);
};

export const getDataBaseUrlsForVariable = (variable: Variable): Record<Mode, string> => {
  return {
    choropleth: variable.base_url_2021,
    change: variable.base_url_2011_2021_comparison,
  };
};

export const getDataBaseUrlForVariable = (mode: Mode, variable: Variable) => {
  return getDataBaseUrlsForVariable(variable)[mode];
};

export const getAvailableModesForClassification = (
  variable: Variable,
  classification: Classification,
): Record<Mode, boolean> => {
  return {
    choropleth: classification.available_geotypes.length > 0,
    change:
      variable.base_url_2011_2021_comparison && classification.comparison_2011_data_available_geotypes?.length > 0,
  };
};

export const internal = {
  mergeVariableGroups,
  filterVariableGroupsForMode,
};

export const getAvailableModes = (content: ContentJson) => {
  return content.content.flatMap((g) =>
    g.variables.flatMap((v) =>
      v.classifications.flatMap((c) => ({
        classification: c,
        modes: getAvailableModesForClassification(v, c),
      })),
    ),
  );
};

const getCategoriesInClassificationForMode = (classification: Classification, mode: Mode) => {
  // if restrict_to_modes is present, then it’s available for just those modes
  // but if it’s absent, it’s available for all modes
  return classification.categories.filter(
    (c) => c.restrict_to_modes === undefined || c.restrict_to_modes.includes(mode),
  );
};

export const getFirstCategoryInClassificationForMode = (classification: Classification, mode: Mode) => {
  return getCategoriesInClassificationForMode(classification, mode)[0];
};

export const getBestMatchingCategoryInClassificationForMode = (
  category: Category,
  classification: Classification,
  mode: Mode,
) => {
  const categories = getCategoriesInClassificationForMode(classification, mode);

  // if a category has the same code, use it; otherwise just use the first
  return categories.find((c) => c.code === category.code) ?? categories[0];
};
