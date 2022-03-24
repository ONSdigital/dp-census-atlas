import type { SelectedGeographyData } from "../types";
import { areAllUndefined } from "../util/genUtil";

interface IndexPageParams {}
interface TopicPageParams {
  topic: string;
  selectedGeography?: SelectedGeographyData;
}

interface VariablePageParams {
  topic: string;
  variable: string;
  selectedGeography?: SelectedGeographyData;
}

interface CategoryPageParams {
  topic: string;
  variable: string;
  classification?: string;
  category: string;
  selectedGeography?: SelectedGeographyData;
}

type PageParams = IndexPageParams | TopicPageParams | VariablePageParams | CategoryPageParams;

export const buildHyperlink = (args: PageParams) => {
  let paramsArr = [];
  let url = "/";
  if (Object.keys(args).length === 0) {
    return url;
  } else {
    if ("category" in args && !("classification" in args)) {
      args.classification = "default";
    }
    paramsArr = Object.values(args).filter((param) => typeof param === "string");
    url = "/2021";
    paramsArr.forEach((param) => {
      if (param) {
        url = `${url}/${param}`;
      }
    });
  }
  if (!("selectedGeography" in args) || ("selectedGeography" in args && args.selectedGeography.geoType === "ew")) {
    return url;
  } else {
    return `${url}?${args.selectedGeography.geoType}=${args.selectedGeography.geoCode}`;
  }
};
