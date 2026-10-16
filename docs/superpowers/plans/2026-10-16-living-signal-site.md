# Living Signal site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the live "earth" site with the Living Signal design across home, case pages, gallery and 404,
in EN and TR, driven by real commit data.

**Architecture:**
- Data layer:
  - `signal.json` is generated locally by `yarn signal`;
  - lanes are defined in code;
  - project frontmatter is extended;
  - proof numbers are derived from these.
- One persistent R3F particle canvas lives in the `[locale]` layout. Each page selects a *scene*, and the engine
  morphs between scenes.
- Pages are server components that render all text; the canvas only enhances.

**Tech Stack:** Next 16.4 App Router, React 19.3, next-intl 4, Tailwind 4, three 0.186 + @react-three/fiber 9,
gsap 3.15 (ScrollTrigger) + @gsap/react, lenis, next-mdx-remote, Vitest, Playwright + @axe-core/playwright.

**Spec:** `docs/superpowers/specs/2026-10-16-living-signal-site-design.md` (read it first). The prototype it
builds on: `git show design-lab-2026-10-16:src/lab/d4/<file>` and `docs/design-lab/briefs/4-living-signal.md`,
`docs/design-lab/reports/4-living-signal.md`, `docs/design-lab/shots/4/`.

## Global Constraints

- Branch `signal` (from `master`). No push to `master`. Every task commits on its own branch; the controller
  merges.
- Dark only. Palette from the prototype:
  - background `#05060A`;
  - text `#E8EAF0`, secondary `#8B90A0`;
  - lane colours from `lanes.ts` (Task 1).
- Fonts: **Sora** (600) for headlines and **IBM Plex Mono** (400/500) for data. Both via `next/font/google` with
  `subsets: ["latin", "latin-ext"]` (Turkish glyphs).
- Every visible string lives in the messages (EN + TR). TR is a draft for the owner. No hard-coded copy in JSX.
- Real content only:
  - no invented numbers, features, screenshots or names;
  - the Rommer app is "Movement analysis for Rommer" (client Rommer International), never "Rommer" alone as a
    product;
  - no "NDA";
  - no GPA.
- No internal or technical details in user-visible text. Exception: stack lines and the AI section.
- Motion:
  - one gate `useMotionEnabled()` (reduced motion);
  - counters never overshoot;
  - nothing scales from 0;
  - DOM animates transform/opacity only;
  - one GSAP ticker drives Lenis, ScrollTrigger and the canvas render.
- Accessibility:
  - one h1 per page;
  - skip link;
  - focus visible;
  - AA contrast;
  - canvases `aria-hidden`;
  - external links `target="_blank" rel="noopener noreferrer"` + the existing `a11y.externalLink` hidden text.
- Next 16: read `node_modules/next/dist/docs/` for any API you are unsure of; `params` are awaited; `src/proxy.ts`
  stays; `global-not-found` stays enabled.
- Windows / Git Bash:
  - multi-line files with the Write tool;
  - read exit codes without pipes (`cmd > log 2>&1; echo EXIT=$?`);
  - free ports with `netstat -ano | grep ":<port> "` + `taskkill //PID <pid> //F //T`;
  - never `pkill -f`.
- Commits: `feat:`/`fix:`/`test:`/`chore:`/`docs:`, trailer `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **WebGL unavailable or context lost:** the page shows the static timeline and all content with zero page
   errors. Test: Task 3 unit test (fallback path) + Task 8 e2e (WebGL blocked via
   `--disable-gpu --disable-webgl` context).
2. **Reduced motion:** no canvas, no Lenis, the static timeline, all text visible. Test: Task 8 e2e
   (`reducedMotion: "reduce"`).
3. **Turkish:**
   - glyphs render in Sora and Plex Mono (`latin-ext`);
   - proof numbers are formatted per locale (EN `1,700+`, TR `1.700+`);
   - `/tr` pages carry no English leftovers except stack names.
   Test: Task 2 unit test (formatting) + Task 8 e2e (TR home text contains "ğ"/"ş" words, and no messages key
   paths such as `home.` leak into HTML).
4. **Cached old redirect** `/gallery → /#gallery`: the home page has a visible link `id="gallery"` to `/gallery`.
   Test: Task 5 unit/e2e (Task 8 asserts `#gallery` exists and its href ends with `/gallery`).
