import { test, expect } from "@playwright/test";

test("census maps shows content from the travel to work topic", async ({ page }) => {
  await page.goto("/choropleth/work/distance-travelled-to-work/workplace-travel-4a/10km-and-over?oa=E00088941");

  // Expect the legend to appear
  await expect(page.getByText("16.1% of people in E00088941 OA travel 10km and over to work")).toBeVisible();

  // expect the right number of categories
  await expect(page.locator("ul > li")).toHaveCount(3);

  // click on 'more categories' and expect the number of categories shown to change
  await page.getByText("More categories").click();
  await expect(page.locator("ul > li")).toHaveCount(4);

  // click on 'more categories' and expect the number of categories shown to change back
  await page.getByText("Fewer categories").click();
  await expect(page.locator("ul > li")).toHaveCount(3);
});
