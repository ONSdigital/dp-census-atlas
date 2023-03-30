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

  const poundsClassifications = [
    "gross_value_added_per_hour_worked",
    "gross_median_weekly_pay",
    "gross_disposable_household_income_per_head",
  ];
  if (poundsClassifications.includes(classificationCode)) {
    return {
      suffix: "",
      round: (r: number) => roundNumber({ number: r, decimalPlaces: 0 }),
      roundToString: (r: number) => "£" + parseInt(r.toFixed(0)).toLocaleString(),
      roundBreaks: (breaks: number[]) => uniqueRoundedNumbers({ numbers: breaks, decimalPlaces: 0 }),
    };
  }

  const minutesClassifications = [
    "public_transport_or_walk_to_employment_centre_with_500_to_4999_jobs",
    "drive_to_employment_centre_with_500_to_4999_jobs",
    "cycle_to_employment_centre_with_500_to_4999_jobs",
  ];
  if (minutesClassifications.includes(classificationCode)) {
    return {
      suffix: "",
      round: (r: number) => roundNumber({ number: r, decimalPlaces: 0 }),
      roundToString: (r: number) => parseInt(r.toFixed(0)).toLocaleString(),
      roundBreaks: (breaks: number[]) => uniqueRoundedNumbers({ numbers: breaks, decimalPlaces: 0 }),
    };
  }

  const per1kClassifications = ["additions_to_the_housing_stock"];
  if (per1kClassifications.includes(classificationCode)) {
    return {
      suffix: "",
      round: (r: number) => roundNumber({ number: r, decimalPlaces: 0 }),
      roundToString: (r: number) => parseInt(r.toFixed(0)).toLocaleString(),
      roundBreaks: (breaks: number[]) => uniqueRoundedNumbers({ numbers: breaks, decimalPlaces: 0 }),
    };
  }

  const per100kClassifications = [
    "apprenticeships_starts",
    "apprenticeships_achievements",
    "aged_19_years_and_over_further_education_and_skills_participation",
    "cardiovascular_mortality_considered_preventable_in_persons_aged_under_75",
  ];
  if (per100kClassifications.includes(classificationCode)) {
    return {
      suffix: "",
      round: (r: number) => roundNumber({ number: r, decimalPlaces: 0 }),
      roundToString: (r: number) => parseInt(r.toFixed(0)).toLocaleString(),
      roundBreaks: (breaks: number[]) => uniqueRoundedNumbers({ numbers: breaks, decimalPlaces: 0 }),
    };
  }

  const perMillionClassifications = ["homicide_offences"];
  if (perMillionClassifications.includes(classificationCode)) {
    return {
      suffix: "",
      round: (r: number) => roundNumber({ number: r, decimalPlaces: 0 }),
      roundToString: (r: number) => parseInt(r.toFixed(0)).toLocaleString(),
      roundBreaks: (breaks: number[]) => uniqueRoundedNumbers({ numbers: breaks, decimalPlaces: 0 }),
    };
  }

  const numberClassifications = ["aged_19_years_and_over_further_education_and_skills_learner_achievements"];
  if (numberClassifications.includes(classificationCode)) {
    return {
      suffix: "",
      round: (r: number) => roundNumber({ number: r, decimalPlaces: 0 }),
      roundToString: (r: number) => parseInt(r.toFixed(0)).toLocaleString(),
      roundBreaks: (breaks: number[]) => uniqueRoundedNumbers({ numbers: breaks, decimalPlaces: 0 }),
    };
  }

  const yearsClassifications = ["female_healthy_life_expectancy", "male_healthy_life_expectancy"];
  if (yearsClassifications.includes(classificationCode)) {
    return {
      suffix: "",
      round: (r: number) => roundNumber({ number: r, decimalPlaces: 0 }),
      roundToString: (r: number) => parseInt(r.toFixed(0)).toLocaleString(),
      roundBreaks: (breaks: number[]) => uniqueRoundedNumbers({ numbers: breaks, decimalPlaces: 0 }),
    };
  }

  const outOf10Classifications = ["life_satisfaction", "feeling_life_is_worthwhile", "happiness", "anxiety"];
  if (outOf10Classifications.includes(classificationCode)) {
    return {
      suffix: "",
      round: (r: number) => roundNumber({ number: r, decimalPlaces: 0 }),
      roundToString: (r: number) => parseInt(r.toFixed(0)).toLocaleString(),
      roundBreaks: (breaks: number[]) => uniqueRoundedNumbers({ numbers: breaks, decimalPlaces: 0 }),
    };
  }

  const twoDecimalPlaceClassifications = [
    "main_language_detailed",
    "main_language_detailed_23a",
    "gender_identity_4a",
    "gender_identity_8a",
    "sexual_orientation_4a",
    "sexual_orientation_6a",
    "sexual_orientation_9a",
  ];
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