5. **Case page for a project with no lane or a sparse lane** (Knight: no lane; Posme: 217 points): the page
   renders, with no error, and the header timeline shows for Posme. Test: Task 3 unit test (scene selection) +
   Task 8 e2e (`/work/adventures-of-the-knight` and `/work/posme` both 200, zero page errors).

---

## Execution waves

| Wave | Tasks | Notes |
| --- | --- | --- |
| A | T1, T2 | Parallel. T1 signal data and lanes; T2 content model and proof numbers. Interfaces fixed below. |
| B | T3 | Signal engine (needs T1). |
| C | T4 | Layout, chrome and messages split (needs T3). |
| D | T5, T6, T7 | Parallel: home, case pages, gallery + 404 (need T2, T3, T4). |
| E | T8 | Quality gate, cleanup, docs. |

---

### Task 1: Signal data pipeline and lanes

**Files:**
- Create:
  - `scripts/signal-lib.mjs` (pure functions);
  - `scripts/collect-signal.mjs` (CLI);
  - `signal.config.example.json`;
  - `src/data/lanes.ts`;
  - `src/data/signal.json`;
  - `src/lib/signal/data.ts`.
- Test: `scripts/signal-lib.test.mjs`, `src/lib/signal/data.test.ts`.
- Modify:
  - `.gitignore` (add `/signal.config.local.json`);
  - `package.json` (`"signal": "node scripts/collect-signal.mjs"`);
  - `vitest.config.*` if `.mjs` tests need including.

**Interfaces:**
- Produces:
  - `export type LaneId = "seller" | "mobile" | "admin" | "landing" | "dremly" | "posme" | "rommer" | "site"`
  - `export interface Lane { id: LaneId; name: { en: string; tr: string }; color: string; slug?: string }`
  - `export const lanes: Lane[]` (order = chronological by first commit)
  - `export interface SignalDay { d: string; n: number }` (`d` = `YYYY-MM-DD`)
  - `export interface SignalLane { id: LaneId; days: SignalDay[] }`
  - `export interface SignalData { generatedAt: string; lanes: SignalLane[] }`
  - `export const signal: SignalData`
  - `export function laneTotal(id: LaneId): number`
  - `export function laneRange(id: LaneId): { first: string; last: string } | null`
  - `export function laneForSlug(slug: string): LaneId | null`
  - `export const totalCommits: number`
  - `export const signalRange: { first: string; last: string }`
  - `scripts/signal-lib.mjs`: `export function countByDay(gitLogDates: string): Record<string, number>`
    (input: newline-separated `YYYY-MM-DD`; blank lines ignored) and
    `export function toSignal(lanes: Array<{ id: string; counts: Record<string, number> }>, generatedAt: string)`
    returning `SignalData` with days sorted ascending.

**Lanes (exact values):**

| id | EN name | TR name | colour | slug |
| --- | --- | --- | --- | --- |
| seller | 1likte Seller Panel | 1likte Satıcı Paneli | `#3E8BFF` | `1likte-seller-panel` |
| admin | 1likte Admin Panel | 1likte Admin Paneli | `#7FB2FF` | `1likte-admin-panel` |
| landing | 1likte Landing | 1likte Tanıtım Sitesi | `#A8D8FF` | `1likte-landing-page` |
| site | This site | Bu site | `#E8EAF0` | — |
| mobile | 1likte Mobile | 1likte Mobil | `#5CC8FF` | `1likte-mobile-application` |
| posme | Posme | Posme | `#FFB86B` | `posme` |
| dremly | Dremly | Dremly | `#9B8CFF` | `dremly` |
| rommer | Movement analysis (Rommer) | Hareket analizi (Rommer) | `#6EE7B7` | `rommer-movement-analysis` |

