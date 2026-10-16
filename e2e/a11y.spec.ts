import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const THEME_KEY = "theme"; // same key as src/lib/theme.ts

for (const theme of ["dark", "light"]) {
  for (const path of ["/", "/tr"]) {
    test(`no serious a11y violations on ${path} (${theme})`, async ({ page }) => {
      await page.goto(path);
      await page.evaluate(([key, value]) => localStorage.setItem(key, value), [THEME_KEY, theme]);
      await page.reload();
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await page.locator("h1").waitFor();
      // Wait for the hero reveal to settle: contrast is measured on the final positions.
      await page.waitForFunction(() =>
        [...document.querySelectorAll(".split-line")].every((el) => {
          const t = getComputedStyle(el).transform;
          return t === "none" || /matrix\(1, 0, 0, 1, 0, -?0(\.\d+)?\)/.test(t);
        }),
      );
      const { violations } = await new AxeBuilder({ page }).analyze();
      const bad = violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
      expect(bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
    });
  }
}
