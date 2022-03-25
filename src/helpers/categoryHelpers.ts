import topics from "../data/content";
import { defaultGeography } from "./spatialHelper";
import type { Variable, VariableData, Category } from "../types";
import { unCapitalizeFirstLetter } from "../util/stringUtil";

export const getCodesForCategory = (
  topicSlug: string,
  variableSlug: string,
  classificationSlug: string,
  categorySlug: string,
) => {
  const topic = topics.find((t) => t.slug === topicSlug);
  const variable = topic.variables.find((v) => v.slug === variableSlug);
  const classification = {
    name: "Default",
    desc: "Default classification",
    categories: variable.categories,
  };
  const category = variable.categories.find((c) => c.slug === categorySlug);

  return {
    totalCode: variable.total.code,
    categoryCode: category.code,
    categoryCodes: variable.categories.map((c) => c.code),
  };
};

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
    return { geoType: defaultGeography.meta.geotype, geoCode: defaultGeography.meta.code };
  }
}

export const formatPercentage = (percentage: number) => {
  return (Math.round(percentage * 10) / 10).toFixed(1);
};

export const formatTemplateString = (
  variable: Variable,
  variableData: VariableData,
  category: Category,
  location: string,
  templateStr: string,
) => {
  const stringReplaceMap = {
    "{variable_name}": unCapitalizeFirstLetter(variable.name),
    "{category_name}": unCapitalizeFirstLetter(category.name),
    "{category_unit}": unCapitalizeFirstLetter(variable.units),
    "{category_total}": variableData[category.code].total.toLocaleString(),
    "{category_value}": variableData[category.code].count.toLocaleString(),
    "{category_percentage}": formatPercentage(variableData[category.code].percentage),
    "{location}": location,
  };
  Object.entries(stringReplaceMap).forEach(([strToReplace, replacementStr]) => {
    templateStr = templateStr.replace(new RegExp(strToReplace, "g"), replacementStr);
  });
  return templateStr;
};

export const comparePercentage = (percentage1: number, percentage2: number) => {
  const difference = percentage1 - percentage2;
  console.log(difference);
  if (difference > 0) {
    return `${formatPercentage(difference)}% higher than`;
  } else if (difference < 0) {
    return `${formatPercentage(difference * -1)}% lower than`;
  }
  return "the same as";
};
