import { expect, test } from "@playwright/test";

for (const slug of ["dremly", "posme", "adventures-of-the-knight"]) {
  test(`/work/${slug} renders without page errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const res = await page.goto(`/work/${slug}`);
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });
}

test("a project with a lane has the header timeline strip, one without has none", async ({ page }) => {
  await page.goto("/work/posme");
  await expect(page.locator("[data-signal-header]")).toHaveCount(1);
  await page.goto("/work/adventures-of-the-knight");
  await expect(page.locator("[data-signal-header]")).toHaveCount(0);
});

test("on a phone the project timeline strip sits above the text and in the first viewport", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "small-screen layout");
  await page.goto("/work/posme");
  const strip = await page.locator("[data-signal-header]").boundingBox();
  const h1 = await page.getByRole("heading", { level: 1 }).boundingBox();
  const vh = page.viewportSize()!.height;
  expect(strip).not.toBeNull();
  expect(strip!.y).toBeLessThan(h1!.y);
  expect(strip!.y + strip!.height).toBeLessThan(vh);
});

test("on desktop the strip sits beside the text", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "wide layout");
  await page.goto("/work/posme");
  const strip = await page.locator("[data-signal-header]").boundingBox();
  const h1 = await page.getByRole("heading", { level: 1 }).boundingBox();
  expect(strip!.x).toBeGreaterThan(h1!.x + h1!.width - 1);
});

test("turkish url without turkish text shows the english note", async ({ page }) => {
  // content/projects/react-window-modals has only an .en.mdx
  const res = await page.goto("/tr/work/react-window-modals");
  expect(res?.status()).toBe(200);
  await expect(page.locator("html")).toHaveAttribute("lang", "tr");
  await expect(page.getByText("Bu sayfa yalnızca İngilizce.")).toBeVisible();
});

test("a project with Turkish text has no fallback note", async ({ page }) => {
  await page.goto("/tr/work/dremly");
  await expect(page.getByText("Bu sayfa yalnızca İngilizce.")).toHaveCount(0);
});
