import { test, expect } from "@playwright/test";

const latestExampleTexts = [
  {
    defaultGeo: "Newham",
    text: "See how ethnically diverse different neighbourhoods are in {GEO}.",
  },
  {
    defaultGeo: "Caerphilly",
    text: 'View the percentages of people who reported having "No religion" across {GEO}.',
  },
  {
    defaultGeo: "East Lindsey",
    text: "Find out what percentage of people were in employment in {GEO}.",
  },
];

test("expect latest examples to show with default geographies", async ({ page }) => {
  await page.goto("/");
  for (const exampleText of latestExampleTexts) {
    await expect(page.getByText(exampleText.text.replace("{GEO}", exampleText.defaultGeo))).toBeVisible();
  }
});

test("expect latest examples to update based on selected geography", async ({ page }) => {
  await page.goto("/?lad=E07000120");
  for (const exampleText of latestExampleTexts) {
    await expect(page.getByText(exampleText.text.replace("{GEO}", "Hyndburn"))).toBeVisible();
  }
});
