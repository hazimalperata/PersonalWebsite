import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Serious and critical only. Run with the particle canvas live (swiftshader) and with reduced motion (static
// timeline), since the two draw different DOM.
const PATHS = ["/", "/tr", "/work/dremly", "/gallery", "/xyz"];

async function audit(page: Page) {
  await page.waitForLoadState("networkidle");
  const { violations } = await new AxeBuilder({ page }).analyze();
  const bad = violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
  expect(bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
}

for (const path of PATHS) {
  test(`no serious a11y violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await audit(page);
  });
}

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  for (const path of PATHS) {
    test(`no serious a11y violations on ${path} (static timeline)`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator("[data-signal-static]")).toBeVisible();
      await audit(page);
    });
  }
});
