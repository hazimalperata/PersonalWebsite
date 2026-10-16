import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  webServer: { command: "yarn start -p 3210", port: 3210, reuseExistingServer: true, timeout: 120_000 },
  use: {
    baseURL: "http://localhost:3210",
    launchOptions: { args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
