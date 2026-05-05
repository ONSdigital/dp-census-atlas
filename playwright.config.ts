import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  webServer: {
    command: "npm run build && npm run preview",
    port: 4173,
  },
  use: {
    baseURL: "http://localhost:4173",
  },
  fullyParallel: true,
  timeout: 80000,
  expect: { timeout: 80000 },
};

export default config;
