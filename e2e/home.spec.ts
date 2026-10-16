import { expect, test } from "@playwright/test";

const SECTIONS = ["work", "about", "ai", "contact"];

for (const [path, lang] of [
  ["/", "en"],
  ["/tr", "tr"],
] as const) {
  test(`home ${path}: sections and a single h1`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    for (const id of SECTIONS) await expect(page.locator(`#${id}`)).toHaveCount(1);
  });

  test(`home ${path}: gallery link reaches /gallery`, async ({ page, request }) => {
    await page.goto(path);
    const link = page.locator("a#gallery");
    await expect(link).toHaveCount(1);
    const href = await link.getAttribute("href");
    expect(href).toMatch(/\/gallery$/);
    expect(href?.startsWith(lang === "tr" ? "/tr/" : "/")).toBe(true);
    const res = await request.get(href!);
    expect(res.status()).toBe(200);
  });
}

test("turkish home has Turkish text and leaks no message keys", async ({ page }) => {
  await page.goto("/tr");
  const text = await page.locator("body").innerText();
  expect(text).toMatch(/[ğş]/);
  // a missing message renders as its key path, e.g. "home.hero.title"
  const keyPath = /(?:^|[>\s"'])(home|common|nav|project|a11y|footer|gallery|signal|notFound|meta)\.[a-z][A-Za-z]*(?:\.[A-Za-z]+)*(?=[<\s"'])/;
  expect(text).not.toMatch(keyPath);
  const html = (await page.content()).replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "");
  expect(html.match(new RegExp(`>[^<]*${keyPath.source}`))).toBeNull();
});

test("locale switch goes from /tr to the unprefixed home", async ({ page }) => {
  await page.goto("/tr");
  await page.getByRole("button", { name: "English" }).click();
  await expect(page).toHaveURL(/localhost:\d+\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("AI workflow is a pinned runway: scroll picks the active step", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "scroll-driven emphasis is checked on the desktop project");
  await page.goto("/");
  const steps = page.locator("#ai-workflow li");
  await expect(steps).toHaveCount(4);
  // no disclosure controls any more, and every line is in the DOM and readable
  await expect(page.locator("#ai-workflow button, #ai-workflow [aria-expanded]")).toHaveCount(0);
  for (let i = 0; i < 4; i++) await expect(steps.nth(i).locator("p")).toBeVisible();

  const runway = await page.evaluate(() => {
    const r = document.querySelector("#ai-workflow ol")!.parentElement!.parentElement!;
    const box = r.getBoundingClientRect();
    return { top: box.top + window.scrollY, height: box.height, vh: window.innerHeight };
  });
  expect(runway.height).toBeGreaterThan(runway.vh * 1.5);
  const scrollTo = (p: number) =>
    page.evaluate((y) => window.scrollTo(0, y), Math.round(runway.top + (runway.height - runway.vh) * p));
  const opacity = (i: number) => steps.nth(i).evaluate((el) => Number(getComputedStyle(el).opacity));

  await scrollTo(0.05);
  await expect(steps.nth(0)).toHaveAttribute("data-active", "true");
  await expect.poll(() => opacity(0)).toBeGreaterThan(0.95);
  await expect.poll(() => opacity(3)).toBeLessThan(0.8);

  await scrollTo(0.55);
  await expect(steps.nth(2)).toHaveAttribute("data-active", "true");
  await expect(steps.nth(0)).toHaveAttribute("data-active", "false");
  await expect.poll(() => opacity(2)).toBeGreaterThan(0.95);
  await expect.poll(() => opacity(0)).toBeLessThan(0.8);

  await scrollTo(0.97);
  await expect(steps.nth(3)).toHaveAttribute("data-active", "true");
  await expect.poll(() => opacity(3)).toBeGreaterThan(0.95);
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("AI workflow is a plain list: all four lines visible, nothing pinned, no tall runway", async ({ page }) => {
    await page.goto("/");
    const steps = page.locator("#ai-workflow li");
    await expect(steps).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      await expect(steps.nth(i).locator("p")).toBeVisible();
      await expect.poll(() => steps.nth(i).evaluate((el) => Number(getComputedStyle(el).opacity))).toBe(1);
      await expect(steps.nth(i)).not.toHaveAttribute("data-active", /.*/);
    }
    const layout = await page.evaluate(() => {
      const sticky = document.querySelector("#ai-workflow ol")!.parentElement!;
      const runway = sticky.parentElement!;
      return {
        position: getComputedStyle(sticky).position,
        runway: runway.getBoundingClientRect().height,
        vh: window.innerHeight,
      };
    });
    expect(layout.position).not.toBe("sticky");
    expect(layout.runway).toBeLessThan(layout.vh * 1.6);
  });
});

test("mobile menu: Escape closes it and returns focus to the toggle", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "the menu button only exists below the md breakpoint");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Menu" });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#mobile-menu")).toBeVisible();
  // move focus into the menu so the test proves focus is brought back, not merely never left
  await page.locator("#mobile-menu a").first().focus();
  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-menu")).toBeHidden();
  await expect(page.getByRole("button", { name: "Menu" })).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("button", { name: "Menu" })).toBeFocused();
});
