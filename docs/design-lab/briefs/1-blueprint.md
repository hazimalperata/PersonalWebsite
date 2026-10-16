# Direction 1 — Blueprint (route /lab/1, folder src/lab/d1)

**Idea:** engineering precision on paper. The page behaves like a technical drawing that compiles itself as you
scroll. It says "I calculate every pixel".

**References** (open them for feel, do not copy):
- https://piergorelli.com (native CSS scroll-driven header, rule drawing, counters, ⌘K, blueprint cursor)
- https://nahiyan.codes
- https://ghostty.org

## Look
- Light theme only.
- Palette:
  - paper `#F4F1EA`, a slightly darker sheet `#ECE7DC`
  - ink `#16181D`, secondary ink `#5A5E66`
  - grid lines `rgba(22,24,29,0.07)` (minor, 8 px) and `rgba(22,24,29,0.12)` (major, 64 px)
  - blueprint blue `#1F4FFF` (lines, annotations, links)
  - one active-state orange `#FF5B1F`, only for the current/active thing (current section in the nav, the hovered
    annotation, the ⌘K selection)
- Type:
  - headlines **Inter Tight** (600–700, tight tracking −0.03em);
  - data, labels and annotations **JetBrains Mono** (400/500, uppercase allowed for small labels, letter-spacing
    0.04em).
- Layout: a drawing sheet.
  - A 1 px ink border frame inset 16 px from the viewport on desktop.
  - A **title block** fixed in the bottom-right corner, like an engineering drawing's: rows NAME / ROLE /
    LOCATION / SHEET n OF 6. SHEET updates with the current section.
  - Section numbers as drawing references ("A-01").

## Signature motions (do these beautifully)
1. **The page compiles (hero, on load, ~1.4 s total).**
   - A mono build log types 5 real lines in the top-left, e.g. `> load labFacts … ok`,
     `> resolve 5 projects … ok`, `> 2 apps live on 2 stores`, `> build: ok`.
   - Meanwhile the grid fades in, the headline (the message, rephrased short) is drawn as type that settles, and
     **dimension lines** with arrowheads extend around the headline, labelled with its *real measured width* in
     px (measure with `getBoundingClientRect`; update on resize).
   - A coordinate readout `x 0812 · y 0344` follows the cursor on fine pointers. The crosshair cursor is a thin
     blue cross; keep the native cursor over text and inputs.
2. **Native CSS scroll-driven animations as the backbone** (this is part of the "modern technology" message):
   - the header compacts on scroll with `animation-timeline: scroll()`;
   - a hairline progress rule under it fills;
   - section rules draw with `animation-timeline: view()`;
   - the proof counters count up with view timelines via a registered `@property --n { syntax: '<integer>' }`
     and `counter-reset`. Linear, no overshoot.
   - Guard with `@supports (animation-timeline: view())`. Where unsupported, show final states, or use the
     equivalent GSAP ScrollTrigger as a fallback.
   - Mention in a tiny footnote-style mono label that these run on the browser's scroll timeline. This is a real,
     verifiable detail.
3. **Each project is a drawing sheet that goes PLAN → BUILD → SHIP**, pinned with GSAP ScrollTrigger and
   scrubbed, about 150 vh per project on desktop:
   - **PLAN:** a phone (or browser, for the seller panel) outline is drawn line by line with DrawSVGPlugin, and
     construction lines appear.
   - **BUILD:** the real screenshot fills the frame through a clip-path wipe. **Annotations** with leader lines
     point at the device: stack items, platforms, role. Only true facts from `labFacts`.
   - **SHIP:** a stamp-like label `SHIPPED · App Store · Google Play` with the real store links. For items
     without store links, show `IN PRODUCTION` / `IN DEVELOPMENT` according to the facts. Rommer is "in
     development", but present it neutrally as a client project; do not invent a status.
   - **Rommer:** no screenshots. Draw its **system diagram**: phone camera → on-device pose analysis → API →
     staff web panel. Nodes are labelled with its stack, paths are drawn with DrawSVG, and a dot travels along the
     path.
   - A stage indicator `PLAN · BUILD · SHIP` ticks orange as the scrub passes each stage.
4. **⌘K command palette** (Ctrl+K on Windows). Built by hand, accessible dialog, focus trapped, Esc closes.
   Commands:
   - jump to a section;
   - open a project case study;
   - copy email (with a small toast);
   - download CV;
   - open GitHub.
   A small `⌘K` hint sits in the header.

## Background
- The blueprint grid as CSS background on the sheet.
- Behind the hero only: a slow **WebGL contour-line field**. Use a full-screen fragment shader drawing
  topographic isolines from fbm noise, in blueprint blue at ~12% opacity, very slowly evolving, with the cursor
  gently raising a "hill".
- Build it with R3F (`<Canvas>` + a plane with a ShaderMaterial) or raw WebGL in a canvas.
- Pause when the hero is off-screen. Static frame under reduced motion. A lower resolution render target on
  mobile is fine.

## Other sections
- **Proof:** four big mono numbers in drafting style, each with a dimension-line underline that draws, and the
  CSS counters.
- **More work:** a drawing-index table (`DWG NO · TITLE · NOTE`), rows highlight on hover with the orange
  active state.
- **Capabilities:** a **bill of materials** table: `ITEM · COMPONENT · QTY/NOTE` grouped by the 4 groups.
- **Experience:** a **revision history** table: `REV · YEARS · COMPANY · ROLE · DESCRIPTION`, newest first.
- **Contact:** the title block grows into a large "APPROVED FOR CONSTRUCTION" block with email (copy button), CV
  and socials. A final stamp animation when it enters (scale from 0.92, slight rotation, no bounce).

## Mobile
- Frame inset 8 px.
- The title block collapses into a slim bottom bar.
- Pinned sheets become a vertical sequence: each stage animates on enter, no pin.
- The contour shader at half resolution or a static SVG contour.
- The ⌘K palette also opens from a header button.
