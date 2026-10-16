# Performance and visual checks

Measured on 2026-10-16 against a local production build (`yarn build && yarn start -p 3210`), Lighthouse CLI,
headless Chrome without a GPU (no WebGL flags, the commands from the task brief).

```
npx lighthouse http://localhost:3210 --preset=desktop --output=json --output-path=docs/perf/lh-desktop.json --chrome-flags="--headless=new" --quiet
npx lighthouse http://localhost:3210 --form-factor=mobile --output=json --output-path=docs/perf/lh-mobile.json --chrome-flags="--headless=new" --quiet
node scripts/lh-summary.mjs     # scores
node scripts/lh-detail.mjs mobile   # what dominates a run
```

On Windows the CLI can exit 1 with `EPERM ...\Temp\lighthouse.*` while the JSON is complete. Read the JSON.

## Results

The Lighthouse JSON files and the screenshots are local outputs (git-ignored: `docs/perf/lh-*.json`,
`docs/perf/shots/`). Regenerate them with the commands above, `node scripts/lh-summary.mjs` and
`node scripts/shots.mjs` (server on port 3210).

Final numbers (two runs each, after the last code change):

| | Performance | Accessibility | Best practices | SEO | LCP (simulated) | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Desktop | 0.95 - 0.96 | 1.00 | 0.96 | 0.92 | 812 - 922 ms | 146 - 169 ms | 0 |
| Mobile | 0.83 | 1.00 | 0.96 | 0.92 | 4662 - 4663 ms | 63 - 70 ms | 0 |

Targets: mobile >= 0.90, desktop >= 0.85, accessibility >= 0.95. Desktop (0.95 - 0.96) and accessibility (1.00)
pass. **Mobile performance, 0.83, is below the 0.90 target by 0.07.** Mobile performance 0.83 (target 0.90) accepted by the owner on 2026-10-16; observed LCP ~180 ms.

### Scene mount timing

The scene setup (shader compile, texture upload) is the only heavy script work. It is timed per tier in
`EarthCanvas.tsx`:

- Desktop (tier `high`): mounts at first idle, no extra wait. On desktop the corner preloader is driven by the
  scene's ready signal as designed. Desktop TBT is 146 - 169 ms (0 ms when the delay also applied to desktop, with
  a 0.99 score; the owner chose to keep desktop immediate).
- Before mounting, both tiers preflight every scene texture (`new Image()` + `decode()`, URL list from
  `sceneTextureUrls` in `src/lib/capabilities.ts`). A missing file sends the page to the poster instead of raising
  an uncaught rejection from inside the 3D library. The scene's own requests for the same URLs are answered from
  the browser cache (second request per URL, 0 bytes over the wire).
- Mobile (tier `low`): waits `SETTLE_MS` (2.5 s) first, then idle. Before this delay mobile scored 0.66 (TBT
  688 ms); with it, TBT is 84 - 100 ms.
- On mobile the preloader keeps its own 1.5 s cap, so the corner indicator disappears before the earth arrives
  (about 3 s after load). The earth's existing 400 ms fade-in softens that arrival.

### Why mobile misses, and what was tried

- The remaining loss is one metric: the simulated LCP. The LCP element is the hero subtitle (plain server-rendered
  text). The browser's own measurement is **171 - 185 ms** (`observedLargestContentfulPaint` in the JSON); only
  Lighthouse's throttling simulation puts it at 4.6 s, because it charges the 4x CPU slowdown for hydration scripts
  that start before the first paint. Real LCP is not the problem.
- Not changed: textures are already served as the 2k WebP set, the hero text is server-rendered (no `priority`
  image applies, the poster is not on the LCP path), and fonts are preloaded by `next/font`.
- Not done on purpose: removing or disabling the scene, or shrinking hydration further, to chase the last points.
- With software WebGL flags (`--use-angle=swiftshader`) the scene runs inside the lab and scores drop sharply,
  because software rendering is far slower than any real device. That is not a representative run, and it was not
  repeated after the final change.

### Local-only noise

- `/_vercel/insights/script.js` returns 404 locally (Vercel Analytics only exists on Vercel). It can cost
  best-practices points (0.96 here) and it is ignored by the tests. Do not remove `<Analytics />`.

## Visual tour (`docs/perf/shots/`, local)

`node scripts/shots.mjs` writes `{en,tr}-{dark,light}-{desktop,mobile}.jpg`, full page, reduced motion on (so the
poster stands in for the scene; full-page capture of a fixed WebGL canvas is not reliable). JPEG instead of PNG
for size.

Checked: horizontal overflow at 390 and 412 px on home, `/tr`, a project page and 404 (none), TR labels, axe
contrast, project prose width (about 835 px on desktop, 343 px on mobile: fine).

### Fixed

- Hero text unreadable in light theme with the poster (reduced motion, or devices without WebGL): dark ink on
  the dark ocean crop. `Poster.tsx` now adds a page-background scrim over the top 60 - 95% so the text sits on
  paper, like the live scene.
- `SplitText` put an `aria-label` on a plain `<p>` (axe `aria-prohibited-attr`, serious). `SplitHeading` now passes
  `aria: "none"`; the text itself stays in the DOM.

### Noted for the owner (taste, not changed)

- **Mobile header (390 px):** the nav row scrolls horizontally with a fade, as specified. The last item ("Contact"
  / TR label) is cut mid-word at the right edge until scrolled. Nothing is broken, but the first impression is a
  clipped label; a menu button below 480 px would be cleaner.
- **Light theme, mobile, live scene:** the atmosphere rim is a thin saturated blue line along the top of the earth
  right under the "Say hi" button. It reads as a deliberate glow, not a band; softening it is a taste call (it is
  the scene's light-theme atmosphere parameters).
- **404 page:** server-rendered (`src/app/global-not-found.tsx`) with the right `lang`, the localized heading and the theme script, status 404. It has no header or footer; `min-h-dvh` fills the screen.
- **Project page prose** is `max-w` 70ch: comfortable.
