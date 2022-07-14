import type { Variable } from "../types";

export const getDefaultClassification = (variable: Variable) => {
  return variable?.classifications.find((c) => c?.default === "true");
};
