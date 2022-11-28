import { test, expect } from "@playwright/test";

// todo: this is how to do a small screen test...

test.use({
  // an ONS publication page adds a small amount of space around the embed
  // so minimum width we can support is 342px
  // viewport: { width: 375, height: 667 }, // iPhone SE 2020
  viewport: { width: 342, height: 667 },
});

test("embed in ONS publication should fit on iPhone SE", async ({ page }) => {
  // an ONS publication page adds a small amount of space around the embed
  // so minimum width we can support is 342px
  await page.goto("/choropleth/population/age/resident-age-3a/aged-15-years-and-under");
  // todo: how do you test for no horizontal scrollbar?
});
