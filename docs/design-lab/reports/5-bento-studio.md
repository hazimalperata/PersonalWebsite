# Direction 5 — Bento Studio (/lab/5) report

Status: DONE_WITH_CONCERNS. Branch lab-5, worktree <worktree>/lab5. Files: src/app/lab/5/page.tsx, src/lab/d5/*.

## Sections
- Hero: CSS gradient mesh (5 radial blobs, 24-32 s loops, transform only, paused off-screen via ScrollTrigger toggle) + SVG feTurbulence grain; words rise through masks (CSS keyframes, so SSR text is present); status pill with live Bursa time and a travelling beam; See the work + magnetic Get in touch. Hero.tsx
- Proof/bento: 12-col grid, 7 tiles (numbers with NumberTicker, both stores, 2-row velocity marquee, Bursa clock, Currently, GitHub, real react-window-modals snippet). Tiles assemble with scrubbed fromTo (y/x/scale/blur/opacity) per tile. MagicCard spotlight + border beam on hover. Bento.tsx, Marquee.tsx, ui.tsx
- Selected work (dark band): 5 sticky stacking cards; previous scales to 0.94 and dims (scrub, computed from per-card geometry in ScrollTrigger onUpdate). iPhone frame with cross-fading screenshots, browser frame for wide images, animated-dash architecture diagram for the Rommer item (captioned "Illustration", uses new title "Movement analysis for Rommer"). Cases.tsx
- More work, Capabilities, Experience (scrubbed progress line), Contact (gradient card with beam, copy-email -> check + toast, CV, socials), footer. Sections.tsx
- NEW "How I use AI" (between capabilities and experience): product AI tiles; 4 workflow tiles joined by a scroll-scrubbed beam that lights each step (horizontal on desktop, vertical on mobile); the system part as a dark command-palette card with 5 rows, sliding highlight (layoutId), auto-cycling while in view, click/arrow keys; all 5 texts stay in the DOM. Ai.tsx
- Nav pill with sliding active background (motion layoutId), includes AI.

## Libraries / sources
Concept credits (own implementations): Magic UI Border Beam, Magic Card, Number Ticker, Marquee (https://magicui.design, MIT). No code copied. Fonts Inter + Geist Mono via next/font/google.

## Verify
- yarn typecheck EXIT=0; yarn lint EXIT=0.
- `yarn build` (Turbopack) EXIT=1: fails in the live site's `src/lib/fonts.ts` Geist font (`next/font/google queries have exactly one entry`, trace ./src/app/[locale]/layout.tsx), not in /lab. `npx next build --webpack` EXIT=0, /lab/5 prerendered. Likely environmental; other directions may hit it too.
- Playwright (1440x900, 390x844 touch, reduced-motion full page): console/page errors none; horizontal overflow 0 on desktop and mobile.

## Shots (<worktree>/shots\d5\)
d-01-hero, d-02..04 bento assembling, d-05/06/07/08 stacking cases (07 = Rommer architecture), d-13 stack transition, d-09 more, d-10 caps, d-10a/b/c AI section, d-11 experience, d-12 contact; m-01..m-07 mobile (m-06a/b AI); r-full reduced-motion full page.

## Scope updates
1. AI section added as above, uses labFacts.ai (title, intro, inProducts, workflow, system; proof not referenced).
2. Rommer naming: title from facts ("Movement analysis for Rommer") used everywhere; no heading/label/diagram says "Rommer" alone as the app.

## Weaknesses
- Reduced-motion full page screenshot taken before the AI/rommer fixes was not re-viewed after the final change.
- Inactive palette rows are line-clamped (full text in DOM but visually cut).
- Border beam uses animated @property (repaints; fine for few elements). Turbopack build issue above.
## Next
Lenis smooth scroll; Playwright perf trace; spec the case-study device screens as scroll-inside-screen.
