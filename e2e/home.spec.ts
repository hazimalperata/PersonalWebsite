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

test("AI steps toggle aria-expanded with Enter and Space", async ({ page }) => {
  await page.goto("/");
  const buttons = page.locator("#ai-workflow button[aria-expanded]");
  await expect(buttons).toHaveCount(4);
  for (let i = 0; i < 4; i++) {
    const b = buttons.nth(i);
    await b.focus();
    const start = (await b.getAttribute("aria-expanded")) === "true";
    await page.keyboard.press("Enter");
    await expect(b).toHaveAttribute("aria-expanded", String(!start));
    await page.keyboard.press("Space");
    await expect(b).toHaveAttribute("aria-expanded", String(start));
  }
});

test("opening one AI step closes the previous one", async ({ page }) => {
  await page.goto("/");
  const buttons = page.locator("#ai-workflow button[aria-expanded]");
  await expect(buttons.nth(0)).toHaveAttribute("aria-expanded", "true");
  await buttons.nth(1).focus();
  await page.keyboard.press("Enter");
  await expect(buttons.nth(1)).toHaveAttribute("aria-expanded", "true");
  await expect(buttons.nth(0)).toHaveAttribute("aria-expanded", "false");
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
