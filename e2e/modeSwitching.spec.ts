import { test, expect } from "@playwright/test";

test(`can switch mode`, async ({ page }) => {
  await page.goto("/choropleth/population/household-composition/hh-family-composition-4a/single-family-household");

  // Cookie banner can cover the UI and intercept clicks.
  const rejectCookiesButton = page.getByRole("button", { name: "Reject cookies" });
  if (await rejectCookiesButton.isVisible()) {
    await rejectCookiesButton.click();
  }

  // switch to dot-density mode
  await page.getByRole("button", { name: "Toggle mode panel" }).click();
  await page.getByRole("link", { name: "Dot-density 2021 Dot-density map of Census 2021 results" }).click();

  await expect(page).toHaveURL(/\/dotdensity(\/|\?|$)/);

  // dot-density mode should show dot-specific UI copy
  await expect(
    page.getByText(
      "The dots on this map broadly represent the data in each area, but they are distributed randomly",
    ),
  ).toBeVisible();

  // Topic and category should still be present after switching
  await expect(page.getByRole("link", { name: "Single family household" })).toBeVisible();
});
