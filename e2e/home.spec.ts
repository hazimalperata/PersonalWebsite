import { expect, test, type Page } from "@playwright/test";

const earthPoster = (page: Page) => page.locator('[style*="view-transition-name: earth"] img[src*="posters%2Fearth"]');

test("english home renders sections", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Hazim Alper Ata");
  for (const id of ["work", "about", "gallery", "contact"]) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
});

test("turkish home and switch", async ({ page }) => {
  await page.goto("/tr");
  await expect(page.locator("html")).toHaveAttribute("lang", "tr");
  await page.getByRole("button", { name: "English" }).click();
  await expect(page).toHaveURL("/");
});

test("theme toggle persists", async ({ page }) => {
  await page.goto("/");
  const before = await page.locator("html").getAttribute("data-theme");
  await page.getByRole("button", { name: /theme/i }).click();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", before!);
  const after = await page.locator("html").getAttribute("data-theme");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", after!);
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("shows poster, no canvas", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(earthPoster(page)).toBeVisible();
  });
});

test("home works when the textures cannot load", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("**/textures/**", (route) => route.abort());
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Hazim Alper Ata");
  await expect(page.locator("#work")).toBeVisible();
  await expect(page.locator("#contact")).toBeVisible();
  // The scene preflights its textures before mounting; a blocked file sends it straight to the poster
  // (mobile waits a settle delay first), so nothing may reach window as an uncaught error.
  await expect(earthPoster(page)).toBeVisible({ timeout: 15_000 });
  await page.waitForLoadState("networkidle");
  expect(errors).toEqual([]);
});

test("unknown route is 404", async ({ page }) => {
  const res = await page.goto("/xyz");
  expect(res?.status()).toBe(404);
});

test("earth fades out by the about section and returns at the top", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "wheel scrolling through Lenis is desktop only");
  await page.goto("/");
  await page.locator("canvas").first().waitFor({ state: "attached" });
  const opacity = () =>
    page.evaluate(() => {
      const el = document.querySelector<HTMLElement>('[style*="view-transition-name: earth"]');
      return el ? el.style.opacity : "missing";
    });
  await page.mouse.move(700, 450);
  await expect
    .poll(
      async () => {
        await page.mouse.wheel(0, 700);
        return page.evaluate(() => document.querySelector("#about")!.getBoundingClientRect().top < window.innerHeight);
      },
      { timeout: 30_000, intervals: [100] },
    )
    .toBe(true);
  await expect.poll(opacity, { timeout: 15_000 }).toBe("0");
  await expect
    .poll(
      async () => {
        await page.mouse.wheel(0, -900);
        return page.evaluate(() => window.scrollY < 50);
      },
      { timeout: 30_000, intervals: [100] },
    )
    .toBe(true);
  await expect.poll(async () => ["", "1"].includes(await opacity()), { timeout: 15_000 }).toBe(true);
});