- [ ] **Step 1: Write failing tests.**
  - `countByDay("2024-01-02\n2024-01-02\n\n2024-01-05")` equals `{ "2024-01-02": 2, "2024-01-05": 1 }`.
  - `toSignal` sorts days ascending and keeps only `{ d, n }`.
  - In `data.test.ts`:
    - `totalCommits === signal.lanes.reduce(...)`;
    - every `signal.lanes[].id` exists in `lanes`;
    - `laneForSlug("posme") === "posme"`;
    - `laneForSlug("adventures-of-the-knight") === null`;
    - `signal.json` contains no key other than `generatedAt`, `lanes`, `id`, `days`, `d`, `n` (walk the object).
- [ ] **Step 2: Run** `yarn vitest run scripts src/lib/signal`. Expected: FAIL (modules missing).
- [ ] **Step 3: Implement.**
  - `collect-signal.mjs` reads `signal.config.local.json`, shaped
    `{ "author": "<git --author regex>", "lanes": [{ "id": "seller", "repos": ["<absolute path>"] }] }`.
  - Per repo it runs `git -C <repo> log --all --author=<author> --format=%ad --date=short`, skipping missing repos
    with a warning.
  - It merges the counts per lane and writes `src/data/signal.json` with `generatedAt` = today.
  - `signal.config.example.json` uses the same shape with placeholder paths.
  - **Seed `src/data/signal.json`** by converting the prototype's data. Use `git show design-lab-2026-10-16:src/lab/d4/signal.json`
    and map names to ids: "1likte Mobile"→mobile, "1likte Seller Panel"→seller, "1likte Admin Panel"→admin,
    "1likte Landing"→landing, "Dremly"→dremly, "Posme"→posme, "Movement analysis (Rommer)"→rommer,
    "This site"→site. Write the conversion as a one-off scratch script, not in the repo.
- [ ] **Step 4: Run** the tests; expected PASS. Then `yarn typecheck` EXIT=0.
- [ ] **Step 5: Commit** `feat: signal data pipeline and lanes`.

### Task 2: Content model, featured set, proof numbers

**Files:**
- Modify:
  - `src/lib/content.ts` (schema);
  - all `content/projects/*.mdx` frontmatter;
  - `src/data/profile.ts` if needed.
- Create:
  - `content/projects/rommer-movement-analysis.en.mdx`, `.tr.mdx`;
  - `src/lib/proof.ts`.
- Test: `src/lib/content.test.ts` (extend), `src/lib/proof.test.ts`.

**Interfaces:**
- Consumes (from Task 1, import from `@/lib/signal/data`): `laneTotal`, `laneRange`, `laneForSlug`, `LaneId`.
  Until T1 merges, stub those imports in the test with `vi.mock("@/lib/signal/data", ...)`. The controller merges
  T1 before T2.
- Produces (added to `ProjectMeta`):
  - `kind: "product" | "client" | "startup" | "personal"`
  - `platforms: string[]`
  - `storeLinks: Array<{ store: "appStore" | "googlePlay"; href: string }>`
  - `portraitImages: boolean`
  - `signal: LaneId | null`
  - `export interface ProofFact { id: "apps" | "seller" | "mobile" | "years"; value: number; suffix: "+" | ""; sinceYear?: number }`
  - `export function getProofFacts(projects: ProjectMeta[], experienceStarts: string[]): ProofFact[]`
  - `export function formatProof(value: number, locale: "en" | "tr"): string` (EN `1,700`, TR `1.700`)

**Featured (exact):** `order` 1–5: dremly, posme, rommer-movement-analysis, 1likte-mobile-application,
1likte-seller-panel. Every other project gets `featured: false`.

**Fixes from the owner's data review:**
- Every 1likte project gets role `CTO`. TR: `CTO`.
- `storeLinks`:
  - 1likte mobile: App Store `https://apps.apple.com/tr/app/1likte-sosyal-al%C4%B1%C5%9Fveri%C5%9F/id6751815318`,
    Google Play `https://play.google.com/store/apps/details?id=com.birlikte.mobile`;
  - Dremly and Posme: their two existing store URLs (App Store `link` + the Play URL in the body).

