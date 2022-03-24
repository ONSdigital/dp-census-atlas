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
  let url = "/";
  let paramsArr = [args.topic, args.variable, args.classification, args.category];
  if (args !== {}) {
    if (args.category && !args.classification) {
      paramsArr[2] = "default";
    }
    url = "/2021";
    paramsArr.forEach((param) => {
      if (param) {
        url = `${url}/${param}`;
      }
    });
  }
  if (!args.selectedGeography || args.selectedGeography.geoType === "ew" || areAllUndefined(paramsArr)) {
    return url;
  } else {
    return `${url}?${args.selectedGeography.geoType}=${args.selectedGeography.geoCode}`;
  }
};
