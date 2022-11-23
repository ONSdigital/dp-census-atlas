import type { Variable } from "../types";

export type Caveats = {
  warn?: { text: string; link?: string };
  info?: { text: string; link?: string };
};

export const getCaveats = (v: Variable): Caveats => {
  if (v.topic_code === "TTW" || v.topic_code === "LAB") {
    return {
      warn: {
        text: "There are pandemic-related quality considerations for this variable.",
        link: "https://www.ons.gov.uk/releases/labourmarketandtraveltoworkcensus2021inenglandandwales",
      },
    };
  } else if (v.code === "national_identity_detailed") {
    return {
      warn: {
        text: "There are quality considerations for this variable.",
        link: "https://www.ons.gov.uk/peoplepopulationandcommunity/culturalidentity/ethnicity/methodologies/ethnicgroupnationalidentitylanguageandreligionqualityinformationforcensus2021",
      },
    };
  } else if (v.code === "religion_tb") {
    return {
      warn: {
        text: 'There are quality considerations for the "not answered" category in university locations.',
        link: "https://www.ons.gov.uk/peoplepopulationandcommunity/culturalidentity/ethnicity/methodologies/ethnicgroupnationalidentitylanguageandreligionqualityinformationforcensus2021",
      },
    };
  } else {
    return {};
  }
};
