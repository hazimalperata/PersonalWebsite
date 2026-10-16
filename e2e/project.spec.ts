import { expect, test } from "@playwright/test";

test("project page renders", async ({ page }) => {
  const res = await page.goto("/work/1likte-seller-panel");
  expect(res?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("turkish url without turkish text shows the english note", async ({ page }) => {
  const res = await page.goto("/tr/work/react-window-modals");
  expect(res?.status()).toBe(200);
  await expect(page.getByText("Bu sayfa yalnızca İngilizce.")).toBeVisible();
});
