# Research: resources to accelerate the portfolio redesign (2026-10-16)

Project: Next.js 16.2.4, React 19, three 0.184, gsap 3.15, framer-motion 12, @once-ui-system/core 1.6.4 (from package.json). Goal: premium 3D/motion developer portfolio, dark/light, EN+TR.
Stars/licenses below were read from the GitHub API on 2026-10-16 unless marked "(unverified)".

---------------------------------------------------------------------------
## PART A. Local skills

Skill roots: the local skills folder, the plugin cache, and the synced gstack skills folder.
Stage legend: BEFORE = design process / run before building. DURING = implementation guidance. AFTER = audit / QA.

| Skill | Stage | What it concretely provides | Use for this project? |
|---|---|---|---|
| frontend-design (plugin `claude-plugins-official/frontend-design/*/skills/frontend-design`; same text as github.com/anthropics/skills `skills/frontend-design`) | BEFORE + DURING | Anti-template manifesto. Forces a two-pass process: write a compact token plan (4-6 named hex colors, type roles, layout concept with ASCII wireframes, principles), then review it against the brief and revise anything generic, then build, then self-critique. Lists "AI default" clusters to avoid (cream+serif+terracotta; near-black + acid green; broadsheet hairlines; SaaS identical rounded cards; ALL-CAPS eyebrows, "01/02/03" numbering, "A · B · C" meta strings, "→" on every link). Says: one orchestrated motion moment beats scattered fade-up on every section; spend boldness in one place. | YES, top priority. Run first. |
| ui-ux-pro-max (`skills/ui-ux-pro-max`) | BEFORE (design system) + DURING (lookup) | Python search CLI over CSVs: 84 styles, 192 palettes, 74 font pairings, landing patterns, UX rules, 16 GSAP presets (`data/motion.csv`, tiers Subtle/Standard/Complex with snippets). `--design-system --persist` writes `design-system/<slug>/MASTER.md` + per-page overrides; dials `--variance --motion --density` (1-10). Priority table: accessibility > touch > performance > style > layout > type/color > animation. | YES for design-system generation and GSAP presets. CAVEAT: its `threejs` stack CSV (54 rows) is built around the Three.js r128 CDN / no-bundler artifacts (e.g. "CapsuleGeometry does not exist in r128"); it is NOT R3F/drei guidance and is partly wrong for three 0.184. Do not follow it for the 3D layer. |
| anthropic-skills:design-consultation (gstack; `~/.claude/skills/synced/.../design-consultation`, 1564 lines) | BEFORE | Interactive consultation: understands product, researches landscape (WebSearch), proposes a full design system (aesthetic, type, color, layout, spacing, motion) and writes `DESIGN.md`; generates font+color preview page. | YES, if you want a written DESIGN.md as the single source of truth before building. Heavy preamble (gstack telemetry/bin calls) - expect noise. |
| anthropic-skills:design-shotgun (gstack, 1314 lines) | BEFORE | Generates multiple AI design variants via a "design binary" ($D), opens a comparison board, collects structured feedback, iterates. Needs the gstack design binary to be available (`DESIGN_READY` check). (unverified whether binary is installed here) | MAYBE: useful to compare 3-4 hero directions as images before coding. Skip if binary missing. |
| anthropic-skills:design-html (gstack, 1452 lines) | DURING (finalize) | Turns an approved mockup into "Pretext-native" HTML/CSS (30KB, zero deps, computed text layout). Output is plain HTML/CSS, not React/R3F. | LOW. Static HTML output; does not map to a Next.js + R3F app. Only for a throwaway static prototype. |
| anthropic-skills:design-review (gstack) | AFTER | Live-site visual QA: finds spacing/hierarchy inconsistency, "AI slop" patterns, slow interactions, then fixes in code with atomic commits and before/after screenshots. | YES after first build pass. |
| anthropic-skills:plan-design-review (gstack) | BEFORE (on a plan) | Rates each design dimension 0-10 on a written plan, explains what a 10 needs, edits the plan. | YES: run on the redesign plan before implementation. |
| hazim:hareket (`skills/hazim/skills/hareket`, 64 lines, Turkish) | DURING | Hazim's own motion rules: frequency rule (rare = showy, daily = short, hundreds/day = none, keyboard = never), 150-300ms micro-interactions, never animate from scale 0 (start 0.8-0.9), determinate things never bounce, 1-2 moving items per view, decoration-only animation is an anti-pattern, infinite loops only for loaders, exits plainer than entrances, reduced-motion mandatory via a single `useMotionEnabled()` gate, wrapper-drops-style-prop trap. Global CLAUDE.md says to invoke it before UI work. | YES, mandatory per CLAUDE.md. Note: a portfolio is the "rare" tier, so showy hero motion is allowed, but still one orchestrated moment. |
| design-motion-principles (`skills/design-motion-principles`, 327 lines) | AFTER (audit) + planning | Audit workflow in 3 voices: Emil Kowalski (restraint/speed), Jakub Krehel (production polish), Jhey Tompkins (playful, CSS innovation: `@property`, `linear()`, scroll-driven). Step 1 reconnaissance incl. "motion gap analysis" (conditional renders without AnimatePresence) then waits for user confirmation of weighting; has reference files (accessibility, performance, common-mistakes). Its own mapping says portfolios/creative sites weight Jhey + Jakub. | YES as audit after build; use Jhey+Jakub weighting. |
| animation-designer (`skills/animation-designer`, 171 lines) | DURING | Basic Framer Motion recipes: fade-in, stagger, hover spring, `useReducedMotion`, "animate transform/opacity only". Generic. | LOW. Everything it says is covered better by hareket + frontend-design. Project already has framer-motion 12 (import from `motion/react` in current versions - check). |
| motion-graphics (`skills/motion-graphics`, 499 lines) | DURING | "Lead Gen" landing-page toolkit: LottieFiles MCP, Framer Motion components, Remotion videos, conversion-focused micro-interactions. | LOW/NO. Conversion-marketing tone and Lottie; not a 3D/dev-portfolio fit. |
| artifact-design (built-in skill, not a local file) | n/a | Page contract for published Artifacts (title, tokens, dark mode, fonts). | NO for the site itself. Only relevant if you publish a research/preview page as an Artifact. |
| superdesign (plugin `superdesign/0.6.0`) | BEFORE | Hosted infinite-canvas design tool with multiple models, design-system extraction, variants; needs its CLI/account. | MAYBE for variant exploration; external service (check pricing; budget rule: no paid services). |
| figma-shaders / figma-implement-motion (plugin figma 2.2.157) | DURING | Only relevant if the design lives in Figma: `create_shader` workflow, and translating Figma motion data to motion.dev/CSS. | NO unless you design in Figma. |
| anthropic-skills:frontend-slides, web-asset-generator | n/a | Slides and favicon/OG asset generation. | web-asset-generator may help later for favicon/OG images. |

