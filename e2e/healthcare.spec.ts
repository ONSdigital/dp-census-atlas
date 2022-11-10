import { test, expect } from "@playwright/test";

test("census maps shows content from the healthcare topic", async ({ page }) => {
  await page.goto("/choropleth/health/general-health/health-in-general-3a/not-good-health?oa=E00134787");

  // Expect the legend to appear
  await expect(page.getByText("54.5% of households in E00134787 OA have not good health")).toBeVisible();

  // expect the right number of categories
  await expect(page.locator("ul > li")).toHaveCount(2);

  // click on 'more categories' and expect the number of categories shown to change
  await page.getByText("More categories").click();
  await expect(page.locator("ul > li")).toHaveCount(3);

  // click on 'more categories' and expect the number of categories shown to change back
  await page.getByText("Fewer categories").click();
  await expect(page.locator("ul > li")).toHaveCount(2);
});
