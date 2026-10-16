# hazimalperata.com: Living Signal full-site design

Date: 2026-10-16. Owner: Hazım. This replaces the "Yörüngeden" (earth) design that is live now
(`2026-10-16-site-redesign-design.md`). The base is prototype 4, "Living Signal":
- code on branch `lab`, tag `design-lab-2026-10-16`, folder `src/lab/d4/`;
- design brief `docs/design-lab/briefs/4-living-signal.md`;
- build notes `docs/design-lab/reports/4-living-signal.md`;
- screenshots `docs/design-lab/shots/4/`.

## 1. Intent

- **The visitor.** Visitors are both companies that might hire Hazım and clients who might give him work.
- **The message.** In the first seconds they must come away with his own message: *"Whatever I take on, I build
  it to the highest standard: serious, real, and done the way modern technology says it should be done."*
- **The bar.** Impressive is welcome. Professional is the bar.
- **Why Living Signal.** It proves the message literally. The page is made of his real work: every point is one
  commit he made, counted from git. It shows the shape of five years of shipping without claiming anything.

## 2. Goals, non-goals, anti-goals

**Goals**
- The home page is the Living Signal prototype, finished: same sections, same particle engine, the polish items
  in §9 done.
- Every page of the site speaks the same language:
  - home;
  - project case pages;
  - gallery page;
  - 404.
- EN (default, unprefixed) and TR (`/tr`). Every visible string exists in both.
- Data stays real:
  - points, commit totals and the proof numbers all come from one generated file;
  - the owner refreshes it with one command.

**Non-goals**
- No light theme. Dark only; the theme toggle and the light tokens are removed.
- No CMS, no blog, no contact form (the contact section is email, CV and socials).
- The other four prototypes do not ship to the live site. They stay on the `lab` tag and in `docs/design-lab/` for
  reuse.

**Anti-goals** (it fails if any of these happen, even if it "works")
- Any invented content:
  - a number that is not derived from data;
  - a feature an app does not have;
  - a fake screenshot.
  Rommer's app has no public name and no public screens: it is "Movement analysis for Rommer", shown with text
  and a labelled illustration only.
- Internal or technical detail in user-visible text: hosts, internal tools, versions, error codes, repo paths.
  Exception: technology names in a stack line or in the AI section, where they are part of the message.
- Jank. Motion that stutters or fights the scroll contradicts the message.
- The site's readable content depending on WebGL or JS. Server HTML must carry every word.

## 3. Owner decisions (2026-10-16)

| Topic | Decision |
| --- | --- |
| Direction | Living Signal (prototype 4) |
| Theme | Dark only |
| Gallery | Its own page `/gallery` (and `/tr/gallery`), linked from the nav, in the Living Signal language. Not on the home page. |
| Case pages | In the Living Signal language. The project's own commit points sit behind the page, and the header shows that project's own timeline. |
| Data refresh | Manual, one command: `yarn signal` |
| Roles | 1likte: CTO (2021–present). Tersane Dijital: Mobile & Web Engineer (2026-07–present). Both are current. |
| Rommer | Client is Rommer International (a hospital). The app is never called "Rommer". Title: "Movement analysis for Rommer". |
| AI section | "How I use AI": AI in his products, his workflow, and the Claude Code system he built as the highlight. No proof-number line. |
| Education | No GPA anywhere. |
| Projects to include | Selected: Dremly, Posme, Movement analysis for Rommer, 1likte Mobile, 1likte Seller Panel. More work: every other project in `content/projects/`, derived rather than listed by hand. Today that is Engelsiz Rota (in testing), the wardrobe & outfit app (just started, in active development), 1likte Admin Panel, 1likte Landing (current and old), DUHA Architects, The Pale Blue Dot, react-window-modals and Adventures of the Knight. |

## 4. Site map

| Route | What |
| --- | --- |
| `/`, `/tr` | Home: the Living Signal page |
| `/work/<slug>`, `/tr/work/<slug>` | Case pages from `content/projects/*.mdx`. Keep the existing TR→EN fallback with the "English only" note. |
| `/gallery`, `/tr/gallery` | Photo gallery (data in `src/data/gallery.ts`, existing lightbox behaviour) |
| 404 | `global-not-found` in the new language, server-rendered, localized, with a way home |

**Redirects:**
- The legacy redirect `/gallery → /#gallery` (and its `/tr` twin) must be **removed**, because `/gallery` becomes
  a real page.
- Browsers may have cached that 308. Give the home page a small element with `id="gallery"` (for example a
  "Gallery" link in the more-work or contact area) that leads to `/gallery`, so a cached redirect still lands
  somewhere useful.
- Keep `/about → /#about`, `/work → /#work` and `/earth → /work/the-pale-blue-dot`; make sure the anchors exist on
  the new home.

