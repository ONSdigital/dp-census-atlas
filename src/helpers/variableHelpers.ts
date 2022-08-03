import type { Variable } from "../types";

export const getDefaultChoroplethClassification = (variable: Variable) => {
  return variable?.classifications.find((c) => c?.choropleth_default === true);
};
