import type { Mode } from "../types";
import { never } from "../util/typeUtil";

export const getSign = (mode: Mode, value: number) => {
  switch (mode) {
    case "choropleth":
    case "dotdensity":
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
    case "dotdensity":
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
    case "dotdensity":
      return "legendString";
    case "change":
      return "name";
    default:
      never(mode);
  }
};
