import { test, expect } from "@playwright/test";

test("home screen actually loads", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByText("Use our maps to find out what people's lives were like across England and Wales in March 2021."),
  ).toBeVisible();
});
