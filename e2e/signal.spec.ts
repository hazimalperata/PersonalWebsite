import { chromium, expect, test, type Page } from "@playwright/test";

/** True when the 2D fallback canvas has at least one painted pixel. */
const staticIsPainted = (page: Page) =>
  page.evaluate(() => {
    const c = document.querySelector<HTMLCanvasElement>("[data-signal-static] canvas");
    const ctx = c?.getContext("2d");
    if (!c || !ctx || c.width === 0) return false;
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    for (let i = 3; i < d.length; i += 4) if (d[i] > 0) return true;
    return false;
  });

test("with motion, the particle canvas mounts and the static timeline does not", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator("[data-signal-canvas] canvas")).toBeAttached({ timeout: 20_000 });
  await expect(page.locator("[data-signal-static]")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  for (const path of ["/", "/work/posme"]) {
    test(`${path}: no particle canvas, the static timeline is visible and painted`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("[data-signal-static]")).toBeVisible();
      await expect(page.locator("[data-signal-canvas]")).toHaveCount(0);
      await expect(page.getByRole("img", { name: /commit/i })).toBeVisible();
      await expect.poll(() => staticIsPainted(page)).toBe(true);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
  }

  test("all home sections stay present", async ({ page }) => {
    await page.goto("/");
    for (const id of ["work", "about", "ai", "contact"]) await expect(page.locator(`#${id}`)).toBeVisible();
  });
});

test.describe("WebGL blocked", () => {
  // Own browser launch: the default project passes swiftshader flags that would give the page a GL context.
  test("the page falls back to the static timeline with no page errors", async ({ baseURL }, testInfo) => {
    const browser = await chromium.launch({ args: ["--disable-webgl", "--disable-gpu"] });
    try {
      const context = await browser.newContext({
        ...(testInfo.project.use.viewport ? { viewport: testInfo.project.use.viewport } : {}),
        userAgent: testInfo.project.use.userAgent,
        isMobile: testInfo.project.use.isMobile,
        hasTouch: testInfo.project.use.hasTouch,
        deviceScaleFactor: testInfo.project.use.deviceScaleFactor,
        baseURL,
      });
      const page = await context.newPage();
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      for (const path of ["/", "/work/posme", "/xyz"]) {
        await page.goto(path);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await expect(page.locator("[data-signal-static]")).toBeVisible({ timeout: 20_000 });
        await expect(page.locator("[data-signal-canvas]")).toHaveCount(0);
        await expect.poll(() => staticIsPainted(page)).toBe(true);
      }
      await page.goto("/");
      for (const id of ["work", "about", "ai", "contact"]) await expect(page.locator(`#${id}`)).toBeVisible();
      expect(errors).toEqual([]);
    } finally {
      await browser.close();
    }
  });
});
