import { test, expect } from "@playwright/test";

test("census maps shows content from the education topic", async ({ page }) => {
  await page.goto(
    "/choropleth/education/highest-level-of-qualification/highest-qualification-6a/highest-level-of-qualification-apprenticeship?oa=E00093263",
  );

  // Expect the legend to appear
  await expect(page.getByText("78.6% of people in E00093263 OA have an apprenticeship")).toBeVisible();

  // expect the right number of categories
  await expect(page.locator("ul > li")).toHaveCount(5);

  // click on 'more categories' and expect the number of categories shown to change
  await page.getByText("More categories").click();
  await expect(page.locator("ul > li")).toHaveCount(7);

  // click on 'more categories' and expect the number of categories shown to change back
  await page.getByText("Fewer categories").click();
  await expect(page.locator("ul > li")).toHaveCount(5);
});
