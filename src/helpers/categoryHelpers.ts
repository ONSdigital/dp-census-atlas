import topics from "../data/content";
import { englandAndWales } from "./spatialHelper";
import type { Variable, VariableData, Category } from "../types";
import { unCapitalizeFirstLetter } from "../util/stringUtil";

export const getCategoryInfo = (categoryCode: string) => {
  const allVariables = topics.flatMap((t) => t.variables.map((v) => ({ topic: t, variable: v })));
  const allCategories = allVariables.flatMap((v) =>
    v.variable.categories.map((c) => ({ topic: v.topic, category: c, variable: v })),
  );
  const match = allCategories.find((c) => c.category.code === categoryCode);

  return {
    topic: match.topic,
    variable: match.variable.variable,
    category: match.category,
  };
};

export function getSelectedGeography(pageUrl) {
  //TODO: don't parse manually
  const pageUrlArr = pageUrl.search.split("=");
  const geoCode = pageUrlArr[1];
  const geoType = pageUrlArr[0].slice(1);
  if (geoCode) {
    return { geoType, geoCode };
  } else {
    return { geoType: englandAndWales.meta.geotype, geoCode: englandAndWales.meta.code };
  }
}

export const formatPercentage = (percentage: number) => {
  return (Math.round(percentage * 10) / 10).toFixed(1);
};

export const formatTemplateString = (variable: Variable, category: Category, location: string, templateStr: string) => {
  const stringReplaceMap = {
    "{variable_name}": unCapitalizeFirstLetter(variable.name),
    "{category_name}": unCapitalizeFirstLetter(category.name),
    "{category_unit}": unCapitalizeFirstLetter(variable.units),
    "{location}": location,
  };
  Object.entries(stringReplaceMap).forEach(([strToReplace, replacementStr]) => {
    templateStr = templateStr.replace(new RegExp(strToReplace, "g"), replacementStr);
  });
  return templateStr;
};
