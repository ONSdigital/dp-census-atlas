import { test, expect } from "@playwright/test";

test("census maps shows content from the housing topic", async ({ page }) => {
  await page.goto(
    "/choropleth/housing/tenure-of-household/hh-tenure-5a/private-rented-or-lives-rent-free?msoa=E02001564",
  );

  // Expect the legend to appear
  await expect(
    page.getByText("98.0% of homes in Old Cantley, Auckley & Finningley MSOA are privately rented or rent free"),
  ).toBeVisible();

  // expect the right number of categories
  await expect(page.locator("ul > li")).toHaveCount(4);

  // click on 'more categories' and expect the number of categories shown to change
  await page.getByText("More categories").click();
  await expect(page.locator("ul > li")).toHaveCount(8);

  // click on 'more categories' and expect the number of categories shown to change back
  await page.getByText("Fewer categories").click();
  await expect(page.locator("ul > li")).toHaveCount(4);
});
