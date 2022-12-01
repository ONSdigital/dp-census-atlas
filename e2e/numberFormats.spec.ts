import { test, expect } from "@playwright/test";

test("expect no decimal places, no % and with thousand-seperator commas for population density", async ({ page }) => {
  await page.goto(
    "/choropleth/population/population-density/population-density/persons-per-square-kilometre?lad=E09000012",
  );
  await expect(
    page.getByText("13,593 Population density of Hackney LAD in persons per square kilometre"),
  ).toBeVisible();
});

test("expect two decimal places, with % for main_language_detailed_23a", async ({ page }) => {
  await page.goto(
    "/choropleth/identity/main-language-detailed/main-language-detailed-23a/english-english-or-welsh-if-in-wales?lad=E09000012",
  );
  await expect(
    page.getByText("80.13% of people in Hackney LAD speak English (English or Welsh if in Wales)"),
  ).toBeVisible();
});
