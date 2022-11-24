import type { Variable } from "../types";

export type Caveat = {
  text: string;
  link?: string;
};

export const getCaveat = (v: Variable): Caveat | undefined => {
  if (v.topic_code === "TTW" || v.topic_code === "LAB") {
    return {
      text: "There are pandemic-related quality considerations for this variable.",
      link: "https://www.ons.gov.uk/releases/labourmarketandtraveltoworkcensus2021inenglandandwales",
    };
  } else if (v.code === "national_identity_all" || v.code === "national_identity_detailed") {
    return {
      text: "There are quality considerations for this variable.",
      link: "https://www.ons.gov.uk/peoplepopulationandcommunity/culturalidentity/ethnicity/methodologies/ethnicgroupnationalidentitylanguageandreligionqualityinformationforcensus2021",
    };
  } else if (v.code === "religion_tb") {
    return {
      text: 'There are quality considerations for the "not answered" category in university locations.',
      link: "https://www.ons.gov.uk/peoplepopulationandcommunity/culturalidentity/ethnicity/methodologies/ethnicgroupnationalidentitylanguageandreligionqualityinformationforcensus2021",
    };
  } else {
    return undefined;
  }
};
