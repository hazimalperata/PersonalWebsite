# Direction 4 — Living Signal (route /lab/4, folder src/lab/d4)

**Idea:** his real work, made visible. Every particle on the page is one real commit he made. As you scroll, the
field reshapes into the story: a cloud, a timeline, the proof numbers, each project's cluster. It says "This
isn't fake. Here is everything I've done", literally.

**References:**
- https://lusion.co (particle language, morphing)
- The GitHub contribution graph as the honest data model

## Step 0 — real data (do this first)
Write a Node script `src/lab/d4/scripts/collect-signal.mjs`, run it once, and commit its JSON output
`src/lab/d4/signal.json`.

**What the script reads:**
- `git log --all --format=%ad --date=short` from these local repos (skip any that does not exist):
  - `<projects>/birlikte-mobile` → "1likte Mobile"
  - `<projects>/birlikte-sellerweb` → "1likte Seller Panel"
  - `<projects>/birlikte-adminweb` → "1likte Admin Panel"
  - `<projects>/1likte-LandingPage` → "1likte Landing"
  - `<projects>/dremly-app` → "Dremly"
  - `<android-projects>/Framy` → "Posme"
  - Rommer: look for `rommer-mobile-app` and `rommer-platform` in `<home>/WebstormProjects` → "Rommer"
  - `<projects>/personal-website` → "This site"
- Author filter, with exactly this pattern (his identities): `--author="Hazim\|hazimalperata\|Alper Ata"`. Check
  the shortlog of one repo first to confirm the names match.

**Output shape:** `{ generatedAt, projects: [{ name, days: [{ d: "2024-03-05", n: 7 }] }] }`. Dates and counts
only.
- No commit messages, no hashes, no other people's data, no paths.
- Total commits will be a few thousand.

**After running it:**
- Print the per-project totals in your report.
- If the total is above ~12 000, sample down for rendering, and say so on the page ("1 point = 1 commit" must stay
  true: if you sample, say "1 point = N commits").

## Look
- Palette:
  - background `#05060A`
  - text `#E8EAF0`, secondary `#8B90A0`
  - project colours (harmonious, not rainbow-neon): 1likte family in blues/cyans (`#5CC8FF`, `#3E8BFF`,
    `#7FB2FF`, `#A8D8FF`), Dremly violet `#9B8CFF`, Posme warm `#FFB86B`, Rommer mint `#6EE7B7`, This site
    off-white `#E8EAF0`
- Type: headlines **Sora** (600), data and labels **IBM Plex Mono** (400/500).
- A thin legend (project → colour) appears when the timeline state is active.

## The particle system (the centrepiece)
- One R3F `<Canvas>` fixed behind the whole page, `THREE.Points` with a custom ShaderMaterial. Each vertex is one
  commit. Attributes:
  - `aColor` (project colour);
  - `aSeed` (random);
  - one position attribute per **state**, precomputed on the CPU once.
- The vertex shader mixes between two states with `uMix`, plus a small curl/simplex noise drift whose amplitude
  depends on the state. Point size scales with DPR and depth, soft round sprites (discard outside the circle,
  smooth alpha).
- **States, driven by scroll** (ScrollTrigger scrub sets which pair to mix and `uMix`; damp it for smoothness):
  1. **Nebula (hero):** points in a slow flow-field cloud around the headline; the cursor repels nearby points
     (pass the mouse in world space as a uniform; falloff in the shader).
  2. **Timeline:** points arrange into a true contribution chart. x = date across the full history; y = project
     lane, with each day's commits stacked as a small column. Lane labels and year ticks fade in as HTML overlays
     aligned to the chart. This is the honesty moment: caption "Every point is a commit · <total> commits ·
     <first year>–<last year>".
  3. **Numbers:** the points fly into the shapes of the proof numbers. Sample points from text drawn on an
     offscreen canvas (`fillText` of "2", "1600+", "880+", "6+" in Sora at large size, read pixels, pick
     positions), one number at a time as you scroll the proof section, with its label in HTML.
  4. **Per project (selected work):** for each of the 5 items, that project's own points gather into a dense
     cluster next to its card, and all other points dim to 15%. The cluster shape can be a simple phone outline
     sampled from a rounded-rect path for mobile apps, and a browser outline for the seller panel.
  5. **Contact:** all points converge into a calm ring around the email / CTA and slowly orbit.
- Keep it buttery:
  - all motion in the shader;
  - JS only updates a few uniforms per frame;
  - one draw call;
  - DPR ≤ 1.5;
  - pause when the tab is hidden.
  - On coarse pointers / small screens: use every 3rd point (and say "1 point = 3 commits" there), DPR 1, no
    cursor repel.

## Page sections (HTML over the canvas)
- **Hero:** big headline (the message, short and sharp), name, role, a live counter that counts up to the real
  total commits, and a scroll cue.
- **Proof:** the number states, with the label text beside each.
- **Work:** cards on the left or right of each cluster. Real screenshots in clean frames, for Dremly/Posme in a
  phone frame. Rommer gets a text card with its stack and the honest note that its screens are not public yet
  ("Client project · screens not public yet"). Store links, case-study links.
- **More work:** a compact list.
- **Capabilities:** a quiet grid.
- **Experience:** the 4 roles on a mini timeline that shares the chart's x-axis feel.
- **Contact:** the ring state, email, CV, socials.
- Text panels get a subtle dark backdrop (`rgba(5,6,10,0.6)` + slight blur) where they overlap points, so
  contrast stays AA.

## Reduced motion
No canvas animation. Render the timeline state once as a static image: draw the points into a 2D canvas or SVG
once. All sections are normal.

## Mobile
- Everything above with the lighter point budget.
- The timeline becomes taller (lanes stacked) to stay readable.
