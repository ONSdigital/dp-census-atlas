import type { SelectedGeographyData } from "../types";
import { areAllUndefined } from "../util/genUtil";

export const buildHyperlink = (args: {
  topic?: string;
  variable?: string;
  classification?: string;
  category?: string;
  selectedGeography?: SelectedGeographyData;
}) => {
  let url = "/";
  let paramsArr = [args.topic, args.variable, args.classification, args.category];
  if (args.topic) {
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
