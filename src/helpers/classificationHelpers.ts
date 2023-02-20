import type { Mode } from "../types";
import { roundNumber, uniqueRoundedNumbers } from "../util/numberUtil";
import { never } from "../util/typeUtil";

const nonPercentageClassifications = ["population_density", "median_age"];
const twoDecimalPlaceClassifications = [
  "main_language_detailed",
  "main_language_detailed_23a",
  "gender_identity_4a",
  "gender_identity_8a",
  "sexual_orientation_4a",
  "sexual_orientation_6a",
  "sexual_orientation_9a",
];

/*
  Get appropriate helper functions and other bits and bobs related to correctly showing data from different
  classifications in the UI
*/
const classificationDataDisplayConfig = (classificationCode: string, mode: Mode) => {
  if (nonPercentageClassifications.includes(classificationCode)) {
    return {
      suffix: "",
      round: (r: number) => roundNumber({ number: r, decimalPlaces: 0 }),
      roundToString: (r: number) => parseInt(r.toFixed(0)).toLocaleString(),
      roundBreaks: (breaks: number[]) => uniqueRoundedNumbers({ numbers: breaks, decimalPlaces: 0 }),
    };
  }

  if (twoDecimalPlaceClassifications.includes(classificationCode)) {
    return {
      suffix: getStandardSuffixForMode(mode),
      round: (r: number) => roundNumber({ number: r, decimalPlaces: 2 }),
      roundToString: (r: number) => r.toFixed(2),
      roundBreaks: (breaks: number[]) => uniqueRoundedNumbers({ numbers: breaks, decimalPlaces: 2 }),
    };
  }

  // all other classifications
  return {
    suffix: getStandardSuffixForMode(mode),
    round: (r: number) => roundNumber({ number: r, decimalPlaces: 1 }),
    roundToString: (r: number) => r.toFixed(1),
    roundBreaks: (breaks: number[]) => uniqueRoundedNumbers({ numbers: breaks, decimalPlaces: 1 }),
  };
};

const getStandardSuffixForMode = (mode: Mode) => {
  switch (mode) {
    case "choropleth":
      return "%";
    case "change":
      return "pp";
    default:
      never(mode);
  }
};

export const getClassificationDataSuffix = (classificationCode: string, mode: Mode): string => {
  return classificationDataDisplayConfig(classificationCode, mode).suffix;
};

/*
  Convert number to rounded string for display.
 */
export const roundedClassificationDataToString = (classificationCode: string, mode: Mode, r: number) => {
  return classificationDataDisplayConfig(classificationCode, mode).roundToString(r);
};

/*
  Get unique rounded breaks.
*/
export const uniqueRoundedClassificationBreaks = (
  classificationCode: string,
  mode: Mode,
  breaks: number[],
): number[] => {
  return classificationDataDisplayConfig(classificationCode, mode).roundBreaks(breaks);
};
