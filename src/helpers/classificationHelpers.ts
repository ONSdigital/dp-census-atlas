import { roundNumber, uniqueRoundedNumbers } from "../util/numberUtil";

/*
  Get appropriate helper functions and other bits and bobs related to correctly showing data from different
  classifications in the UI
*/
const classificationDataDisplayConfig = (classificationCode: string) => {
  const nonPercentageClassifications = ["population_density", "median_age"];
  if (nonPercentageClassifications.includes(classificationCode)) {
    return {
      suffix: "",
      round: (r: number) => roundNumber({ number: r, decimalPlaces: 0 }),
      roundToString: (r: number) => parseInt(r.toFixed(0)).toLocaleString(),
      roundBreaks: (breaks: number[]) => uniqueRoundedNumbers({ numbers: breaks, decimalPlaces: 0 }),
    };
  }
  const twoDecimalPlaceClassifications = ["main_language_detailed", "main_language_detailed_23a"];
  if (twoDecimalPlaceClassifications.includes(classificationCode)) {
    return {
      suffix: "%",
      round: (r: number) => roundNumber({ number: r, decimalPlaces: 2 }),
      roundToString: (r: number) => r.toFixed(2),
      roundBreaks: (breaks: number[]) => uniqueRoundedNumbers({ numbers: breaks, decimalPlaces: 2 }),
    };
  }
  // all other classifications
  return {
    suffix: "%",
    round: (r: number) => roundNumber({ number: r, decimalPlaces: 1 }),
    roundToString: (r: number) => r.toFixed(1),
    roundBreaks: (breaks: number[]) => uniqueRoundedNumbers({ numbers: breaks, decimalPlaces: 1 }),
  };
};

/*
  Return "%" if variable is a percentage variable (all except two are!), otherwise return ""
*/
export const getClassificationDataSuffix = (classificationCode: string): string => {
  return classificationDataDisplayConfig(classificationCode).suffix;
};

/*
  Convert number to rounded string for display.
 */
export const roundedClassificationDataToString = (classificationCode: string, r): string => {
  return classificationDataDisplayConfig(classificationCode).roundToString(r);
};

/*
  Get unique rounded breaks.
*/
export const uniqueRoundedClassificationBreaks = (classificationCode: string, breaks: number[]): number[] => {
  return classificationDataDisplayConfig(classificationCode).roundBreaks(breaks);
};

/*
  Round number to standard decimal places.
*/
export const roundedClassificationData = (classificationCode: string, r: number) => {
  return classificationDataDisplayConfig(classificationCode).round(r);
};
