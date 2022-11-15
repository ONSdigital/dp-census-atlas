import { test, expect } from "@playwright/test";

test("census maps shows a legend colorscheme of variable length depending on the on-screen data", async ({ page }) => {
  const legendColorsSelector = ".absolute.top-0.h-full";

  // expect five legend colors for aged-under-1-year
  await page.goto("/choropleth/population/age/resident-age-101a/aged-under-1-year");
  await expect(page.locator(legendColorsSelector)).toHaveCount(5);

  // expect four legend colors for aged-92-years
  await page.goto("/choropleth/population/age/resident-age-101a/aged-92-years");
  await expect(page.locator(legendColorsSelector)).toHaveCount(4);

  // expect three legend colors for aged-93-years
  await page.goto("/choropleth/population/age/resident-age-101a/aged-93-years");
  await expect(page.locator(legendColorsSelector)).toHaveCount(3);

  // expect three legend colors for aged-99-years at MSOA level
  await page.goto("/choropleth/population/age/resident-age-101a/aged-99-years?msoa=E02005619");
  await expect(page.locator(legendColorsSelector)).toHaveCount(2);

  // expect one legend colors for aged-99-years
  await page.goto("/choropleth/population/age/resident-age-101a/aged-99-years");
  await expect(page.locator(legendColorsSelector)).toHaveCount(1);
});
