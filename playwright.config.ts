import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  webServer: {
    command: "npm run build && npm run preview",
    port: 4173,
  },
  use: {
    baseURL: "http://localhost:28100",
  },
  fullyParallel: true,
  timeout: 60000,
  expect: { timeout: 60000 },
};

export default config;
