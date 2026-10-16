import { expect, type Page } from "@playwright/test";

/**
 * Waits for the hero load choreography (and any other finite animation) to finish, so a scan or a screenshot
 * never samples mid-reveal colours. Looping animations (the scroll cue) are ignored.
 */
export async function waitForHeroSettled(page: Page) {
  await page.waitForFunction(
    () =>
      document
        .getAnimations()
        .filter((a) => a.playState === "running" && a.effect?.getTiming().iterations !== Infinity).length === 0,
  );
}

/**
 * On the home page the still timeline is hidden (opacity 0) except while the timeline section is mid-screen, and
 * Playwright's `toBeVisible()` ignores opacity. Scrolls the section into the middle and proves it is really shown:
 * the document flag is set and the static layer is really painted (computed opacity at its own resting value, 0.5,
 * not the 0 the home page forces on it elsewhere).
 */
export async function expectStaticTimelineShownOnHome(page: Page) {
  await page.evaluate(() => document.getElementById("timeline")?.scrollIntoView({ block: "center" }));
  await expect(page.locator("html")).toHaveAttribute("data-home-timeline", "");
  await expect
    .poll(() =>
      page.evaluate(() => {
        const el = document.querySelector("[data-signal-static]");
        return el ? Number(getComputedStyle(el).opacity) : -1;
      }),
    )
    .toBeGreaterThanOrEqual(0.5);
  // and the same layer is hidden again away from the timeline, so the check above can tell the two states apart
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator("html")).not.toHaveAttribute("data-home-timeline", "");
  await expect.poll(() => page.evaluate(() => getComputedStyle(document.querySelector("[data-signal-static]")!).opacity)).toBe("0");
}
