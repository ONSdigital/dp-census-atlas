import type { Variable, Category, VariableGroup } from "../types";
import { unCapitalizeFirstLetter } from "../util/stringUtil";
import {
  roundedPercentageData,
  roundedNonPercentageData,
  nonPercentageToRoundedString,
  percentageToRoundedString,
  uniqueRoundedNonPercentageBreaks,
  uniqueRoundedPercentageBreaks
} from "./percentageHelpers";

export const getCategoryInfo = (categoryCode: string, variableGroups: VariableGroup[]) => {
  const allVariables = variableGroups.flatMap((vg) => vg.variables.map((v) => ({ variableGroup: vg, variable: v })));
  const allClassifications = allVariables.flatMap((v) =>
    v.variable.classifications.map((c) => ({ variableGroup: v.variableGroup, variable: v, classification: c })),
  );
  const allCategories = allClassifications.flatMap((c) =>
    c.classification.categories.map((cat) => ({
      variableGroup: c.variableGroup,
      variable: c.variable,
      classification: c,
      category: cat,
    })),
  );
  const match = allCategories.find((c) => c.category.code === categoryCode);

  return {
    variableGroup: match.variableGroup,
    variable: match.variable.variable,
    category: match.category,
  };
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


export const isNonPercentageCategoryCode = (categoryCode: string) => {
  return ["population_density-001", "median_age-001"].includes(categoryCode)
}


/*
  Return "%" if variable is a percentage variable (all except two are!), otherwise return ""
*/
export const getCategoryDataSuffix = (categoryCode: string) => {
  if (isNonPercentageCategoryCode(categoryCode)) {
    return ""
  } else {
    return "%"
  }
}

/*
  Convert number to rounded string for display.
  NB Different functions needed for percentage and non-percentage variables.
*/
export const roundCategoryDataToString = (categoryCode: string, r) => {
  if (isNonPercentageCategoryCode(categoryCode)) {
    return nonPercentageToRoundedString(r)
  } else {
    return percentageToRoundedString(r)
  }
}

/*
  Get unique rounded breaks.
  NB Different functions needed for percentage and non-percentage variables.
*/
export const uniqueRoundedCategoryBreaks = (categoryCode: string, breaks: number[]) => {
  if (isNonPercentageCategoryCode(categoryCode)) {
    return uniqueRoundedNonPercentageBreaks(breaks)
  } else {
    return uniqueRoundedPercentageBreaks(breaks)
  }
}

/*
  Round number to standard decimal places.
  NB Different functions needed for percentage and non-percentage variables.
*/
export const roundedCategoryData = (categoryCode: string, r: number) => {
  if (isNonPercentageCategoryCode(categoryCode)) {
    return roundedNonPercentageData(r)
  } else {
    return roundedPercentageData(r)
  }
}