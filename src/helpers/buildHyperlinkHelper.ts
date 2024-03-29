import type { GeoType } from "../types";
import { appBasePath } from "../buildEnv";
import { setGeographyParam } from "./urlHelper";

interface HomePageParams {
  mode: string;
}

interface VariableGroupPageParams {
  mode: string;
  variableGroup: string;
}

interface VariablePageParams {
  mode: string;
  variableGroup: string;
  variable: string;
}

interface CategoryPageParams {
  mode: string;
  variableGroup: string;
  variable: string;
  category: { classification: string; category: string } | { classification: string; categories: string[] };
}

type UrlParams = HomePageParams | VariableGroupPageParams | VariablePageParams | CategoryPageParams;

/**
 * Function takes in current url and (optionally)
 * variableGroup / variable / classification / category in
 * urlParams object and (optionally) a geography object
 * and returns complete hyperlink string.
 * Omitting the urlParams parameter will return a link
 * to the index page.
 */
export const buildHyperlink = (url: URL, urlParams?: UrlParams, geography?: { geoType: GeoType; geoCode: string }) => {
  // update the geography param if given (all other queryparams should pass through unscathed)
  const searchParams = geography ? setGeographyParam(url.searchParams, geography) : url.searchParams;
  // get an actual querystring beginning with "?" else an empty string
  const search = Array.from(searchParams).length > 0 ? "?" + searchParams.toString() : "";

  if (!urlParams) {
    return `${appBasePath}/${search}`;
  }
  let link = `${appBasePath}/${urlParams.mode}`;
  if ("variableGroup" in urlParams) {
    link = `${link}/${urlParams.variableGroup}`;
  }
  if ("variable" in urlParams) {
    if (urlParams.mode === "dotdensity") {
      link = `${link}/${urlParams.variable}`;
    } else {
      link = `${link}/${urlParams.variable}`;
    }
  }
  if ("category" in urlParams) {
    if ("category" in urlParams.category) {
      link = `${link}/${urlParams.category.classification}/${urlParams.category.category}`;
    } else {
      // multiple categories (for the dotdensity mode)
      const categories = [...urlParams.category.categories].sort().join("~");
      link = `${link}/${urlParams.category.classification}/${categories === "" ? "none" : categories}`;
    }
  }
  return `${link}${search}`;
};
