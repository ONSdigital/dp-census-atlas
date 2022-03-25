import type { SelectedGeographyData } from "../types";
import { areAllUndefined } from "../util/genUtil";

interface TopicPageParams {
  topic: string;
}

interface VariablePageParams {
  topic: string;
  variable: string;
}

interface CategoryPageParams {
  topic: string;
  variable: string;
  classification?: string;
  category: string;
}

type UrlParams = TopicPageParams | VariablePageParams | CategoryPageParams;

/**
 * Function takes in current url and (optionally)
 * topic / variable / classification / category in
 * urlParams object
 * and returns complete hyperlink string.
 * Omitting the urlParams parameter will return a link
 * to the index page.
 */
export const buildHyperlink = (url: URL, urlParams?: UrlParams) => {
  if (!urlParams) {
    return `/${url.search}`;
  } else {
    let link = "/2021";
    if ("topic" in urlParams) {
      link = `${link}/${urlParams.topic}`;
    }
    if ("variable" in urlParams) {
      link = `${link}/${urlParams.variable}`;
    }
    if ("classification" in urlParams) {
      link = `${link}/${urlParams.classification}`;
    }
    if ("category" in urlParams) {
      if (!("classification" in urlParams)) {
        link = `${link}/default/${urlParams.category}`;
      } else {
        link = `${link}/${urlParams.category}`;
      }
    }
    return `${link}${url.search}`;
  }
};
