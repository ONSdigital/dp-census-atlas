import type { Variable, Mode } from "../types";
import { never } from "../util/typeUtil";

export const getDefaultClassification = (variable: Variable, mode: Mode) => {
  if (!variable) {
    throw "No variable argument provided.";
  }

  const choroplethDefault = variable.classifications.find((c) => c.choropleth_default);

  switch (mode) {
    case "choropleth":
      return variable.classifications.find((c) => c.choropleth_default);
    case "change": {
      // try to return choropleth default, just return first classification if none
      // TODO: check if this is correct - how is using the choropleth default classification OK? what if it doesn't exist for change?
      return choroplethDefault ?? variable?.classifications[0];
    }
    default:
      never(mode);
  }
};