Other SKILL.md files mentioning three.js/webgl/r3f/gsap/portfolio/landing/shader/premium (grep result): `imagegen-frontend-mobile` (mobile screen concepts, image-only), `hazim/skills/picker-mobil`, `pptx` variants, `expo-dom`/`expo-native-ui` (Expo), `figma-*`. None is an R3F/Three.js implementation skill. There is NO local skill covering React Three Fiber / drei / shaders. That gap is what Part B fills.

Recommended pipeline:
1. BEFORE: `hazim:hareket` (read rules) -> `frontend-design` (token plan + anti-default review) -> optionally `ui-ux-pro-max --design-system --persist` (+ `--motion 7 --variance 7`) or `design-consultation` for a DESIGN.md -> `plan-design-review` on the plan.
2. DURING: hareket rules + ui-ux-pro-max `--domain gsap` presets; R3F/drei docs from Part B for the 3D layer.
3. AFTER: `design-review` (visual QA), `design-motion-principles` (Jhey+Jakub), Lighthouse / reduced-motion check.

---------------------------------------------------------------------------
## PART B. Internet resources

### B1. Templates / starters (3D + motion, Next.js, R3F)

Honest finding: the open-source 3D portfolio "templates" found are tiny. Treat them as reading material, not foundations.

| Repo | Stars | License | Notes |
|---|---|---|---|
| https://github.com/BaomaDev/nextjs-3d-portfolio-template | 0 | none declared | Next 14, TS, Tailwind, GSAP, R3F, dark mode, dynamic project pages (pushed 2025-11). No license = cannot legally reuse. |
| https://github.com/shivam349/portfolio | 0 | none | Next 16, React 19, Tailwind 4, Motion, R3F, config-driven (pushed 2026-09). |
| https://github.com/Mohith2112/Portfolio | 0 | MIT | Next 16, R3F, Tailwind 4, 3D keyboard hero, seasonal themes (pushed 2026-10). |
| https://github.com/ahmeddev812/3d-portfolio | 0 | none | Next 16, R3F, light/dark, glassmorphism. |
| https://github.com/akashrmalhotra/3d-portfolio | 404 | MIT | Highest-starred "3d portfolio" results; likely Vite/CRA era (unverified stack). |
| https://github.com/sanidhyy/3d-portfolio | 298 | MIT | Popular tutorial-derived (JSM-style) R3F portfolio (unverified stack). |
| https://github.com/Evavic44/portfolio-ideas | 6375 | (list) | Curated list of portfolio ideas. |
| https://github.com/smaranjitghose/awesome-portfolio-websites | 2788 | (list) | Community portfolio template list. |