**Proof rules (exact):**
- `apps` = count of projects whose `storeLinks` has both stores (today 3);
- `seller` = `floor(laneTotal("seller")/100)*100`, suffix `+`, `sinceYear` = year of `laneRange("seller").first`;
- `mobile` = same for `mobile`;
- `years` = current year − earliest experience start year, suffix `+`.

**Rommer page:** the case page text, a draft for the owner, comes from:
- the `labFacts` Rommer item (`git show design-lab-2026-10-16:src/lab/facts.ts`);
- the Tersane experience line in `profile.ts`.
Title "Movement analysis for Rommer" (TR "Rommer için hareket analizi"), `images: []`, `status: "inProgress"`,
`kind: "client"`, `signal: "rommer"`.

- [ ] **Step 1: Write failing tests.**
  - `getProofFacts` with fixtures (3 projects with both stores, 1 with only App Store; seller total 1700 from
    2022-11-25; mobile 906; experience start `2020-04`, today pinned with `vi.setSystemTime("2026-10-16")`)
    returns:
    - `apps` 3;
    - `seller` 1700 since 2022;
    - `mobile` 900;
    - `years` 6.
  - `formatProof(1700,"tr") === "1.700"`.
  - Content test:
    - every featured project has `signal !== null` and `laneTotal(signal) > 0`;
    - the featured slugs in `order` equal the list above;
    - no MDX contains `GPA` or `NDA`.
- [ ] **Step 2: Run** `yarn vitest run src/lib`. Expected: FAIL.
- [ ] **Step 3: Implement.** Schema parsing in `toMeta`: defaults are `kind: "personal"`, `platforms: []`,
  `storeLinks: []`, `portraitImages: false`, `signal: null`. Validate `signal` against `lanes` ids. Then update the
  frontmatter of every MDX and write the Rommer pair.
- [ ] **Step 4: Run** the tests, `yarn typecheck`, `yarn build`: all EXIT=0.
- [ ] **Step 5: Commit** `feat: content model for Living Signal, derived proof numbers`.

### Task 3: Signal engine

**Files:**
- Create `src/components/signal/`, ported from `design-lab-2026-10-16:src/lab/d4/`:
  - `SignalCanvas.tsx` (client, was `SignalField`);
  - `SignalProvider.tsx` (client, was `SignalShell`: env, Lenis, ticker);
  - `states.ts`, `shaders.ts`;
  - `StaticTimeline.tsx`;
  - `scenes.ts`;
  - `useSignalScene.ts`;
  - `useMotionEnabled.ts` (moved from `src/lab`);
  - `fonts.ts` (Sora + Plex Mono, `latin-ext`).
- Test: `src/components/signal/scenes.test.ts`, `src/components/signal/SignalCanvas.test.tsx` (fallback).

**Interfaces:**
- Consumes: Task 1 `lanes`, `signal`, `laneForSlug`, `LaneId`.
- Produces:
  - `export type SignalScene = { kind: "home" } | { kind: "project"; lane: LaneId | null } | { kind: "gallery" } | { kind: "notFound" }`
  - `export function SignalProvider({ children }: { children: ReactNode })`. It renders the fixed canvas (or
    `StaticTimeline` when motion is off or WebGL fails) behind `children` and owns the GSAP ticker + Lenis.
  - `export function useSignalScene(scene: SignalScene): void`, called by a page-level client component. It sets
    the active scene; the engine morphs from the previous scene's state.
  - `export function SignalSection({ id, state, children }: { id: string; state: HomeState; children: ReactNode })`.
    It marks a home section as an anchor for scroll-driven states (`data-signal`), as in the prototype.
  - `export type HomeState = "nebula" | "timeline" | "numbers" | \`work:${number}\` | "calm" | "pipeline" | "system" | "contact"`
  - `export function buildHomeStates(...)`, `export function buildProjectState(...)`,
    `export function buildGalleryState(...)`, `export function buildNotFoundState(...)` in `states.ts` (pure,
    unit-testable).

