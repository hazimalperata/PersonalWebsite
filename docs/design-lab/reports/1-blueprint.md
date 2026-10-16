# Direction 1 - Blueprint (/lab/1) report
Status: DONE_WITH_CONCERNS. Branch lab-1, worktree <worktree>/lab1. Files: src/app/lab/1/page.tsx, src/lab/d1/*.

## Sections
Hero (build log, headline with measured dimension lines, WebGL contour field), Proof (CSS counters), Selected work (5 pinned PLAN/BUILD/SHIP sheets + drawing-index table), Capabilities (BOM table, usage derived from work stacks), How I use AI (new: intro, products rows, 4-stage pipeline with scroll-drawn wire, system schematic with 5 labelled components on a drawn bus), Experience (revision table), Contact (APPROVED FOR CONSTRUCTION block + stamp). Title block says SHEET n OF 7.
Rommer: titled "Movement analysis for Rommer" (from facts) everywhere; diagram is labelled ILLUSTRATION.

## Signature motions
- Compile hero: Hero.tsx (GSAP timeline, SplitText, steps() typing), dims from getBoundingClientRect of headline text.
- CSS scroll-driven (header, progress, rules, counters via @property --n, pipeline wires, schematic bus): d1.css, guarded by @supports + data-motion.
- Pinned sheets: ProjectSheet.tsx (ScrollTrigger pin 150%, scrub, DrawSVG, clip-path wipe, leader lines, stage indicator); mobile = play-once timeline, no pin. SystemDiagram.tsx (dot travels path).
- Command palette: CommandPalette.tsx (Ctrl/Cmd+K, focus trap, Esc, combobox).
- ContourField.tsx: raw WebGL2 fbm isolines, pauses off-screen/hidden, DPR cap, static frame when reduced.
No third-party copied code.

## Verify
typecheck EXIT=0, lint EXIT=0 (1 pre-existing warning elsewhere), build EXIT=0 (read from logs, not piped). Playwright: console/page errors none; mobile horizontal overflow 0px.
Shots <worktree>/shots\d1\: desktop-00-hero, desktop-00..14 (proof, sheets, more, capabilities, AI x3, experience, contact), desktop-palette, mobile-00..06, reduced-full.

## Weaknesses
- Orange only used as fills/underlines (text contrast fails AA); title block overlaps content at bottom right on desktop.
- Pinned sheets start empty (PLAN stage) while scrolling in.
- Diagram text is small (~11px) on desktop; Skia is listed under "on-device analysis" without a stated role.
- Rommer "IN DEVELOPMENT" status comes from the brief, not facts.
- Firefox/Safari lack scroll-timeline: counters/rules show final state, progress bar uses GSAP fallback. Not tested on real GPU or other browsers.
## Next
Pre-pin PLAN draw, tune pinned-sheet heights on short viewports, add 1440+ ultrawide layout check.
