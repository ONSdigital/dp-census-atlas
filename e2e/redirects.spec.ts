import { test, expect } from "@playwright/test";

test(`redirects to renamed category`, async ({ page }) => {
  await page.goto("/choropleth/population/household-composition/hh-family-composition-4a/multiple-family-household");
  expect(page.url()).toContain(
    "/choropleth/population/household-composition/hh-family-composition-4a/other-household-types",
  );
});
