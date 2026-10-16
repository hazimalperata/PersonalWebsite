# Performance checks

Measured on 2026-10-16 against a local production build of the Living Signal site (`yarn build && yarn start -p 3409`),
Lighthouse CLI, headless Chrome, no WebGL flags (so the lab browser sees whatever software rendering Chrome gives it).
The Accept-Language header is pinned to English: without it a Turkish machine is redirected from `/` to `/tr` and
the run measures the wrong page.

```
H='{"Accept-Language":"en-US,en;q=0.9"}'
npx lighthouse http://localhost:3409/ --preset=desktop --extra-headers="$H" --output=json --output-path=docs/perf/lh-home-desktop.json --chrome-flags="--headless=new" --quiet
npx lighthouse http://localhost:3409/ --form-factor=mobile --extra-headers="$H" --output=json --output-path=docs/perf/lh-home-mobile.json --chrome-flags="--headless=new" --quiet
# same for /work/dremly (lh-work-*) and /gallery (lh-gallery-*)
node scripts/lh-summary.mjs                 # scores for every report present
node scripts/lh-detail.mjs home-mobile      # what dominates one run
```

On Windows the CLI can exit 1 with `EPERM ...\Temp\lighthouse.*` while the JSON is complete. Read the JSON.

The JSON and HTML outputs are local (git-ignored: `docs/perf/lh-*.json`, `docs/perf/*.html`).

## Results

Accessibility must be >= 0.95 (required); performance is reported, not gated. One run per cell.

| Page | Form factor | Performance | Accessibility | LCP (simulated) | LCP (observed) | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Desktop | 1.00 | 1.00 | 690 ms | 120 ms | 18 ms | 0 |
| `/` | Mobile | 0.90 | 1.00 | 3295 ms | 112 ms | 163 ms | 0 |
| `/work/dremly` | Desktop | 1.00 | 1.00 | 804 ms | 179 ms | 53 ms | 0 |
| `/work/dremly` | Mobile | 0.72 | 1.00 | 3345 ms | 157 ms | 842 ms | 0 |
| `/gallery` | Desktop | 0.99 | 1.00 | 1024 ms | 295 ms | 43 ms | 0 |
| `/gallery` | Mobile | 0.59 | 1.00 | 5197 ms | 245 ms | 958 ms | 0 |

Best practices 0.96 and SEO 1.00 on every page.

### Reading the mobile numbers

- Mobile scores swing between runs (an earlier pass gave 0.82 / 0.77 for the case page and the gallery, 0.72 / 0.59
  in this one). The lab throttles the CPU 4x, and the one expensive thing on the page is script work: the particle
  engine (three and the R3F renderer, loaded after first paint) and, on the gallery, the photo grid.
- The score loss is total blocking time and the simulated LCP. The browser's own LCP is 110 - 295 ms on every page:
  the LCP element is server-rendered text or a lazy image already in the HTML, not the canvas.
- Not changed on purpose: removing or disabling the engine to chase the last points. The engine mounts after idle
  so the headline stays the LCP element.

### Local-only noise

- `/_vercel/insights/script.js` returns 404 locally (Vercel Analytics only exists on Vercel). It can cost
  best-practices points and the tests ignore it. Do not remove `<Analytics />`.

## Functional gate

`yarn e2e` (needs a fresh `yarn build`; it serves the build on port 3210) runs on a desktop and a Pixel 7 project:
home EN/TR, case pages, routes and 404s, the particle engine's fallbacks (reduced motion, WebGL blocked) and axe
(serious + critical = 0) on `/`, `/tr`, `/work/dremly`, `/gallery` and `/xyz`, both with the canvas live and with the
static timeline.
