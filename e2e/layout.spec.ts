import { test, expect } from "@playwright/test";

test("some test....", async ({ page }) => {
  // expect five legend colors for aged-under-1-year
  // await page.goto("/choropleth/population/age/resident-age-101a/aged-under-1-year");
  // await expect(page.locator(legendColorsSelector)).toHaveCount(5);
});

test.use({
  viewport: { width: 375, height: 667 },
});

test("my iPhone SE test", async ({ page }) => {
  // ...
});
