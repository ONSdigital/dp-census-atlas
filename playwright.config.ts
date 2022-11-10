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
  expect: { timeout: 30000 },
};

export default config;
