import { test, expect } from "@playwright/test";

// todo: this is how to do a small screen test...

test.use({
  viewport: { width: 375, height: 667 },
});

test("my iPhone SE test", async ({ page }) => {
  // ...
});