Conclusion: no mature, well-maintained premium R3F portfolio starter exists with a good license. Best practice: build on own stack (R3F + drei + GSAP/Lenis) and borrow patterns from Codrops tutorials (B2) plus component libraries below.

**Once UI Magic Portfolio** (https://github.com/once-ui-system/magic-portfolio, 1418 stars): LICENSE file is **CC BY-NC 4.0** (read from raw LICENSE; GitHub shows NOASSERTION). NonCommercial: cannot be used commercially; for a personal dev portfolio that is fine, but if the site ever advertises freelance/agency services the "commercial" line is blurry (unverified legal reading; Once UI also sells a separate commercial license, unverified). Limits for a premium 3D site: opinionated design system (tokens, Flex/Column primitives, fixed component look), MDX-driven content pages (blog, work), no 3D/WebGL layer, motion is CSS-level; fighting its styles for custom hero/cursor/shader work costs more than it saves. Recommendation: keep `@once-ui-system/core` only if you want its primitives; otherwise plan to migrate custom surfaces to plain CSS modules/Tailwind-free tokens. Package `@once-ui-system/core` license: check its package LICENSE (unverified).

### B1b. Component libraries (copy-paste, web)

| Library | Stars / license | Pricing | Fit |
|---|---|---|---|
| React Bits https://reactbits.dev (github.com/DavidHDev/react-bits) | 49,357 stars; "MIT + Commons Clause" (read from LICENSE.md: free incl. commercial use inside an app/site; you may NOT sell/sublicense/redistribute the components themselves) | Free; React Bits Pro sold separately (price unverified) | Best 3D/WebGL-ish free set (see list). Variants JS/TS x CSS/Tailwind. |
| Magic UI https://magicui.design (github.com/magicuidesign/magicui) | 22,689 stars; MIT | Free; Pro templates paid (unverified price) | Polished, restrained (marquee, bento, animated beams, dock, globe). |
| Aceternity UI https://ui.aceternity.com | not a public MIT repo (unverified); license page https://ui.aceternity.com/licence covers Pro only; free-component terms not stated on page | Free components; Pro Annual $169, Lifetime $199, Team $1590 (pricing page). PAID. | Largest effects catalog; many need Motion + Tailwind. Free-vs-Pro is not labelled per component. Per budget rule: use only free ones; do not buy. |
| 21st.dev https://21st.dev | community registry (per-component authors; license per component NOT verified); Magic MCP server is MIT (4.4k stars, unverified) | Component browsing free; Magic MCP needs API key, pricing unclear/"beta free" (unverified). | Huge category counts: Heroes 1152, Backgrounds 365, Marquees 113, Texts 663, Cursors 152, Cards 1780. Check each author's license. |
| drei (R3F helpers) https://github.com/pmndrs/drei | 9,966; MIT | Free | See B2. |

**Specific picks (verified to exist on the component index pages):**

Aceternity (base https://ui.aceternity.com/components/<slug>):
- Hero backgrounds: `aurora-background`, `background-beams`, `spotlight-new`, `vortex`, `cloud-shader`, `dotted-glow-background`
- Text: `text-generate-effect`, `encrypted-text`, `flip-words`, `layout-text-flip`, `text-hover-effect`
- Cards: `3d-card-effect`, `glare-card`, `wobble-card`, `evervault-card`, `card-spotlight`, `comet-card`
- Cursor: `following-pointer`, `pointer-highlight`, `lens`
- Scroll: `tracing-beam`, `sticky-scroll-reveal`, `container-scroll-animation`, `hero-parallax`, `timeline`
- Marquee/3D: `infinite-moving-cards`, `3d-marquee`, `3d-globe`, `github-globe`, `3d-pin`, `floating-dock`
- Free hero blocks: https://ui.aceternity.com/components/hero-sections-free (Pro blocks under /blocks/ are paid)

React Bits (https://reactbits.dev; component names from its index; open each page for code):
- Backgrounds: Aurora, Soft Aurora, Liquid Ether, Silk, Iridescence, Galaxy, Plasma, Light Rays, Grainient, Dither, Ballpit, Particles, Grid Scan, Topography, Liquid Chrome
- Text: Split Text, Blur Text, Scroll Reveal, Scroll Float, Decrypted Text, Scrambled Text, Shiny Text, Text Pressure, Variable Proximity, ASCII Text, Count Up
- Cards/Components: Tilted Card, Holo Card, Spotlight Card, Magic Bento, Reflective Card, Glass Surface, Fluid Glass (3D), Lanyard (3D badge), Model Viewer, Dome Gallery (3D), Circular Gallery, Infinite Menu, Dock, Card Nav, Staggered Menu
- Cursor: Target Cursor, Ghost Cursor, Splash Cursor, Blob Cursor, Glow Cursor, Swarm Cursor, Image Trail, Magnet
- Marquee/loop: Logo Loop, Scroll Velocity, Curved Loop
- Explicit WebGL/3D per its index page: Warp Text, Morph Slider, Fluid Glass, Lanyard, Model Viewer, Dome Gallery, Infinite Spiral, Flying Posters, Card Swap, Circular Carousel, Depth Carousel, Cubes, Grid Scan, Topography, Particles
- Install method (shadcn registry vs copy) not confirmed from the fetched page (unverified).

21st.dev (page shows popularity counts; URLs below were listed on the community page):
- https://21st.dev/@arunachalam/components/scroll-expansion-hero (scroll media expansion hero)
- https://21st.dev/@manuarora700/components/container-scroll-animation
- https://21st.dev/@serafimcloud/components/splite (Spline scene embed)
- https://21st.dev/@jahed/components/spotlight-card
- https://21st.dev/@jatin-yadav05/components/radial-orbital-timeline
- https://21st.dev/@prashantsom75/components/scroll-morph-hero
- https://21st.dev/@kokonutd/components/background-paths
- https://21st.dev/@designali-in/components/liquid-glass-button
- Category browsing: https://21st.dev/community/components (Heroes, Backgrounds, Marquees, Texts, Cursors, Cards). Popularity != quality; apply the anti-template rules from frontend-design (many of these ARE the generic look).

**The three extra sources from the coordinator:**

1. https://rnmotion.dev/ , React Native Motion. What: animation snippets for React Native + Expo (Aurora Curtain via Skia shader, Blurred Text Morph, ChatGPT Attachment Menu, Gallery Stack Carousel, Linear Tab Bar, Radial Menu, Stack Toast). Target: native only; page does not mention web. License and pricing: not stated (donation link). Fit for Next.js portfolio: NONE as code. Possible use: inspiration for the "mobile apps" showcase section (you build RN apps) and its design language. Do not install.
2. https://styles.refero.design/ , Refero Styles. What: library of "2,000+ AI-readable design systems" extracted from real product sites; each style has colors, typography, spacing, components and a DESIGN.md; works with Claude Code, Cursor, v0 etc.; also offers an MCP connection. Target: web, tool-agnostic (style reference, not components). License/pricing: not stated on the landing page; check terms and whether MCP/full access is paid before relying on it (budget rule). Fit: GOOD as a BEFORE-stage input to frontend-design: pick 2-3 dark styles (the page lists "Raycast: midnight command center, coral neon", "Apple iPhone 18 Pro: midnight hardware gallery", "Dala: constellation on black") and have Claude derive tokens, not copy. Caution: copying a real brand's system into a personal site risks looking derivative.
3. https://silkhq.com/ , Silk. What: React library for native-like swipeable sheets/overlays on the WEB (Sheet, Bottom Sheet, Sidebar, Top Sheet, Detached Sheet, Toast, Page, Lightbox, Card, Parallax Page; detents, stacking, depth, keyboard handling; WAI-ARIA; spring physics; unstyled; TS; "Available for React"). Not React Native. License/pricing: not stated; "Get Access" CTA suggests gated/paid (unverified). Next.js support not stated explicitly. Fit for portfolio: LOW-MEDIUM. Could power a project-detail bottom sheet / mobile menu / lightbox, but adds a gated dependency; a free alternative is vaul (https://github.com/emilkowalski/vaul, MIT, 8,639 stars) or Motion + native `<dialog>`.

Also relevant: https://github.com/VoltAgent/awesome-design-md (MIT, 121,671 stars): collection of DESIGN.md files from well-known sites with sections Visual Theme, Color roles, Typography, Components, Layout, Agent Prompt Guide. DESIGN.md spec was open-sourced by Google Stitch (reported 2026-04, unverified date). Use like Refero: reference, not copy.

### B2. Shader / 3D / effect resources

- drei (MIT, 9,966 stars) https://github.com/pmndrs/drei : in `src/core` I confirmed these files exist: MeshTransmissionMaterial, MeshReflectorMaterial, MeshRefractionMaterial, MeshDistortMaterial, MeshWobbleMaterial, Environment, Lightformer, Float, Text3D, Sparkles, Stars, Cloud, Caustics, AccumulativeShadows, Decal, Trail, Outlines, Preload, Bvh, SpotLight. Docs: https://drei.docs.pmnd.rs . Premium-look combo: Environment + Lightformer, MeshTransmissionMaterial glass, Float, Sparkles; performance: Bvh, Preload, AdaptiveDpr/PerformanceMonitor (latter not file-checked).
- @react-three/fiber (MIT, 33,004) https://github.com/pmndrs/react-three-fiber ; postprocessing (Zlib, 2,884) https://github.com/pmndrs/postprocessing and wrapper https://github.com/pmndrs/react-postprocessing (not star-checked) for Bloom, Noise, Vignette, ChromaticAberration, DepthOfField, Grain-like Noise.
- three-custom-shader-material (MIT, 1,345, last push 2025-10) https://github.com/FarazzShaikh/THREE-CustomShaderMaterial : extend MeshStandard/Physical materials with own GLSL while keeping lighting. Good for vertex displacement hero blobs.
- lamina (MIT, 1,108) https://github.com/pmndrs/lamina : layer-based shader material, but last push 2025-06; likely stale vs r3f 9 / three 0.184 (compatibility unverified). Prefer THREE-CustomShaderMaterial.
- shadergradient (2,871 stars, no license shown on GitHub; verify before shipping) https://github.com/ruucm/shadergradient : ready-made moving mesh gradients as React component (also Framer/Figma). Check its license/pricing (unverified).
- Lenis (MIT, 16,578) https://github.com/darkroomengineering/lenis ; GSAP (29,287; free incl. commercial and ALL plugins, SplitText, MorphSVG, ScrollTrigger etc., under Webflow's standard license; prohibited use = building a competing visual animation builder) https://gsap.com/community/standard-license/ . Wire Lenis to ScrollTrigger via `gsap.ticker`.
- Theatre.js (Apache-2.0, 12,774) https://github.com/theatre-js/theatre : timeline-based camera/animation sequencing for R3F; Codrops has a camera fly-through tutorial using it.
- Three.js Journey https://threejs-journey.com : paid ($95 Three.js course, $45 WebGPU+TSL, $120 bundle, one-time). Relevant lessons: 17-19 Particles/Galaxy/Scroll animation, 27-44 shaders (galaxy, hologram, halftone, particles morphing, GPGPU flow field, wobbly sphere), 45 post-processing, 46 performance, 47 intro/loading progress, 48 mixing HTML and WebGL, 49-52 portal scene (baking), R3F chapter 53-66 (58 Environment/Staging, 63 post-processing with R3F, 64 "Fun and Simple Portfolio"). NOTE budget rule: it is paid; the user decides. Free alternatives: threejs.org docs/examples, r3f docs, drei docs, Codrops.
- Codrops 2026 articles (verified via search results): 
  - Reactive Depth, scroll-driven 3D image tube in R3F with shader deformation + DOM/WebGL sync (2026-02-17): https://tympanus.net/codrops/2026/02/17/reactive-depth-building-a-scroll-driven-3d-image-tube-with-react-three-fiber/
  - Shader.se scroll-driven WebGPU pipeline, R3F + TSL (2026-05-19): https://tympanus.net/codrops/2026/05/19/80s-business-tech-seamless-scene-transitions-inside-shader-ses-scroll-driven-webgpu-pipeline/
  - Podium case study (2026-06-23): Next.js + GSAP ScrollTrigger/Flip + Lenis + R3F + Zustand, closest to a portfolio (URL not captured; find via https://tympanus.net/codrops/tag/react-three-fiber/)
  - Infinite Liquid Glass Grid, WebGPU/TSL (2026-09-08), "From Flat to Spatial" curved 3D grid R3F (2026-02-24) - URLs via the tag pages.
  - Tag hubs: https://tympanus.net/codrops/tag/react-three-fiber/ , https://tympanus.net/codrops/hub/tag/webgl/ . (codrops.com root returns 403 to curl; tympanus.net works.)
  - The Architecture Behind Trionn: GSAP + Three.js + Lenis + Web Audio https://tympanus.net/codrops/?p=117096
- WebGPU/TSL is emerging (three 0.184 supports it); for a portfolio, stay on WebGL renderer for reliability and use TSL only if the team wants it (judgement, unverified browser coverage).

Performance guard-rails (general knowledge, not from sources): one canvas, `dpr={[1,2]}`, `frameloop="demand"` when idle, lazy-load the canvas below the fold or after LCP, static poster/CSS gradient fallback for reduced-motion and low-power, draco/meshopt for GLBs.

### B3. Prompting / design-guidance resources

- Anthropic frontend-design skill: https://github.com/anthropics/skills/tree/main/skills/frontend-design (anthropics/skills, 181,456 stars). Same content as the locally installed plugin. Key quotes/principles (paraphrased tightly):
  1. "Open with the most characteristic thing in the subject's world" - hero = headline/image/animation/live demo/interactive moment, not the default big-number + gradient treatment.
  2. Write a token plan (4-6 named hex values, type roles, layout w/ ASCII wireframes), then "review that plan against the brief... if any part reads like the generic default... revise" before coding.
  3. "Spend your boldness in one place": one memorable element, everything else quiet; one orchestrated page-load moment beats fade-up-on-every-section.
  4. Avoid tells: single accented word in headline, ALL-CAPS labels, eyebrows above everything, 01/02/03 numbering unless content is a sequence, identical rounded cards.
  5. Quality floor: responsive to mobile, visible focus, reduced motion respected.
- VoltAgent awesome-design-md (above) and Refero Styles (above): reference DESIGN.md files to anchor the model on a concrete system.
- ibelick/ui-skills https://github.com/ibelick/ui-skills (MIT, 9,783 stars): "Skills for Design Engineers" (content not read, so unverified relevance).
- nextlevelbuilder/ui-ux-pro-max-skill (MIT, 136,350 stars) is the upstream of the local ui-ux-pro-max skill. Local copy may be older/newer (unverified).
- Practical prompt pattern for this project (my synthesis): give Claude (a) the token plan, (b) a named single "hero moment", (c) a banned-defaults list copied from frontend-design, (d) performance/reduced-motion budget, (e) EN+TR copy length stress test (Turkish strings run ~15-25% longer, unverified estimate).

### B4. Design assets

Fonts (licenses):
- Google/OFL (safe to self-host; use `next/font/google` or fontsource): Inter (OFL-1.1, https://github.com/rsms/inter), Geist + Geist Mono (OFL-1.1, https://github.com/vercel/geist-font, also in next/font), Bricolage Grotesque (OFL-1.1, https://github.com/ateliertriay/bricolage; variable with width/optical-size axes), Instrument Serif (Google Fonts, OFL; single weight + italic; repo path not verified).
- Fontshare (https://www.fontshare.com): Satoshi, General Sans, Clash Display, Cabinet Grotesk. Multiple secondary sources say free for commercial use (web, apps, print). Fontshare's own license page could not be fetched (page content was only the tagline), so exact self-hosting/redistribution terms are UNVERIFIED: ITF Free Font License reportedly restricts redistribution/modification of the font files; reviewers say you can download WOFF2 for self-hosting or use Fontshare's CDN CSS. Safest: use Fontshare's hosted CSS link, or read https://www.fontshare.com/terms in a browser before committing font files to a public repo (this repo is on GitHub - committing fonts publicly = redistribution risk). Prefer OFL fonts if repo is public.
- Pairing ideas (judgement): Bricolage Grotesque display + Inter/Geist body; or Instrument Serif display + Geist body for an editorial feel. Tersane brand already uses Bricolage + Inter but this is Hazim's personal site, not the firm's.
Grain/noise:
- SVG `feTurbulence` data-URI overlay on `::before`, low opacity (guide suggests ~0.03-0.12; >0.15 reads as dirt), `mix-blend-mode` overlay/soft-light, `pointer-events:none`; feTurbulence is CPU-rendered, avoid animating it (use a pre-rendered tiled PNG or canvas for animated grain). Guides: https://www.freecodecamp.org/news/grainy-css-backgrounds-using-svg-filters/ , https://css-tricks.com/grainy-gradients/ (URL inferred from the search result titled "css tricks"; unverified), generator https://cssmatic.com/gen-noise-texture.html . In R3F: postprocessing `Noise` effect.
Icons:
- Phosphor https://github.com/phosphor-icons/react (MIT, 1,772; 6 weights incl. duotone), Lucide https://github.com/lucide-icons/lucide (25,061; ISC, GitHub shows NOASSERTION), Hugeicons free set https://github.com/hugeicons/hugeicons-react (MIT wrapper, 56 stars; free tier limited to a subset, full set paid - unverified). Recommendation: Phosphor (weights give personality) or Lucide.

### B5. Inspiration galleries (all but two returned HTTP 200 to curl)

| Gallery | URL | Use for a dev portfolio |
|---|---|---|
| Awwwards | https://www.awwwards.com/websites/portfolio/ and https://www.awwwards.com/websites/three-js/ (both 200) | Best for 3D/WebGL benchmark; filter by Portfolio + Three.js; open the "site of the day" pages for tech stack tags. Browsing free. |
| Godly | https://godly.website | Hand-curated, animated thumbnails; best for motion/interaction references (1,000+ sites reported). |
| Dark Mode Design | https://www.darkmodedesign.com | Dark-theme sites specifically (matches dark default). Not covered by the search snippets; only liveness verified. |
| Minimal Gallery | https://minimal.gallery | Restrained, typography-led layouts; counterweight to over-effects. |
| Curated.design | https://www.curated.design | Only liveness verified (200); content unverified. |
| Siteinspire | https://www.siteinspire.com | Returned 429 to curl (rate limit); open in browser. Fine-design showcase, good typography. |
| Lapa Ninja | https://www.lapa.ninja | Returned 403 to curl; landing-page gallery, more SaaS than portfolio, low priority. |
| Evavic44 portfolio-ideas | https://github.com/Evavic44/portfolio-ideas | Developer-portfolio-specific list (6,375 stars). |

Suggested browsing order for this project: Awwwards (Portfolio x Three.js) -> Godly -> Dark Mode Design -> Minimal Gallery; save 5-8 references and record what ONE thing to borrow from each (feed into frontend-design token plan).

---------------------------------------------------------------------------
## Gaps / unverified summary
- Aceternity free-component license text, 21st.dev per-component licenses, Silk and rnmotion license/pricing, Refero pricing, Fontshare self-hosting terms, shadergradient license: NOT confirmed.
- Template repos' star counts were verified (all near zero); their quality was judged from descriptions only.
- Dark Mode Design / Curated.design content not inspected.
