# Direction 2 — Kinetic Editorial (/lab/2) report

Branch `lab-2`, worktree <worktree>/lab2, commit 10b93eb. Code: `src/app/lab/2/page.tsx`, `src/lab/d2/*`. No public assets, no new packages.

## Built per section
- Hero: "HAZIM / ALPER ATA" fitted to the width (FitText.tsx), role + one-line message below.
- Marquee bands (stack items) after hero and before capabilities.
- Statement: pinned (fine pointers) scroll-lit paragraph; key words red.
- Proof: 4 pinned colour panels (black, red, off-white, acid) with clip-path wipes and counters.
- Work: huge title rows, cursor-following preview, Rommer red illustration card, Flip detail overlay.
- More work list, capabilities (4 columns), experience table, contact (black, fitted "LET'S TALK").

## Signature motions
- Fit type: `FitText.tsx` measures at 1000px, scales to container width; re-fits on resize, fonts.ready, and after SplitText (`d2-refit` event, because splitting drops kerning).
- Hero entrance: SplitText lines,chars + mask, stagger 0.06, power4.out (`Hero.tsx`). wdth 100→75 / wght 800→300 scrubbed over the hero.
- Velocity skew: `scrollVelocity.ts` (one ScrollTrigger reads velocity, one ticker smooths it); `quickTo skewY` on every `[data-skew]`, clamp ±6 (±3 coarse). Marquee speed/direction uses the same value.
- Scroll-lit statement: `Statement.tsx`; pin created synchronously (so later triggers measure after its spacer), words scrub 15%→100%. Touch: no pin, scrub on enter.
- Panels: `ProofPanels.tsx`, one pinned scrub timeline, inset clip-paths (bottom/right/bottom), counters power2.out ending exactly on the value. First panel counts on arrival.
- Work: `Work.tsx` (CursorPreview with quickTo + velocity rotation, scale 0.9→1; touch shows images inline), `WorkOverlay.tsx` (Flip.fit title from row to top and back, Esc, focus trap, page `inert`, focus returns to the row).
- Contact: per-char quickTo push away from the pointer (fine pointers), underline draws in.

## Libraries / copied code
GSAP 3.15 (ScrollTrigger, SplitText, Flip), @gsap/react, next/font (Bricolage Grotesque with `axes: ["wdth"]` worked, plus Inter). Nothing copied from third parties. Lenis not used: native scroll keeps pins and velocity simple.

## Verify
- typecheck EXIT=0, lint EXIT=0 (0 warnings in d2), build EXIT=0 (logs in <worktree>/scratch\d2).
- Playwright script <worktree>/scratch\d2\shoot.mjs: desktop, overlay, mobile and reduced runs, 0 console and page errors; mobile horizontal overflow 0 px.
- Overlay: focus goes to Close, Esc closes, focus returns to the row.

## Screenshots (<worktree>/shots\d2\)
- d-00-hero, d-01-hero-scroll, d-skew: hero, axis change, velocity skew.
- d-02..d-04 message: dim, mid, lit.
- d-05..d-09 proof panels at several scroll points.
- d-10..d-12 work list, phone cursor preview, Rommer red card.
- d-13 more, d-14 capabilities, d-15 experience, d-16 contact.
- o-0..o-3: overlay opening, Dremly, Rommer illustration, Seller panel.
- m-*: mobile 390x844. r-0/r-5000/r-9000: reduced motion viewports. r-full.png shows a repeated page, but it is a Playwright full-page stitching artifact (DOM has 1 h1, heights verified).

## Decisions / notes
- Nav is a solid paper bar (a blend-mode nav looked bad over the acid panel).
- Rules: base CSS in `@layer components` so Tailwind utilities win (an unlayered `.d2 a` colour had hidden the case-study button text).
- Rommer has no case-study page, so its overlay shows an "Illustration" diagram and no case-study button.
- Pre-entrance hiding of the hero is CSS-only under `prefers-reduced-motion: no-preference`, with a noscript override.

## Known weaknesses
- Hero axis animation changes layout each frame (font-variation) for one viewport of scroll; fine on desktop, untested on a slow device.
- Hero names do not stay edge-to-edge while wdth shrinks (by design).
- Last mobile hero change (gap instead of min-height) was verified only for overflow, not re-viewed.
- Flip title on the overlay assumes single-line titles (true now).
- No Lenis smoothing; mobile proof-panel pin only lightly tested.

## Next
Refit hero while axes animate, add a keyboard-visible hover preview on focus for touch-less keyboards, review mobile hero visually, test on real mid-range hardware.

## Scope updates (AI section, Rommer naming)
- New section "How I use AI" (`src/lab/d2/AiSection.tsx`, between capabilities and experience; bars renumbered: AI 06, Experience 07, Contact 08).
  - Title + intro; `inProducts` as display-type rows with rules drawing in.
  - Workflow: 4-step pipeline, a red line scrubbed down the scroll, each step's number turns red and text rises as it arrives.
  - System (strongest moment): black panel wipes up via scrubbed clip-path; heading "The system I built around it", intro, then the 5 parts as huge display names that light red in turn with their lines revealing. Real text from `labFacts.ai.system`; `ai.proof` not used.
- Rommer: the item's `title` ("Movement analysis for Rommer") is used in rows, overlay, and cursor/inline card; the app is never called "Rommer" (card says "Movement analysis, on device", diagram labelled Illustration). Long titles use a smaller size and wrap; overlay title width matched to the row for Flip.
- Verify after changes: typecheck 0, lint 0, build 0, 0 console/page errors on desktop, overlay, mobile (0 px overflow) and reduced runs.
- Shots: <worktree>/shots\d2\ai-d-*.png (desktop, section start to end), ai-m-*.png (mobile), o-2-rommer.png.
- Known: system part names could be larger; the long Rommer title in the row Flip transition not viewed mid-flight.
