import type { Variable, MapType } from "../types";

export const getDefaultClassification = (variable: Variable, mapType: MapType) => {
  // return choropleth default for choropleth
  if (mapType === "choropleth") {
    return variable?.classifications.find((c) => c?.choropleth_default === true);
  }
  // try to return choropleth default for change-over-time, just return first classification if not
  if (mapType === "change-over-time") {
    const choroplethDefault = variable?.classifications.find((c) => c?.choropleth_default === true);
    if (choroplethDefault) {
      return choroplethDefault;
    } else {
      return variable?.classifications[0];
    }
  }
};
