import { expect, test } from "@playwright/test";

// Server-rendered 404: no JavaScript, so nothing but the HTML response can supply the content.
test.describe("404 without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  for (const [path, lang, title, home] of [
    ["/xyz", "en", "This page drifted off orbit.", "/"],
    ["/tr/xyz", "tr", "Bu sayfa yörüngeden çıktı.", "/tr"],
  ]) {
    test(`${path} is a localized 404`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(404);
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
      await expect(page.locator(`main a[href="${home}"]`)).toBeVisible();
      await expect(page).toHaveTitle(/ · Hazim Alper Ata$/);
    });
  }
});

test("/en redirects to the unprefixed home", async ({ request }) => {
  const res = await request.get("/en", { maxRedirects: 0 });
  expect([307, 308]).toContain(res.status());
  expect(new URL(res.headers().location, "http://localhost").pathname).toBe("/");
});

test("a Turkish browser still gets English until it picks Türkçe", async ({ request }) => {
  const headers = { "accept-language": "tr-TR,tr;q=0.9", cookie: "NEXT_LOCALE=tr" };
  const res = await request.get("/", { headers, maxRedirects: 0 });
  expect(res.status()).toBe(200);
  expect(await res.text()).toMatch(/<html[^>]*\blang="en"/);
});

test("old URLs keep working", async ({ page }) => {
  await page.goto("/about");
  await expect(page).toHaveURL(/\/#about$/);
  const res = await page.goto("/earth");
  expect(res?.status()).toBe(200);
  await expect(page).toHaveURL(/\/work\/the-pale-blue-dot$/);
});

test("/gallery answers 200 with one h1", async ({ page }) => {
  const res = await page.goto("/gallery");
  expect(res?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
});
