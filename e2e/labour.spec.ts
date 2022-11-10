import { test, expect } from "@playwright/test";

test("census maps shows content from the labour topic", async ({ page }) => {
  await page.goto(
    "/choropleth/work/hours-worked/hours-per-week-worked-3a/part-time-30-hours-or-less-worked?lad=E07000203",
  );

  // Expect the legend to appear
  await expect(page.getByText("3.5% of people in Mid Suffolk LAD work part-time: 30 hours or less")).toBeVisible();

  // expect the right number of categories
  await expect(page.locator("ul > li")).toHaveCount(2);

  // click on 'more categories' and expect the number of categories shown to change
  await page.getByText("More categories").click();
  await expect(page.locator("ul > li")).toHaveCount(4);

  // click on 'more categories' and expect the number of categories shown to change back
  await page.getByText("Fewer categories").click();
  await expect(page.locator("ul > li")).toHaveCount(2);
});
