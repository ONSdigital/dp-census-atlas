import { appBasePath } from "../buildEnv";

interface VariableGroupPageParams {
  variableGroup: string;
}

interface VariablePageParams {
  variableGroup: string;
  variable: string;
}

interface CategoryPageParams {
  variableGroup: string;
  variable: string;
  category: { classification: string; category: string };
}

type UrlParams = VariableGroupPageParams | VariablePageParams | CategoryPageParams;

/**
 * Function takes in current url and (optionally)
 * variableGroup / variable / classification / category in
 * urlParams object or (optionally) a static path e.g. "variableGroups"
 * and returns complete hyperlink string.
 * Omitting the urlParams parameter will return a link
 * to the index page.
 */
export const buildHyperlink = (url: URL, urlParams?: UrlParams, staticPath?: string) => {
  if (!urlParams && !staticPath) {
    return `${appBasePath}/${url.search}`;
  }
  if (staticPath) {
    return `${appBasePath}/choropleth/${staticPath}${url.search}`;
  }
  let link = `${appBasePath}/choropleth`;
  if ("variableGroup" in urlParams) {
    link = `${link}/${urlParams.variableGroup}`;
  }
  if ("variable" in urlParams) {
    link = `${link}/${urlParams.variable}`;
  }
  if ("category" in urlParams) {
    link = `${link}/${urlParams.category.classification}/${urlParams.category.category}`;
  }
  return `${link}${url.search}`;
};
