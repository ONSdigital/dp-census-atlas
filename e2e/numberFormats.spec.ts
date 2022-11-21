import { test, expect } from "@playwright/test";

test("census maps changes decimal places, number suffix and thousand-seperators as appropriate when showing numbers", async ({
  page,
}) => {
  // expect no decimal places, no % and with thousand-seperator commas for population density
  await page.goto(
    "/choropleth/population/population-density/population-density/persons-per-square-kilometre?lad=E09000012",
  );
  await expect(
    page.getByText("13,593 Population density of Hackney LAD in persons per square kilometre"),
  ).toBeVisible();

  // expect two decimal places, with % for main_language_detailed_23a
  await page.goto(
    "/choropleth/identity/main-language-detailed/main-language-detailed-23a/english-english-or-welsh-if-in-wales?lad=E09000012",
  );
  await expect(
    page.getByText("99.54% of people in Hackney LAD speak English (English or Welsh if in Wales)"),
  ).toBeVisible();
});
