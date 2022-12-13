import { test, expect } from "@playwright/test";

test("expect examples to update based on selected geography", async ({ page }) => {
  await page.goto("/?lad=E07000120");
  await expect(page.locator("[data-test-id=examples]")).toContainText("Hyndburn");
});
