import { test, expect } from "@playwright/test";

// run tests in this file in parallel
test.describe.configure({ mode: "parallel" });

const testCases = [
  {
    name: "demography",
    url: "/choropleth/population/household-composition/hh-family-composition-4a/multiple-family-household?lad=E07000035",
    legendText: "3.1% of households in Derbyshire Dales LAD are other household types",
    categoryCount: 3,
    nextClassificationCategoryCount: 14,
  },
  {
    name: "education",
    url: "/choropleth/education/highest-level-of-qualification/highest-qualification-6a/highest-level-of-qualification-apprenticeship?oa=E00093263",
    legendText: "78.6% of people in E00093263 OA have an apprenticeship",
    categoryCount: 5,
    nextClassificationCategoryCount: 7,
  },
  {
    name: "eilr",
    url: "/choropleth/identity/main-language-detailed/main-language-detailed-23a/portuguese?lad=E08000033",
    legendText: "57.2% of people in Calderdale LAD speak Portuguese",
    categoryCount: 22,
    nextClassificationCategoryCount: 94,
  },
  {
    name: "healthcare",
    url: "/choropleth/health/general-health/health-in-general-3a/not-good-health?oa=E00134787",
    legendText: "54.5% of households in E00134787 OA have not good health",
    categoryCount: 2,
    nextClassificationCategoryCount: 3,
  },
  {
    name: "housing",
    url: "/choropleth/housing/tenure-of-household/hh-tenure-5a/private-rented-or-lives-rent-free?msoa=E02001564",
    legendText: "98.0% of homes in Old Cantley, Auckley & Finningley MSOA are privately rented or rent free",
    categoryCount: 4,
    nextClassificationCategoryCount: 8,
  },
  {
    name: "labour",
    url: "/choropleth/work/hours-worked/hours-per-week-worked-3a/part-time-30-hours-or-less-worked?lad=E07000203",
    legendText: "3.5% of people in Mid Suffolk LAD work part-time: 30 hours or less",
    categoryCount: 2,
    nextClassificationCategoryCount: 4,
  },
  {
    name: "migration",
    url: "/choropleth/population/year-of-arrival-in-the-uk/year-arrival-uk-6a/arrived-1991-to-2000?msoa=E02003786",
    legendText: "2.5% of people in Great Shelford & Stapleford MSOA arrived in the UK between 1991 and 2000",
    categoryCount: 5,
    nextClassificationCategoryCount: 12,
  },
  {
    name: "sogi",
    url: "/choropleth/identity/gender-identity/gender-identity-4a/gender-identity-different-from-sex-registered-at-birth?msoa=E02003604",
    legendText:
      "93.2% of families in Biggleswade East MSOA have a gender identity different from their sex registered at birth",
    categoryCount: 3,
    nextClassificationCategoryCount: 7,
  },
  {
    name: "ttw",
    url: "/choropleth/work/distance-travelled-to-work/workplace-travel-4a/10km-and-over?oa=E00088941",
    legendText: "16.1% of people in E00088941 OA travel 10km and over to work",
    categoryCount: 4,
    nextClassificationCategoryCount: 5,
  },
  {
    name: "ukArmedForces",
    url: "/choropleth/population/uk-armed-forces-veteran-indicator/uk-armed-forces/previously-served-in-both-regular-and-reserve-uk-armed-forces?msoa=E02002819",
    legendText:
      "12.5% of people in Wilmorton & Alvaston Village MSOA have previously served in both the regular and reserve UK armed forces",
    categoryCount: 4,
    nextClassificationCategoryCount: undefined,
  },
];

for (const c of testCases) {
  test(`shows expected content from the ${c.name} topic test case`, async ({ page }) => {
    await page.goto(c.url);

    // expect correct legend text
    await expect(page.getByText(c.legendText)).toBeVisible();

    // expect the correct number of categories
    await expect(page.locator("ul > li")).toHaveCount(c.categoryCount);

    if (c.nextClassificationCategoryCount !== undefined) {
      // click on 'more categories' and expect the number of categories shown to change
      await page.getByText("More categories").click();
      await expect(page.locator("ul > li")).toHaveCount(c.nextClassificationCategoryCount);

      // click on 'more categories' and expect the number of categories shown to change back
      await page.getByText("Fewer categories").click();
      await expect(page.locator("ul > li")).toHaveCount(c.categoryCount);
    }
  });
}
