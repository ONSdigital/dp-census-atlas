import { test, expect } from "@playwright/test";

test("expect latest examples to show", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("See how ethnically diverse different neighbourhoods are in Newham.")).toBeVisible();
});

test("expect examples to update based on selected geography", async ({ page }) => {
  await page.goto("/?lad=E07000120");
  await expect(
    page.getByText('View the percentages of people who reported having "No religion" across Hyndburn.'),
  ).toBeVisible();
});
