import { test, expect } from "@playwright/test";

test("census maps shows content from the migration topic", async ({ page }) => {
  await page.goto(
    "/choropleth/population/year-of-arrival-in-the-uk/year-arrival-uk-6a/arrived-1991-to-2000?msoa=E02003786",
  );

  // Expect the legend to appear
  await expect(
    page.getByText("2.5% of people in Great Shelford & Stapleford MSOA arrived in the UK between 1991 and 2000"),
  ).toBeVisible();

  // expect the right number of categories
  await expect(page.locator("ul > li")).toHaveCount(5);

  // click on 'more categories' and expect the number of categories shown to change
  await page.getByText("More categories").click();
  await expect(page.locator("ul > li")).toHaveCount(12);

  // click on 'more categories' and expect the number of categories shown to change back
  await page.getByText("Fewer categories").click();
  await expect(page.locator("ul > li")).toHaveCount(5);
});
