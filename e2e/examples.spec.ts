import { test, expect } from "@playwright/test";

const latestExampleTexts = [
  {
    defaultGeo: "Cardiff",
    text: "View the percentages of people by sexual orientation across {GEO}.",
  },
  {
    defaultGeo: "East Lindsey",
    text: "Find out the percentage of people in employment in {GEO}.",
  },
  {
    defaultGeo: "Cornwall",
    text: "See what percentage of households use only renewable energy for their central heating in different neighbourhoods of {GEO}.",
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
