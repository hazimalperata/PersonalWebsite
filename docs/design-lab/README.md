# Design lab: five home-page directions (2026-10-16)

Five design directions that are motion-rich, professional and work as real pages, all built with the same content.
Direction 4, Living Signal, was chosen for hazimalperata.com. The other four are kept here so they can be reused
for other projects.

## Where they live

| | |
| --- | --- |
| Code | `src/app/lab/<N>/` (route) + `src/lab/d<N>/` (components, shaders, data) |
| Shared content | `src/lab/facts.ts` (verified facts only) and the motion gate `src/lab/useMotionEnabled.ts` |
| Lab layout | `src/app/lab/layout.tsx`: its own root layout, noindex, no live-site chrome |
| Git | branch `lab`, fixed with tag `design-lab-2026-10-16` |
| Recipes | `briefs/`: the common rules plus one design brief per direction (palette, type, signature motions, technique) |
| Build notes | `reports/`: what each builder made, where the files are, known weaknesses |
| Screenshots | `shots/<N>/`: 3 desktop frames and 1 mobile frame per direction |

To view locally: `yarn dev`, then open `http://localhost:3000/lab`. The index page links to all five.

## The five directions

1. **Blueprint**
   - Engineering precision on paper. The page "compiles" itself on load and draws dimension lines with the
     real measured size of the headline.
   - Each project is built PLAN → BUILD → SHIP like a drawing sheet. There is a ⌘K command palette.
   - Native CSS scroll-driven animations; a WebGL contour field.
2. **Kinetic Editorial**
   - Type is the interface. The name fills the width, and headlines skew with scroll velocity.
   - Colour panels wipe over each other with exact counters, the cursor drags an image preview, and a Flip
     detail overlay opens projects. Marquees.
3. **Device Theatre**
   - A dark product-launch stage behind a liquid-chrome shader hero.
   - A pinned R3F phone turns through the apps, then the camera dives into the screen. The footer peels away.
4. **Living Signal** *(chosen)*
   - Every point on the page is one real commit (counted from git).
   - The field morphs as you scroll: nebula, true contribution timeline, numbers drawn in points, per-project
     clusters, a pentagon for the AI system.
5. **Bento Studio**
   - Product-grade polish: a living gradient mesh, a bento grid that assembles on scroll, and sticky stacking
     case cards with device mockups.
   - Number tickers, border beams, a command-palette card.

## How they were made

1. **Reference scan.** About 45 award-level sites (Awwwards, Godly, Codrops and others) were opened on desktop
   and phone. Their techniques were catalogued, along with free component sources (React Bits, Magic UI, Animata,
   Motion Primitives) and their licences.
2. **The owner's brief.**
   - Visitors are both employers and clients.
   - One message: "Whatever I take on, I build it to the highest standard: serious, real, and done the way
     modern technology says it should be done."
   - Impressive is welcome, professional is the bar.
3. **One common rule set** (`briefs/common.md`):
   - real content only;
   - one reduced-motion gate;
   - counters never overshoot;
   - 60 fps budget;
   - mobile and accessibility rules;
   - free libraries only.
4. **One design brief per direction** with exact values: hex palette, fonts, layout, 3–4 signature motions with
   the technique for each, background, mobile fallback.
5. **Five builders in parallel**, each in its own git worktree. Each one verified with typecheck, lint, build
   and Playwright screenshots on desktop, mobile and reduced motion, looked at its own frames and fixed them.
   The frames were then reviewed again before merging.

## Reusing a direction elsewhere

- Copy `src/lab/d<N>/` and the route file. Replace the `labFacts` import with the new project's content, keeping
  the same shape (`proof`, `work`, `capabilities`, `ai`, `experience`).
- Stack needed: Next.js App Router, React 19, Tailwind 4, `gsap` + `@gsap/react`, `motion`. Directions 1, 3 and 4
  also need `three`, `@react-three/fiber` and `@react-three/drei`.
- Keep `useMotionEnabled` as the single motion gate.
- The brief in `briefs/` is the recipe. To make a new variant, change the brief's values (palette, type, the
  signature moves) and build from it.
- Known polish items before production use are listed at the end of each report. Common ones:
  - frame rate measured only with software GL;
  - the Dremly store images contain device mockups, so the raw app screens are better.
