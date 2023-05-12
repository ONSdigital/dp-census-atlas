import { test, expect } from "@playwright/test";

test(`can switch mode`, async ({ page }) => {
  await page.goto("/choropleth/population/household-composition/hh-family-composition-4a/single-family-household");

  // switch to dot-density mode
  await page.getByRole("button", { name: "Toggle mode panel" }).click();
  await page.getByRole("link", { name: "Dot-density 2021 Dot-density map of Census 2021 results" }).click();

  // legend should show dot-density content
  await expect(page.getByText("Household composition in England and Wales")).toBeVisible();
  await expect(page.getByText("Single family household 63%")).toBeVisible();
});