**Behaviour (spec §6, §9, §11):**
- Work clusters are generated per featured project (any count).
- A cluster's shape scales so its real point count reads as a shape (polish §9.1).
- The Rommer cluster is a hand-authored pose skeleton (~15 joints, points along the limbs).
- Project scene: only that lane is bright and its points form that lane's timeline across the header box. Below
  50 points, the point size is ×1.6 and a faint date axis appears. With `lane: null` there is calm drift of all
  points.
- notFound: loose scatter that settles around the way-home link box.
- Proof numbers are sampled into points from `formatProof(value, locale)` strings, after `document.fonts.ready`,
  using the Sora family loaded by `next/font`.
- Coarse pointers: every 3rd point, DPR 1, no cursor repel.
- WebGL creation failure or `webglcontextlost` → `StaticTimeline`, no throw.

- [ ] **Step 1: Failing tests.**
  - `buildProjectState` for a 217-point lane returns positions within the header box and `pointScale === 1.6`.
  - With `lane: null` it returns the calm state.
  - `buildHomeStates` with 5 featured projects yields 5 `work:<i>` states.
  - `SignalCanvas` test: mock `WebGLRenderingContext` absence → renders `StaticTimeline` (role `img`, accessible
    name from messages key `signal.staticLabel`) and no error is thrown.
- [ ] **Step 2: Run**, expect FAIL.
- [ ] **Step 3: Port and generalise.**
  - Keep one `THREE.Points`, one draw call, state mixing in the shader, and the single ticker.
  - Remove the prototype's hard-coded lane META and `labFacts` imports; use Task 1 data.
  - The canvas lives in `SignalProvider`, which the `[locale]` layout will mount in Task 4.
- [ ] **Step 4: Run** the tests, `yarn typecheck`, `yarn lint`: EXIT=0. Do a quick local visual check by mounting
  `SignalProvider` on a temporary scratch route that you delete before committing.
- [ ] **Step 5: Commit** `feat: Living Signal engine with scenes and fallbacks`.

### Task 4: Layout, chrome, messages split, removals

**Files:**
- Modify:
  - `src/app/[locale]/layout.tsx`;
  - `src/app/global-not-found.tsx` (dark only, new fonts);
  - `src/app/globals.css` (dark tokens only, from the prototype palette);
  - `src/i18n/request.ts`;
  - `src/components/layout/Header.tsx`, `Footer.tsx`, `SkipLink.tsx`, `LocaleSwitch.tsx`.
- Delete:
  - `ThemeProvider.tsx`, `ThemeScript.tsx`, `ThemeToggle.tsx`;
  - `Preloader*`, `Grain.tsx`, `SmoothScroll.tsx` (Lenis now in `SignalProvider`);
  - `src/components/three/**`;
  - `public/textures/**`, `public/posters/**`;
  - `scripts/textures.mjs` and the `textures` script;
  - the tests of deleted code;
  - `src/lib/theme*`.
- Messages: split into `messages/<locale>/<namespace>.json`:
  - namespaces `meta`, `nav`, `home`, `project`, `gallery`, `notFound`, `footer`, `locale`, `a11y`, `signal`;
  - `request.ts` imports and merges them;
  - existing keys move to their namespace;
  - remove `theme` and `preloader`.
- Test: `src/i18n/messages.test.ts`.

**Interfaces:**
- Consumes: Task 3 `SignalProvider`, `fonts.ts`.
- Produces:
  - the `[locale]` layout renders `<SignalProvider>` around `SkipLink`, `Header`, `<main id="content">`, `Footer`;
  - Header nav items: Work `#work`, About `#about`, AI `#ai`, Contact `#contact`, Gallery `/gallery`, then the
    locale switch;
  - messages per namespace, so Tasks 5–7 each own their own files (`home.json`, `project.json`, `gallery.json` +
    `notFound.json`).

- [ ] **Step 1: Failing test.** `messages.test.ts` asserts:
  - the EN and TR key sets are identical for every namespace;
  - no value is empty;
  - no TR value equals its EN value, except keys listed in an allowlist (brand names, stack names).
- [ ] **Step 2: Run**, expect FAIL.
- [ ] **Step 3: Implement** the split, the layout, the chrome and the removals.
  - The home page can temporarily render only a placeholder h1 until Task 5. Keep the build green.
  - Remove the `/gallery` legacy redirect (and `/tr/gallery`) from `next.config.mjs`.
