# Direction 5 — Bento Studio (route /lab/5, folder src/lab/d5)

**Idea:** a product-grade showcase with Linear / Raycast / Apple polish, calm but alive everywhere. It says "I ship
products, and every detail is considered".

**References:**
- https://linear.app
- https://raycast.com
- https://www.apple.com/airpods-pro/ (sticky storytelling)
- Magic UI components for vocabulary: Border Beam, Number Ticker, Marquee, iPhone mockup, Safari mockup, Magic
  Card. Copy the free MIT versions and credit them.

## Look
- Light theme with one dark band.
- Palette:
  - background `#F7F8FA`, cards `#FFFFFF` with 1 px border `#E6E8EC` and a soft shadow
    (`0 1px 2px rgba(14,17,22,.04), 0 8px 24px rgba(14,17,22,.06)`)
  - ink `#0E1116`, secondary `#5B6270`
  - accent gradient violet → blue `#6E56CF → #3E8BFF`, used for the beam, focus rings and highlights only
  - the case-study band is dark `#0B0D12` with white text
- Type:
  - **Inter** (variable). Display 600 with tight tracking (−0.035em), 56–96 px.
  - Body 16–18 px.
  - **Geist Mono** for small labels and tabular numbers.
- Radius: 24 px on cards, 999 px on pills.

## Signature motions
1. **Hero with a living gradient mesh.**
   - Background: a slow gradient mesh, 4–5 soft colour blobs (violet, blue, a touch of mint and peach, all at low
     saturation on light), moving on a 20–30 s loop, plus a fine film-grain overlay.
     - Option A: animated CSS radial gradients + an SVG `feTurbulence` grain.
     - Option B: a small fragment shader.
     - Pick the cheaper one that looks better. Paused under reduced motion.
   - A centred headline (the message, short); words rise through masks on load.
   - A status pill: "Open to work · Bursa, UTC+3", with a live local time and a beam travelling around its border.
   - Two buttons: "See the work" and a magnetic "Get in touch".
2. **Bento grid that assembles on scroll.**
   - A 12-column bento, 6–8 tiles of mixed sizes. Each tile flies in from a slight offset with opacity and blur,
     scrubbed and staggered with ScrollTrigger, so the grid "builds" as you scroll into it.
   - Tiles:
     - (a) the 4 proof numbers as Number Tickers (exact final value, no overshoot);
     - (b) "Live on both stores": Dremly + Posme app icons/screens with the store links;
     - (c) a tech-stack Marquee (two rows, opposite directions, velocity-reactive);
     - (d) a live Bursa clock tile;
     - (e) a "Currently" tile: CTO at 1likte, building at Tersane Dijital;
     - (f) a GitHub tile linking out;
     - (g) a small code tile showing a real, short usage snippet of his open-source `react-window-modals` (check
       its case study in `content/projects/react-window-modals.en.mdx` for the real API; do not invent one).
   - The tile under the cursor gets a spotlight (Magic Card style) and the active tile a Border Beam.
3. **Sticky stacking case studies (dark band).**
   - Each of the 5 work items is a large card that sticks below the top. The next card slides up over it while
     the previous one scales to 0.94 and dims (scrubbed). Apple / Linear rhythm.
   - Each card: left text (title, kind · year, summary, role, stack chips, links), right a **device mockup**:
     - iPhone frame for Dremly / Posme, whose screenshots cross-fade or scroll inside the screen while the card is
       active;
     - a Safari/browser frame for the seller panel and 1likte mobile wide images;
     - for **Rommer** an architecture tile: 4 small linked boxes (Phone camera → On-device pose → API → Staff
       panel) with an animated dash flowing along the connectors. Labelled as an architecture overview, not a
       screenshot.
4. **Micro-detail everywhere** (this direction wins on polish):
   - buttons with press feedback (scale 0.97);
   - links with an underline that grows from the left;
   - focus rings in the accent gradient;
   - number tickers;
   - the copy-email button turns into a check with a small toast;
   - the nav pill highlights the current section with a sliding background (motion `layoutId`).

## Other sections
- **More work:** a grid of small cards with hover lift (y −2 px, shadow up).
- **Capabilities:** 4 cards with icon-free headers and pills.
- **Experience:** a clean list with a vertical progress line that fills as you scroll.
- **Contact:** a big gradient-bordered card, "Let's build something that ships.", with email copy, CV and
  socials; the beam runs around it.
- **Footer:** small, with a "Built with Next.js 16, React 19, GSAP, Motion" line. True facts, allowed here
  because they are part of the message.

## Mobile
- The bento becomes a 2-column, then 1-column flow; tiles still assemble on enter.
- Stacking cards stay (they work well on touch) with smaller devices.
- The mesh stays (it is cheap); the grain is lighter.
