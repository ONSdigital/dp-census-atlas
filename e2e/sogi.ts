import { test, expect } from "@playwright/test";

test("census maps shows content from the SOGI topic", async ({ page }) => {
  await page.goto(
    "/choropleth/identity/gender-identity/gender-identity-4a/gender-identity-different-from-sex-registered-at-birth?msoa=E02003604",
  );

  // Expect the legend to appear
  await expect(
    page.getByText(
      "93.2% of families in Biggleswade East MSOA have a gender identity different from their sex registered at birth",
    ),
  ).toBeVisible();

  // expect the right number of categories
  await expect(page.locator("ul > li")).toHaveCount(3);

  // click on 'more categories' and expect the number of categories shown to change
  await page.getByText("More categories").click();
  await expect(page.locator("ul > li")).toHaveCount(7);

  // click on 'more categories' and expect the number of categories shown to change back
  await page.getByText("Fewer categories").click();
  await expect(page.locator("ul > li")).toHaveCount(3);
});