Keep the rest:
- metadata, canonical on `https://www.hazimalperata.com`, hreflang, sitemap, OG image route, security headers;
- the `/en` → `/` redirect;
- `noindex` stays only on things that are not the site.

## 5. Home page

**Section order** (as in the prototype, with the AI section shortened, see §9):
1. hero;
2. timeline;
3. proof;
4. selected work (5);
5. more work;
6. capabilities;
7. how I use AI;
8. experience;
9. contact.

**Header:**
- name;
- section links;
- Gallery link;
- language switch (EN/TR, same behaviour as the live site);
- Contact button.

**Footer:** "© <year> Hazim Alper Ata".

**Content sources** (single source of truth each; no duplicated copy):
- **Projects:** `content/projects/*.mdx` frontmatter.
  - Add the frontmatter fields the cards need and that are missing today:
    - `kind` (Product / Client / Startup / Personal);
    - `platforms`;
    - `storeLinks` (list of label + href);
    - `portraitImages` (boolean);
    - `signal` (the data lane id, see §7).
  - Selected work = the featured projects in `order`. More work = the rest.
  - **Movement analysis for Rommer** needs a case page (`rommer-movement-analysis`, EN + TR). Text only, no
    images, drafted from the `labFacts` entry and the Tersane experience line, marked as a draft for the owner.
- **Profile, experience, capabilities, education:** `src/data/profile.ts` (EN/TR).
- **UI strings and the AI section text:** `messages/en.json` and `messages/tr.json`. TR is a draft for the owner
  to correct.
- **Proof numbers:** derived, not typed in.
  - Apps live on both stores = count of projects with both an App Store and a Google Play link.
  - Commits on the seller panel since its first year, rounded down to the hundred with "+".
  - Same for 1likte mobile.
  - Years shipping = from the earliest experience start.
  - The labels carry the derived year ("since 2022").

## 6. Living Signal engine

Port `src/lab/d4/` into the site as a real module (e.g. `src/components/signal/`) and keep its architecture:
- one R3F canvas fixed behind the page;
- one `THREE.Points`, one draw call;
- states precomputed on the CPU;
- the shader mixes two states, driven by one ScrollTrigger on section anchors and damped in one GSAP ticker that
  also drives Lenis and renders.

**Per-page behaviour:**
- **Home:** the prototype's states: nebula → timeline → numbers → per-project clusters → AI pipeline → AI system
  pentagon → contact ring.
- **Case page:**
  - Only that project's points are bright; the rest dim. On load they form that project's own timeline in the
    header (x = its date range).
  - Scrolling into the body they relax into a slow, low-alpha drift so the text reads cleanly.
  - Projects with no data lane (e.g. Adventures of the Knight) show the calm drift of all points.
- **Gallery:** calm drift; the photos are the focus.
- **404:** the points scatter loosely, a "lost signal" state, then settle around the way-home link.
- **Between routes** the canvas persists (it lives in the layout), and the field morphs from the old page's state
  to the new one instead of reloading.

**Required fallbacks:**
- **Reduced motion:** no canvas, no Lenis; a static 2D render of the timeline; every section in its final state.
- **WebGL unavailable or context lost:** the same static timeline, no errors thrown to the page.
- **Coarse pointers / small screens:**
  - every 3rd point, labelled "1 point = 3 commits" where the ratio is stated;
  - DPR 1;
  - no cursor repel.

## 7. Data pipeline

- `scripts/collect-signal.mjs`, run by `yarn signal`.
  - It reads a **git-ignored** local config `signal.config.local.json`: per lane, the lane id, the display name in
    EN and TR, the project slug it belongs to, and the list of local repo paths.
  - It also reads the author pattern (his git identities).
  - It writes `src/data/signal.json`: `{ generatedAt, lanes: [{ id, days: [{ d, n }] }] }`.
- **Only** dates and counts go into `signal.json`:
  - no paths, no repo names, no messages, no other authors;
  - lane display names live in messages or `profile.ts`, not in the JSON.
- Commit `signal.config.example.json` with the shape and placeholder paths. No real local paths in the repo.
- The prototype's script currently hard-codes local paths. That file stays on the `lab` branch only.
- Lanes today:
  - 1likte Seller Panel
  - 1likte Mobile
  - 1likte Admin Panel
  - 1likte Landing
  - Dremly
  - Posme
  - Movement analysis (Rommer)
  - This site
  Engelsiz Rota and the wardrobe app can get lanes later. The config is the place to add them.
- **Refresh flow:** `yarn signal` → review the diff → commit → push. Document it in README.

## 8. Motion, accessibility, performance

- **Motion:**
  - one motion gate (reduced motion) read in one place;
  - counters never overshoot;
  - nothing scales from 0;
  - exits simpler than entrances;
  - transform/opacity only on the DOM side.
