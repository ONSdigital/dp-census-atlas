import { test, expect } from "@playwright/test";

test("census maps shows content from the EILR topic", async ({ page }) => {
  await page.goto("/choropleth/identity/main-language-detailed/main-language-detailed-23a/portuguese?lad=E08000033");

  // Expect the legend to appear
  await expect(page.getByText("57.2% of people in Calderdale LAD speak Portuguese")).toBeVisible();

  // expect the right number of categories
  await expect(page.locator("ul > li")).toHaveCount(22);

  // click on 'more categories' and expect the number of categories shown to change
  await page.getByText("More categories").click();
  await expect(page.locator("ul > li")).toHaveCount(94);

  // click on 'more categories' and expect the number of categories shown to change back
  await page.getByText("Fewer categories").click();
  await expect(page.locator("ul > li")).toHaveCount(22);
});
