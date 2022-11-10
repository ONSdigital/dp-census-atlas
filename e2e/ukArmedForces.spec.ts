import { test, expect } from "@playwright/test";

test("census maps shows content from the uk armed forces topic", async ({ page }) => {
  await page.goto(
    "/choropleth/population/uk-armed-forces-veteran-indicator/uk-armed-forces/previously-served-in-both-regular-and-reserve-uk-armed-forces?msoa=E02002819",
  );
  // Expect the legend to appear
  await expect(
    page.getByText(
      "12.5% of people in Wilmorton & Alvaston Village MSOA have previously served in both the regular and reserve UK armed forces",
    ),
  ).toBeVisible();
});