- [ ] **Step 4: Run** `yarn gate` EXIT=0.
- [ ] **Step 5: Commit** `feat: dark Living Signal layout and chrome, split messages, remove earth scene`.

### Task 5: Home page

**Files:**
- Create `src/components/home/`:
  - `Hero.tsx`, `TimelineSection.tsx`, `Proof.tsx`, `SelectedWork.tsx`, `MoreWork.tsx`, `Capabilities.tsx`,
    `AiSection.tsx`, `Experience.tsx`, `Contact.tsx`, `HomeScene.tsx` (client, calls `useSignalScene({ kind: "home" })`).
- Modify: `src/app/[locale]/page.tsx` (keep its `generateMetadata`: title, description, canonical on www,
  hreflang, Open Graph + Twitter card), `messages/{en,tr}/home.json`, `src/data/profile.ts` (capabilities and AI
  text move here or to messages, one source).
- Test: `src/components/home/*.test.tsx` (selected).

**Interfaces:**
- Consumes:
  - Task 2 `getProjects`, `getProofFacts`, `formatProof`;
  - Task 3 `SignalSection`, `useSignalScene`, `useMotionEnabled`;
  - Task 1 `totalCommits`, `signalRange`, `lanes`.
- Produces: section anchors `#work`, `#about` (on the experience section), `#ai`, `#contact`, and
  `<a id="gallery" href="/gallery">` (localized href) in the more-work area.

**Content:**
- Sections and copy follow the prototype (`design-lab-2026-10-16:src/lab/d4/Content.tsx`), with every string in
  `home.json`.
- AI section texts are the `labFacts.ai` values (EN). Write TR drafts.
- Hero counter = `totalCommits`, with the caption "commits across {lanes} projects, {first}–{last}".

**Polish (spec §9):**
- The whole AI section is about 3 desktop screens (merge the pipeline and system runways into one pinned runway of
  ~250 vh, or two of ~120 vh).
- Mobile workflow shows one step at a time.
- Check 360/390/412/430/768/1024 widths for overflow and card/cluster overlap.
- Dremly images unframed.

- [ ] **Step 1: Failing tests.**
  - Proof renders `formatProof` output: TR `1.700+`.
  - SelectedWork renders 5 cards in order with store links that have hidden new-tab text.
  - The `#gallery` link exists.
  - No GPA/NDA string.
- [ ] **Step 2: Run**, expect FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4:**
  1. `yarn gate` EXIT=0.
  2. `yarn start -p 3401`, then Playwright shots at desktop 1440×900 (8 positions) and mobile 390×844 (5), EN and
     TR.
  3. Look at them and fix.
- [ ] **Step 5: Commit** `feat: Living Signal home page`.

### Task 6: Case pages

**Files:** modify `src/app/[locale]/work/[slug]/page.tsx`, `src/components/work/ProjectHeader.tsx`,
`ProjectNav.tsx`, `src/components/mdx/mdx-components.tsx`; create `src/components/work/ProjectScene.tsx`
(client); `messages/{en,tr}/project.json`. Delete the old `DistortImage`/`useHoverDistort`/`distort.*`,
`SelectedWork.tsx`, `WorkList.tsx` and `WorkRow*` if they are unused after Task 5.

**Interfaces:**
- Consumes:
  - Task 2 `ProjectMeta` (with `signal`, `kind`, `platforms`, `storeLinks`);
  - Task 3 `useSignalScene({ kind: "project", lane })`;
  - Task 1 `laneTotal`, `laneRange`.
- Produces: the header box element with `data-signal-header`, which the project scene reads for its bounds.

**Content:**
- The header shows:
  - title;
  - kind · year · platforms;
  - the lane's commit count and range ("217 commits · Jul–Oct 2026"), or nothing when there is no lane;
  - role, stack, store links.
- The body is the MDX prose on a dark readable panel.
- Keep:
  - the TR fallback note with `lang="en"`;
  - canonical/hreflang rules;
  - prev/next nav;
  - images as they are (Dremly unframed).

