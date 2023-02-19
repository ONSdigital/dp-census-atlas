import type { Mode } from "../types";
import { never } from "../util/typeUtil";
import { getClassificationDataSuffix } from "./classificationHelpers";

export const getSuffix = (mode: Mode, classificationCode: string) => {
  switch (mode) {
    case "choropleth":
      return getClassificationDataSuffix(classificationCode);
    case "change":
      return "pp";
    default:
      never(mode);
  }
};

export const getSign = (mode: Mode, value: number) => {
  switch (mode) {
    case "choropleth":
      return "";
    case "change":
      return value > 0 ? "+" : "";
    default:
      never(mode);
  }
};

export const shouldShowPositiveSign = (mode: Mode) => {
  switch (mode) {
    case "choropleth":
      return false;
    case "change":
      return true;
    default:
      never(mode);
  }
};

export const getDropdownDisplayType = (mode: Mode) => {
  switch (mode) {
    case "choropleth":
      return "legendString";
    case "change":
      return "name";
    default:
      never(mode);
  }
};
