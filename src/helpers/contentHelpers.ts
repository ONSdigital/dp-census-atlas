import type { Classification, Variable, VariableGroup, ContentTree, ContentConfig, MapType } from "../types";
import staticContentJsons from "../data/staticContentJsons/index";

type ContentJson = (typeof staticContentJsons)["2021-MASTER.json"];

/*
  Fetch all content.json files referenced in content.ts for the current env, return as ContentTree
*/
export const getContentForStore = async (
  contentConfigs: ContentConfig[],
  isDev: boolean,
  isPublishing: boolean,
): Promise<ContentTree> => {
  // load content as specced in content configs
  let rawContent = await Promise.all(
    contentConfigs.map(async (ctcfg) => {
      return fetchContentForEnv(ctcfg, isDev, isPublishing);
    }),
  );

  // load and append any additional content jsons specced in meta.additional_content_jsons sections of the loaded content
  const additionalRawContent = await Promise.all(
    rawContent.map(async (contentJson) => {
      if (contentJson?.meta?.additional_content_jsons) {
        const additional_content_for_content_json = await Promise.all(
          contentJson.meta.additional_content_jsons.map(async (ctcfg) => {
            const contentJson = await fetchContentForEnv(ctcfg, isDev, isPublishing);
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

  // override data base urls with any configured fake data urls if in dev/netlify. NB remove the override after use
  // to avoid clutter
  let fakeDataLoaded = false;
  if (isDev) {
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
    variableGroups: filterVariableGroupsForMapType(mergedVariableGroups, "choropleth" as MapType) as VariableGroup[],
    fakeDataLoaded: fakeDataLoaded,
  };
  const changeOverTimeContent = {
    releases: releases,
    variableGroups: filterVariableGroupsForMapType(
      mergedVariableGroups,
      "change-over-time" as MapType,
    ) as VariableGroup[],
    fakeDataLoaded: fakeDataLoaded,
  };

  return {
    choropleth: choroplethContent,
    "change-over-time": changeOverTimeContent,
  } as ContentTree;
};

/*
  Fetch content.json file from appropriate url for current env.
*/
const fetchContentForEnv = async (
  contentConfig: ContentConfig,
  isDev: boolean,
  isPublishing: boolean,
): Promise<ContentJson> => {
  // set appropriate content json url
  let contentJsonUrl = contentConfig.webContentJsonUrl;
  if (isDev) {
    contentJsonUrl = contentConfig.devContentJsonUrl;
  } else if (isPublishing) {
    contentJsonUrl = contentConfig.publishingContentJsonUrl;
  }

  // if content json url is blank, skip this (means that the current content is not configured for this env)
  if (contentJsonUrl === "") {
    return null;
  }

  // load from static if not url
  if (!contentJsonUrl.startsWith("http")) {
    if (contentJsonUrl in staticContentJsons) {
      return staticContentJsons[contentJsonUrl];
    } else {
      console.log(`${contentJsonUrl} not found in static content jsons.`);
      return null;
    }
  }

  // otherwise fetch content (NB try-catch as responses _can_ be 200-status, but really failed and not JSON...)
  try {
    const resp = await fetch(contentJsonUrl, {
      cache: "no-cache", // always ask for latest content files
    });
    if (resp.status != 200) {
      console.log(`Content json file ${contentJsonUrl} could not be fetched.`);
      return null;
    } else {
      const contentJson = await resp.json();
      if (typeof contentJson === "string") {
        console.log(`Content json file ${contentJsonUrl} could not be fetched: ${contentJson}.`);
        return null;
      } else {
        return contentJson;
      }
    }
  } catch (e) {
    console.log(`Error fetching / parsing content json file ${contentJsonUrl}: ${e}`);
    return null;
  }
};

/*
  Iterate over list of variable groups and merge variable groups with the same name.
*/
export const mergeVariableGroups = (variableGroups: VariableGroup[]): VariableGroup[] => {
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

export const filterVariableGroupsForMapType = (variableGroups: VariableGroup[], mapType: MapType) => {
  // return all for choropleth
  if (mapType === "choropleth") {
    return variableGroups;
  }
  /* for change-over-time return only those variables with:
      - a defined base_url_2011_2021_comparison
      - at least one classification that has a populated comparison_2011_data_available_geotypes
  */
  if (mapType === "change-over-time") {
    const vgs = variableGroups
      .map((vg) => {
        const filtVariables = vg.variables
          .map((v) => {
            const filtClassifications = v.classifications.filter(
              (c) =>
                c.comparison_2011_data_available_geotypes && c.comparison_2011_data_available_geotypes.length !== 0,
            );
            if (v.base_url_2011_2021_comparison && filtClassifications.length > 0) {
              const filtVariable = { ...v };
              filtVariable.classifications = filtClassifications;
              return filtVariable;
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

    return vgs;
  }
};

export const contentInVariableGroups = (
  variableGroups: VariableGroup[],
  args: { variableGroup: VariableGroup; variable?: Variable; classification?: Classification },
) => {
  const matchVG = variableGroups.find((vg) => vg.name === args.variableGroup.name);
  if (matchVG) {
    if (!args?.variable) {
      return true;
    }
    const matchV = matchVG.variables.find((v) => v.code === args.variable.code);
    if (matchV) {
      if (!args?.classification) {
        return true;
      }
      const matchC = matchV.classifications.find((c) => c.code === args.classification.code);
      if (matchC) {
        return true;
      }
    }
  }
  return false;
};

export const getBaseUrlForCurrentMapType = (mapType: MapType, variable: Variable): string => {
  if (mapType === "choropleth") {
    return variable.base_url_2021;
  }
  if (mapType === "change-over-time") {
    return variable.base_url_2011_2021_comparison;
  }
};
