import type {
  Classification,
  Variable,
  VariableGroup,
  ContentTree,
  ContentConfig,
  Mode,
  DataEnv,
  Category,
  GeoType,
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
    variableGroups: getContentForMode(mergedVariableGroups, "choropleth"),
    fakeDataLoaded: fakeDataLoaded,
  };
  const dotdensityContent = {
    releases: releases,
    variableGroups: getContentForMode(mergedVariableGroups, "dotdensity"),
    fakeDataLoaded: fakeDataLoaded,
  };
  const changeOverTimeContent = {
    releases: releases,
    variableGroups: getContentForMode(mergedVariableGroups, "change"),
    fakeDataLoaded: fakeDataLoaded,
  };

  return {
    choropleth: choroplethContent,
    dotdensity: dotdensityContent,
    change: changeOverTimeContent,
  };
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
      base_url_dot_density: variablesToMerge[0].base_url_dot_density,
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

const getContentForMode = (variableGroups: VariableGroup[], mode: Mode): VariableGroup[] => {
  return variableGroups
    .map((vg) => ({
      ...vg,
      variables: vg.variables
        .filter((v) => getDataBaseUrlsForVariable(v)[mode] && getClassificationsInVariable(v, mode).length > 0)
        .map((v) => ({
          ...v,
          classifications: getClassificationsInVariable(v, mode).map((c) => ({
            ...c,
            categories: getCategoriesInClassification(c, mode),
          })),
        })),
    }))
    .filter((vg) => vg.variables.length > 0);
};

export const getDownloadUrl = (mode: Mode, classification: Classification) => {
  switch (mode) {
    case "choropleth":
    case "dotdensity":
      return classification.data_download;
    case "change":
      return classification.change_data_download;
    default:
      never(mode);
  }
};

export const getDataBaseUrlsForVariable = (variable: Variable): Record<Mode, string> => {
  return {
    choropleth: variable.base_url_2021,
    dotdensity: variable.base_url_dot_density,
    change: variable.base_url_2011_2021_comparison,
  };
};

export const getDataBaseUrlForVariable = (mode: Mode, variable: Variable) => {
  return getDataBaseUrlsForVariable(variable)[mode];
};

export const getClassificationsInVariable = (variable: Variable, mode: Mode) => {
  const classificationsWithDataAvailable = variable.classifications.filter(
    (c) => getGeoTypeDataAvailable(c, mode).length > 0,
  );

  switch (mode) {
    case "choropleth":
    case "change": {
      return classificationsWithDataAvailable;
    }
    case "dotdensity": {
      // we're using dot_density_default to mean that the classification is included for dotdensity
      return classificationsWithDataAvailable.filter((c) => c.dot_density_default);
    }
    default: {
      return never(mode);
    }
  }
};

export const getAvailableModesForClassification = (
  variable: Variable,
  classification: Classification,
): Record<Mode, boolean> => {
  return {
    choropleth: classification.available_geotypes.length > 0,
    dotdensity: classification.dot_density_default,
    change:
      variable.base_url_2011_2021_comparison && classification.comparison_2011_data_available_geotypes?.length > 0,
  };
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

const getCategoriesInClassification = (classification: Classification, mode: Mode) => {
  // if restrict_to_modes is present, then it’s available for just those modes
  // but if it’s absent, it’s available for all modes
  return classification.categories.filter(
    (c) => c.restrict_to_modes === undefined || c.restrict_to_modes.includes(mode),
  );
};

export const getFirstCategoryInClassificationForMode = (classification: Classification, mode: Mode) => {
  return getCategoriesInClassification(classification, mode)[0];
};

export const getBestMatchingCategoryInClassificationForMode = (
  category: Category,
  classification: Classification,
  mode: Mode,
) => {
  const categories = getCategoriesInClassification(classification, mode);

  // if a category has the same code, use it; otherwise just use the first
  return categories.find((c) => c.code === category.code) ?? categories[0];
};

export const getGeoTypeDataAvailable = (classification: Classification, mode: Mode) => {
  switch (mode) {
    case "choropleth":
    case "dotdensity": {
      return classification?.available_geotypes ?? [];
    }
    case "change": {
      return classification?.comparison_2011_data_available_geotypes ?? [];
    }
    default: {
      return never(mode);
    }
  }
};

export const isDataAvailable = (classification: Classification, mode: Mode, geoType: GeoType) => {
  return getGeoTypeDataAvailable(classification, mode).includes(geoType);
};

export const getDefaultClassification = (variable: Variable, mode: Mode) => {
  if (!variable) {
    throw "No variable argument provided.";
  }

  const choroplethDefault = variable.classifications.find((c) => c.choropleth_default);

  switch (mode) {
    case "choropleth":
      return choroplethDefault;
    case "dotdensity":
      return variable.classifications.find((c) => c.dot_density_default);
    case "change": {
      // try to return choropleth default, just return first classification if none
      // TODO: check if this is correct - how is using the choropleth default classification OK? what if it doesn't exist for change?
      return choroplethDefault ?? variable?.classifications[0];
    }
    default:
      never(mode);
  }
};

// export functions for testing
export const internal = {
  mergeVariableGroups,
  getContentForMode,
};
