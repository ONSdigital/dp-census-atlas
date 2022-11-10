import { test, expect } from "@playwright/test";

test("census maps shows content from the demography topic", async ({ page }) => {
  await page.goto(
    "/choropleth/population/household-composition/hh-family-composition-4a/multiple-family-household?lad=E07000035",
  );

  // Expect the legend to appear
  await expect(page.getByText("3.1% of households in Derbyshire Dales LAD are other household types")).toBeVisible();

  // expect the right number of categories
  await expect(page.locator("ul > li")).toHaveCount(3);

  // click on 'more categories' and expect the number of categories shown to change
  await page.getByText("More categories").click();
  await expect(page.locator("ul > li")).toHaveCount(14);

  // click on 'more categories' and expect the number of categories shown to change back
  await page.getByText("Fewer categories").click();
  await expect(page.locator("ul > li")).toHaveCount(3);
});
