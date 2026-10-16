// Full-page screenshots of the home page: node scripts/shots.mjs [baseUrl] (needs a running `yarn start -p 3210`).
import { mkdirSync } from "node:fs";
import { chromium, devices } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:3210";
const out = new URL("../docs/perf/shots/", import.meta.url);
mkdirSync(out, { recursive: true });

const viewports = {
  desktop: { viewport: { width: 1440, height: 900 } },
  mobile: devices["Pixel 7"],
};

const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
for (const [vp, opts] of Object.entries(viewports)) {
  for (const locale of ["en", "tr"]) {
    for (const theme of ["dark", "light"]) {
      const ctx = await browser.newContext({ ...opts, reducedMotion: "reduce", colorScheme: theme });
      await ctx.addInitScript((t) => {
        try {
          localStorage.setItem("theme", t);
        } catch {}
      }, theme);
      const page = await ctx.newPage();
      await page.goto(base + (locale === "tr" ? "/tr" : "/"));
      await page.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);
      await page.waitForTimeout(800);
      const file = new URL(`${locale}-${theme}-${vp}.jpg`, out);
      await page.screenshot({ path: file.pathname.replace(/^\/([A-Za-z]:)/, "$1"), fullPage: true, type: "jpeg", quality: 80 });
      console.log("saved", `${locale}-${theme}-${vp}.jpg`);
      await ctx.close();
    }
  }
}
await browser.close();