- [ ] **Step 1: Failing tests.**
  - The header for posme shows the formatted count.
  - A project with no lane shows no count.
  - The fallback note appears for a project without a TR file.
- [ ] **Step 2: Run**, expect FAIL.
- [ ] **Step 3: Implement.**
- [ ] **Step 4:** `yarn gate` EXIT=0, then shots of 3 pages (dremly, posme, adventures-of-the-knight) on desktop and
  mobile, EN and TR. Look at them and fix.
- [ ] **Step 5: Commit** `feat: Living Signal case pages`.

### Task 7: Gallery page and 404

**Files:**
- Create:
  - `src/app/[locale]/gallery/page.tsx`;
  - `src/components/gallery/GalleryScene.tsx`;
  - `messages/{en,tr}/gallery.json`, `notFound.json`.
- Modify:
  - `src/components/gallery/Gallery.tsx` (restyle; keep `Lightbox` behaviour and tests);
  - `src/app/global-not-found.tsx` (new copy, scene);
  - `src/app/sitemap.ts` (add `/gallery`, `/tr/gallery`).
- Test: extend `Lightbox.test.tsx` only if behaviour changes; `src/app/sitemap.test.ts` (gallery URLs present).

**Interfaces:**
- Consumes: Task 3 `useSignalScene({ kind: "gallery" })` and `{ kind: "notFound" }`; `src/data/gallery.ts`.
- Produces: routes `/gallery`, `/tr/gallery`, and a server-rendered 404 with a localized h1 and a way-home link.

- [ ] **Step 1: Failing tests.**
  - The sitemap includes `https://www.hazimalperata.com/gallery` and `/tr/gallery` with hreflang.
  - The gallery page metadata title exists in both locales.
- [ ] **Step 2: Run**, expect FAIL.
- [ ] **Step 3: Implement.** The 404 must still render with JS off: server HTML carries the h1 and the link, and
  the canvas only enhances.
- [ ] **Step 4:** `yarn gate` EXIT=0. `curl -s localhost:<port>/xyz` shows the localized h1 and returns 404;
  `/gallery` returns 200.
- [ ] **Step 5: Commit** `feat: Living Signal gallery page and 404`.

### Task 8: Quality gate, cleanup, docs

**Files:**
- Rewrite `e2e/home.spec.ts`, `e2e/project.spec.ts`, `e2e/routes.spec.ts`, `e2e/a11y.spec.ts`.
- Create `e2e/signal.spec.ts`.
- Modify `README.md`, `CLAUDE.md`, `docs/perf/README.md`.
- Remove dead code found by `yarn lint` and a search for unused exports.

- [ ] **Step 1: e2e** (desktop + mobile projects):
  - home EN/TR sections and h1;
  - TR text contains Turkish letters and no raw message keys;
  - `#gallery` link → `/gallery` 200;
  - case pages dremly / posme / adventures-of-the-knight 200 with zero page errors;
  - TR fallback note;
  - `/xyz` and `/tr/xyz` 404 with JS disabled (h1, `html[lang]`);
  - `/about` → `/#about`;
  - reduced motion → no `canvas` and the static timeline visible;
  - a WebGL-blocked context (`args: ["--disable-webgl", "--disable-gpu"]`) → static timeline and zero
    `pageerror`;
  - axe serious/critical = 0 on `/`, `/tr`, `/work/dremly`, `/gallery`, `/xyz`.
- [ ] **Step 2:** Lighthouse desktop + mobile on `yarn start`. Record perf, a11y and LCP in `docs/perf/README.md`.
  a11y ≥ 0.95 is required; perf is reported.
- [ ] **Step 3: Docs.**
  - README: stack, commands, the `yarn signal` refresh flow (`signal.config.local.json` from the example → run →
    review diff → commit), adding a project (frontmatter fields, lane), adding a lane.
  - CLAUDE.md: rules updated (dark only, Living Signal, signal data, no `/lab` on master).
- [ ] **Step 4:** `yarn gate` and `yarn e2e` EXIT=0.
- [ ] **Step 5: Commit** `test: Living Signal e2e and a11y gate; docs`.