- **Accessibility:**
  - one h1 per page;
  - skip link;
  - visible focus;
  - keyboard reachable;
  - AA contrast (text panels over points get the dark backdrop the prototype uses);
  - canvases `aria-hidden`;
  - lightbox focus management kept from the live site.
- **Performance:**
  - The headline is server-rendered text and must stay the LCP element; the canvas mounts after first paint.
  - Pause rendering when the tab is hidden.
  - Lighthouse is measured and reported on desktop and mobile:
    - accessibility ≥ 0.95 is a gate;
    - performance is reported, not gated. The owner accepted 0.83 mobile on the current site; aim for no worse.
  - Frame rate is checked on the owner's own machine before launch (§10).

## 9. Polish items carried from the prototype

1. Dremly and Posme clusters are sparse; make each project's cluster read as a shape at its real point count
   (scale the shape to the count, or add a faint outline).
2. Movement analysis for Rommer: give its cluster a pose-skeleton shape (labelled illustration).
3. The AI section's two scroll runways add about 6.7 screens. Shorten the whole AI section to about 3 screens on
   desktop without losing the pipeline and the pentagon.
4. Mobile workflow text is dense: give the steps more space, or show one step at a time.
5. Cluster and card placement is tuned for 390×844 only. Check 360, 412 and 430 widths and tablet (768, 1024).
6. Dremly store images contain device mockups ("phone inside a phone" when framed). Do not put them in a
   phone frame. Show them as they are, unframed, until the owner provides raw app screens.

## 10. Quality gate and delivery

- **Gate:** `yarn gate` (typecheck, lint, unit tests, build) and `yarn e2e`, both EXIT=0.
- **Unit tests:**
  - proof-number derivations;
  - `signal.json` shape;
  - the collect script's parsing;
  - per-page state selection.
- **e2e:**
  - home sections in EN and TR;
  - case pages (selected, fallback-TR, no-lane project);
  - gallery page and lightbox;
  - 404 with JS off;
  - reduced motion shows the static timeline and no canvas;
  - WebGL blocked shows the static timeline with zero page errors;
  - axe on home, a case page, gallery and 404.
- Work on branch `signal` (from `master`). The live site stays as it is until launch.
- Before launch:
  1. Push `signal` for a Vercel preview.
  2. The owner checks it on his own machine and phone, including feel and frame rate.
  3. On his OK, squash-merge into `master` (that publishes).
- **Remove what the new site no longer uses:**
  - the earth scene, its textures and posters, the earth tests;
  - the theme toggle, provider, script and light tokens;
  - the old home components;
  - the tests that only covered removed code.
  The lab code is not merged into `master`.

## 11. Settled after the builder check (controller's calls, owner may override)

1. **Lanes are data-driven, defined in code.** `src/data/lanes.ts` holds, per lane:
   - id;
   - display name EN/TR;
   - colour (from the prototype palette);
   - order (chronological by first commit);
   - optional project slug.
   The local config only maps lane id → repo paths. Cluster states are generated for however many selected
   (featured) projects exist, not a fixed five.
   - A unit test asserts that every featured project has a `signal` lane with data.
   - A featured project without one shows its card with no cluster, and the field stays calm for it.
2. **Lanes without a case page** (e.g. "This site") get a timeline label with no link. **1likte Landing** links to
   `1likte-landing-page`.
3. **Case-page timeline** draws all of that project's points, whatever the count. Below 50 points it enlarges the
   point size and adds a faint date axis. There is no minimum and no hidden lanes. No lane means calm drift (§6).
4. **Cluster shapes and the Rommer pose skeleton** are the builder's design. A hand-authored skeleton (about 15
   joints, points sampled along the limbs, labelled "Illustration") is fine. So is scaling a shape to the point
   count, or a faint outline.
5. **Gallery fallback anchor:** a plain visible link with `id="gallery"` on the home page that points to
   `/gallery`. No auto-forward script.
6. **Locale switch:** the canvas lives in the `[locale]` layout. A remount on EN↔TR is acceptable (rare action);
   morphing is required only between routes of the same locale.
7. **Text in points:**
   - Only the proof-number strings are sampled into points, formatted for the locale (EN "1,600+", TR "1.600+").
   - Labels stay in the DOM.
   - Sampling uses the same font family loaded by `next/font`, after `document.fonts.ready`.
8. **Tests and build:**
   - The collect script's parsing is a pure function tested on sample `git log` output text. No git fixture repos.
   - `src/data/signal.json` is committed.
   - The build and tests never read `signal.config.local.json`.

## 12. Left to the builder

- Exact module structure.
- State tuning and timings.
- How the case-page timeline header is laid out.
- The 404 copy (both languages).
- How to show the "Gallery" fallback anchor on the home page.
- Component reuse from the live site (lightbox, MDX components, locale switch).
- Exact TR wording (drafts; the owner corrects).
