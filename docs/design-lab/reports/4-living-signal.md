# Direction 4 - Living Signal (/lab/4) - report

Status: DONE_WITH_CONCERNS. Branch lab-4, commit 7122e3a (single commit).

## Data (src/lab/d4/scripts/collect-signal.mjs -> src/lab/d4/signal.json, dates and counts only)
Author filter used verbatim. Totals: 1likte Mobile 906, Seller Panel 1700, Admin Panel 752, Landing 392, Dremly 600, Posme 217,
Rommer 567 (rommer-mobile-app 334 + rommer-platform 233), This site 131. TOTAL 5265 (below 12000, so no sampling: 1 point = 1 commit;
on coarse pointers or narrow screens every 3rd commit, labelled "1 point = 3 commits"). Range 2022-11-25 to 2026-10-16.

## Built
- Hero (headline, message, role, live count-up to 5,265, scroll cue), timeline (true contribution chart, lane labels = legend, year ticks, caption),
  proof (4 numbers as particle text + HTML label), 5 work cards with per-project clusters, more list, capabilities, experience (bars on a shared year axis), contact ring.
- Rommer card note is exactly "Client project · screens not public yet" (per coordinator correction), plus a labelled "Illustration" system diagram.
- Order: hero, timeline, proof, work, more, capabilities, experience, contact. Added a calm low-alpha state behind capabilities/experience.

## Signature motion
- One R3F ortho Canvas, one THREE.Points, one draw call (src/lab/d4/SignalField.tsx, shaders.ts, states.ts). Positions are viewport px, so HTML overlays align exactly.
- 13 states precomputed on CPU; shader mixes aFrom/aTo (attribute refs swapped when the pair changes), per-point staggered smootherstep, arc path, simplex flow drift (Ashima, MIT),
  cursor repel in hero, dim to 15% for non-focused projects, contact ring orbit.
- Scroll: one ScrollTrigger measures dwell anchors per section ([data-signal]); target is damped in the single gsap ticker, which also drives Lenis and renders (frameloop never).
- Number text sampled from offscreen canvas in Sora; phone/browser outlines from rounded-rect perimeter sampling.
- Reduced motion: no canvas, no Lenis; static 2D timeline (Timeline.tsx), all sections in final state (.static class). Server HTML contains all text.

## Libraries / sources
gsap, @gsap/react, lenis, @react-three/fiber, three (all installed). Simplex noise: Ashima Arts webgl-noise, MIT, https://github.com/ashima/webgl-noise (credited in shaders.ts).
Fonts: Sora, IBM Plex Mono via next/font/google. Docs checked: not needed beyond existing APIs.

## Verify
yarn typecheck EXIT=0, yarn lint EXIT=0 (1 pre-existing warning outside my folders), yarn build EXIT=0 (read from logs in <worktree>/scratch\d4\).
Playwright (swiftshader): console/page errors 0 for desktop, mobile, reduced; mobile horizontal overflow 0px. Port 3304 freed.

## Shots (<worktree>/shots\d4\)
d01 hero, d01b hero with cursor repel, d02 timeline chart, d03-d06 particle numbers 2 / 1600+ / 880+ / 6+, d07-d11 per-project clusters (Dremly, Posme, Rommer, 1likte Mobile, Seller),
d12 more, d13 capabilities, d14 experience, d15 contact ring, d16 mid-morph; m01-m06 mobile 390x844; r01 reduced-motion full page.

## Weaknesses
- Not measured for fps on real hardware (swiftshader only). Clusters for small projects (Posme 217, Dremly 600) are sparse dots; Rommer, seller shapes lightly checked.
- Mobile vertical placement of cluster vs card is tuned for 390x844 only; mobile contact/seller shots only glanced at.
- Reveal items are hidden until ScrollTrigger fires (only after motion===true); jumping by anchor skips nothing but not stress tested.
- Hero text sits over sparse points without a panel (contrast fine in shots).
- Reduced-motion lazy images need scrolling to load (normal behaviour).

## Next
Tune cluster density/shape per project (add pose skeleton for Rommer), mobile point budget by device, add GPU frame-time check, nonblocking WebGL failure fallback to the static chart.

## Update: "How I use AI" section and Rommer naming (commit 68c1941)
- Data re-collected: total now 5,275 (new commits); lane renamed "Movement analysis (Rommer)" in collect-signal.mjs, data.ts, signal.json and the timeline legend (gutter widened). The app is never called "Rommer"; the card uses `title` ("Movement analysis for Rommer"). Rommer International appears only as client text from facts.
- Section order now: capabilities -> AI intro (title, intro, 3 inProducts) -> workflow runway -> system runway -> experience -> contact. `ai.proof` is not referenced.
- Workflow (4 steps): new particle state 12, 4 rounded nodes joined by connectors; scroll drives a fill front (uPipeX in shader, damped in the gsap ticker) that lights points and the matching step cards (--on0..3).
- System (5 parts, the highlight): particle state 13, a pentagon of 5 nodes with connecting edges; the active part (scroll position) is a hot spot (uHot) that glides node to node, and the text list highlights the same part (data-active). Mobile shows the active part's line only.
- Files: Content.tsx (AiIntro, AiWorkflow, AiSystem), states.ts (pipelineState, systemState), shaders.ts, SignalField.tsx, d4.css.
- Reduced motion: no canvas, both runways collapse to normal flow with all text visible.
- Re-verify: typecheck EXIT=0, lint EXIT=0, build EXIT=0; Playwright desktop, mobile and reduced: 0 console/page errors, 0px mobile overflow.
- New shots in <worktree>/shots\d4\: d17-ai-intro, d18-workflow-a/b/c, d19-system-a/b/c, m07-workflow, m08-system-a, m09-system-b (others re-shot; state numbering shifted so contact is now state 15).
- Weakness: system and workflow runways add about 6.7 screens of scroll; step text on mobile workflow is dense; fps still unmeasured on real hardware.
