import { expect, test } from "@playwright/test";

// Desktop only: smooth scroll (Lenis) runs for a fine pointer with motion on, and it ignores `overflow: hidden`.
test("the lightbox locks page scroll on desktop and releases it on close", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "smooth scroll is desktop only");
  await page.goto("/gallery");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const scrollY = () => page.evaluate(() => window.scrollY);
  const wheel = async () => {
    await page.mouse.move(640, 400);
    await page.mouse.wheel(0, 900);
  };

  // smooth scroll is live before the lightbox opens (proves the lock below is not just "nothing scrolls here")
  await wheel();
  await expect.poll(scrollY).toBeGreaterThan(0);
  // let the smooth scroll come to rest
  let last = -1;
  await expect
    .poll(async () => {
      const now = await scrollY();
      const rest = now === last;
      last = now;
      await page.waitForTimeout(250);
      return rest;
    })
    .toBe(true);

  // open a thumbnail that is on screen, so the click does not scroll
  const buttons = page.locator("ul button");
  const visible = await buttons.evaluateAll((els) =>
    els.findIndex((el) => {
      const r = el.getBoundingClientRect();
      return r.top > 80 && r.bottom < window.innerHeight - 20;
    }),
  );
  expect(visible).toBeGreaterThanOrEqual(0);
  await buttons.nth(visible).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  const opened = await scrollY();
  await wheel();
  await page.waitForTimeout(800); // a negative assertion: give smooth scroll time to (wrongly) move
  expect(await scrollY()).toBe(opened);

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await wheel();
  await expect.poll(scrollY).toBeGreaterThan(opened);
});
