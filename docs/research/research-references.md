# Portfolio redesign research: references and techniques

Research date: 2026-10-16. Method: WebSearch and WebFetch only. The sites themselves were fetched as text, not rendered, so visual and motion claims come from Awwwards pages, case studies and roundups, not from watching the sites. Anything I could not confirm from a fetched page is marked **(unverified)**. "Fit" ratings are my own judgement for a solo frontend and mobile engineer, not a sourced claim.

Source caveats:
- Utsubo and hontran.dev are vendor or self-promoting blogs. They are fine for lists of sites, weaker for claims about quality.
- Codrops (tympanus.net) returned HTTP 403 to fetches. Codrops facts below come from search snippets or secondary write-ups, and are flagged.
- WebSearch snippets are model-summarised. I re-checked the important ones with a fetch where I could.

---

## 1. Reference sites

### Tier A: solo developer or designer portfolios (closest to your case)

| # | Site | What makes it premium | Key techniques | Fit for a dev portfolio |
|---|---|---|---|---|
| 1 | **Bruno Simon** https://bruno-simon.com (source https://github.com/brunosimon/folio-2025, MIT) | The portfolio is a drivable 3D world with a car, weather, day/year cycle and physics. It also has a mobile, tablet and gamepad control scheme, a quality toggle and a renderer choice (WebGPU). Fetched page: https://bruno-simon.com | Three.js, Vite, Blender export presets, glTF-Transform and KTX (ETC1S) texture compression, staged game loop (README: https://github.com/brunosimon/folio-2025). The 2020-era version used Cannon.js and matcap lighting per an interview (https://www.mux.com/blog/3d-web-development-and-beyond-a-chat-with-bruno-simon). Whether folio-2025 uses Rapier is not confirmed by the README; the live page's credits list Rapier and Howler.js. | Inspiration for ambition, not a template. A full game is months of work. The page shows no project gallery and no text fallback for the 3D content, which hurts discoverability and accessibility. |
| 2 | **Huy Phan Vol.2** https://huyml.co (Awwwards SOTD 14 Oct 2026, Developer Award) | Art-directed designer portfolio. Awwwards lists GSAP, Three.js and Framer. Palette is only #FF4949 and #181818. Notable elements: loading, project gallery, case study, about/contact. Source: https://www.awwwards.com/sites/huy-phan-vol-2 | Preloader, project gallery, case study pages, typography-led layout. Dev Award sub-scores: Animations 8.2, Accessibility 7.0, WPO 7.4. | Strong. Shows that a two-colour palette with 3D accents wins. |
| 3 | **Maria Vasilyeva Portfolio** https://mariavasilyeva.com (Awwwards SOTD 9 Oct 2026, Developer Award) | Concept-led: "interactive designer portfolio inspired by music and sound". Source: https://www.awwwards.com/sites/maria-vasilyeva-portfolio | CSS and WebGL, Sanity CMS, pre-loader, page transition, three hover effects, annotations UI, scroll animation on About. Palette #131313 and #F9F9F9. Dev Award: Animations 8.0, but Accessibility only 6.4. | Strong on structure. Sanity as a CMS is a realistic pattern for a bilingual site. |
| 4 | **Corentin Bernadou** https://corentinbernadou.com (Codrops case study, 5 Mar 2026: https://tympanus.net/codrops/2026/03/05/inside-corentin-bernadous-portfolio-swiss-inspired-layouts-webgl-geometry-and-thoughtful-motion/ , fetch blocked; details from https://abduzeedo.com/corentin-bernadous-webgl-portfolio-blends-swiss-design-and-code) | Swiss-style grid, orange/white/black, a flat editorial 2D surface with a WebGL geometry layer that carries the project previews. Grid rulers, Figma-like markers and an Option+G layout-grid reveal are developer-flavoured details. A mask follows the cursor between menu items. | Three.js + GLSL, GSAP, Lenis, PJAX page transitions, vanilla JS, JSON data, no framework. | Excellent. A freelance developer's portfolio, and 3D is used for work previews, not decoration. |
| 5 | **Arnaud Rocca** (Codrops, Mar 2026: https://tympanus.net/codrops/?p=112139) | Minimal layout, per-project accent colour. From search snippet only: Nuxt, GSAP with SplitText and ScrollTrigger, Lenis, OGL for fluid WebGL, Prismic CMS. | Motion system first, then WebGL. **(unverified beyond the snippet; page returned 403)** | Excellent model of "GSAP motion system + one small WebGL moment". |
| 6 | **Joffrey Spitzer** (Codrops: https://tympanus.net/codrops/?p=108883) | Minimalist Astro + GSAP build with reveals, Flip transitions, Swup page transitions, Three.js, Lenis. Snippet only. **(unverified)** | Astro, GSAP Flip, Swup. | Good for a lighter, content-first build. |
| 7 | **Roman Jean-Elie, Portfolio '25** (Codrops: https://tympanus.net/codrops/?p=104256) | Case study "Letting the Creative Process Shape a WebGL Portfolio": Next.js, React Three Fiber, GSAP incl. MorphSVG. Candid about features that were cut. Snippet only. **(unverified)** | Next.js + R3F + GSAP, the same family as your stack. | Directly relevant to your stack. Read the full article in a browser. |
| 8 | **Weisdevice** https://weisdevice.xyz (Codrops case study: https://tympanus.net/codrops/?p=101800) | Lo-fi "old OS" concept: boot screen, windowed folders for Work/About/Contact/Legal, a music and a theme toggle, plus a 3D island with a robot. Hosted on GitHub Pages and uses no cookies. Fetched: https://weisdevice.xyz . A creativedevjobs roundup says raycasting runs at 30 FPS, the render loop pauses on project pages and assets lazy-load (https://www.creativedevjobs.com/blog/best-threejs-portfolio-examples-2025). | Three.js, GLSL, Howler.js, GSAP. | Concept-driven, so it does not copy over directly, but the performance habits (pause loop off-screen, lower raycast rate) do. |
| 9 | **Dennis Snellenberg** https://dennissnellenberg.com | Single-page freelance designer/developer site. Greeting "Hello" in many languages, "Freelance Designer & Developer" hero, four recent-work cards with category and year, "More work (11)" link, local-time footer, "Code by Dennis Snellenberg" credit. Awwwards even has a collection of copycats called "Copy Dennis" (https://www.awwwards.com/sites/copy-dennis-collection). The page text I fetched confirms the structure above (https://dennissnellenberg.com). Technique details (magnetic buttons, etc.) were **not confirmable from fetched text (unverified)**. | Typographic hero, card hover states, full-screen menu. Not a WebGL site. | Excellent for structure and restraint. It is the 2D benchmark. |
| 10 | **Mat Voyce** https://matvoyce.tv (Awwwards SOTD; GSAP Site of the Year 2025 nomination per https://www.hontran.dev/blog/best-award-winning-websites-2026) | Kinetic type: letters stretch, snap and recombine on scroll. Page text shows "Featured work" cards with animated previews, a services list, a logo marquee (logo set repeated 4 times in markup). Fetched: https://matvoyce.tv | GSAP timelines, type-led layout, marquee. | Good: shows how to be premium with no 3D at all. |
| 11 | **Minh Pham** https://minhpham.design (Awwwards SOTD, dev score 7.77, per hontran) | "3D frames the work without overwhelming it": GSAP motion system over Three.js. Claim comes from the vendor blog above; I could not verify it on Awwwards (page 404). **(partly unverified)** | GSAP + Three.js/WebGL. | Good tone reference. |
| 12 | **Jordan Breton** https://jordan-breton.com (FWA SOTD 2 Oct 2025 per creativedevjobs) | Floating sky island, fixed camera points to move between sections. | Three.js, fixed-point camera navigation. | World-based portfolios are impressive but costly. Take the "fixed camera stops" idea only. |
| 13 | **Thibault Introvigne** https://thibault-introvigne.com | Collect 10 hidden items, each unlocks work info. Three.js + R3F. Author started creative dev five years prior. Source: creativedevjobs link above. | R3F, game mechanic. | Charming, high risk of hiding content. |
| 14 | **Ameen Abdullah** https://ameen-abdullah.dev | WebGPU sakura-petal loading screen, then island scene. Vue + WebGPU, described as award-winning in the creativedevjobs roundup. I could not find the Awwwards entry (404). **(award unverified)** | WebGPU. | Reference for the preloader-as-first-impression idea. |

### Tier B: studio and campaign benchmarks (use for technique, not for scope)

| Site | Why it matters | Source |
|---|---|---|
| **Lusion** https://lusion.co | Studio site. Hero says "3D visual storytelling and interactive web experiences"; featured work is a ten-card grid with category tags and a "See all projects" link, "Play Reel" CTA, Labs link, sound controls. Page text names no frameworks. Fetched: https://lusion.co . Awwwards describes Lusion as a "real-time application focused creative studio": https://www.awwwards.com/lusion/ . Their "Oryzo" mock product launch won Awwwards SOTM April 2026 plus a Developer Award, built as a live Three.js hero with Z-axis depth scroll (https://oryzo.ai/, via https://www.utsubo.com/blog/best-threejs-websites-2026). A 2023 "Lusion v3" Site of the Year entry is listed at https://www.awwwards.com/websites/sites_of_the_year/ . |
| **Igloo Inc** https://www.igloo.inc | Awwwards Site of the Year 2024 (listed with developer abeto at https://www.awwwards.com/websites/sites_of_the_year/ ). Awwwards case study (agency Bureaux supplied moodboards, renders and 3D assets) is at https://awwwards.com/igloo-inc-case-study.html ; it does not describe the WebGL implementation, so technique details are **(unverified)**. |
| **Lando Norris** https://landonorris.com | Site of the Year 2025 (developer OFF+BRAND), same Awwwards list. I found no technique write-up, so stack is **(unverified)**. |
| **Messenger by abeto** https://messenger.abeto.co | Site of the Year 2025. A tiny-planet multiplayer parcel game, loads 5.7 MB and peaks at 17.5 MB, built with Three.js and three-mesh-bvh per https://www.creativedevjobs.com/blog/best-threejs-portfolio-examples-2025 . Good lesson on asset budgets. |
| **Cartier Watches & Wonders** https://www.cartier.com/en-fr/watchesandwonders | Digital twin of the pavilion by Immersive Garden; Three.js, GLSL, GSAP, Lenis, Web Audio score, "a scene per product" (https://www.utsubo.com/blog/best-threejs-websites-2026). |
| **Hubtown** https://hubtown.co.in | Three.js hero monolith with a cursor-reveal interaction, SOTD June 2026 (same Utsubo source). |
| **Iventions** https://iventions.com and **By-Kin** https://by-kin.com | Restraint as the premium signal: WebGL for atmosphere, continuous-surface transitions, per https://www.hontran.dev/blog/best-award-winning-websites-2026 (vendor-authored: the author built both sites). |
| **Uncommon Studio** https://uncommonstudio.com.au | Rhythm and pacing, GSAP section transitions, a fast page despite heavy art direction (same hontran source). |
| **Shapefest, Sector32, 3dear** | Listed as Three.js portfolio inspiration at https://www.awwwards.com/inspiration/portfolio-sector-32-2025 . No technique detail on the page. |

Directories to keep browsing (not individually checked): Awwwards Three.js collection https://www.awwwards.com/websites/three-js/ , Awwwards portfolio collection https://www.awwwards.com/websites/portfolio/ , Awwwards Developer Award list https://www.awwwards.com/websites/developer/ . Godly: `godly.website` returned a 301 to `recent.design`; I could not tell from the page whether Recent is the new home of Godly's gallery (https://recent.design/?ref=godly), so treat that as **(unverified)**. Codrops tag page for portfolios: https://tympanus.net/codrops/tag/portfolio/ (not fetched).

### Pattern in the winners
Fetched Awwwards pages for the three most recent portfolio SOTDs show the same mix: Huy Phan (GSAP, Three.js, Framer), Maria Vasilyeva (CSS, WebGL, Sanity), LPAS (WordPress, GSAP; a studio site, no 3D) at https://www.awwwards.com/sites/lpas . Winning portfolios are mostly GSAP-led, with WebGL used sparingly.

---

## 2. Technique catalogue

Complexity: S = an afternoon, M = a few days, L = a week or more. Perf cost is relative to a typical mid-range phone.

| Technique | Typical library | Complexity | Perf cost | Notes and sources |
|---|---|---|---|---|
| **Hero 3D object** (single product or abstract mesh, inertial easing, optional scroll-linked camera) | Three.js, or React Three Fiber (R3F) + drei | M | Medium. Cap DPR, keep draw calls low. | Oryzo uses one live hero object and moves the camera through Z-depth on scroll (https://www.utsubo.com/blog/best-threejs-websites-2026). R3F is used by Roman Jean-Elie and Thibault Introvigne (see section 1). |
| **GPU particles / point cloud** | Three.js Points + custom shader, or drei Points | M | Medium to high, depends on count. | Only worth it if it relates to your content (e.g. your name as particles). Random particles are an anti-pattern (section 3). |
| **Shader material (noise, gradient, distortion)** | GLSL, Three.js ShaderMaterial or TSL | M to L | Low to medium for one full-screen quad. | Corentin Bernadou and Arnaud Rocca use GLSL, OGL. IVRESS compiles TSL shaders to WebGPU and WebGL (https://brand.ivress.co.jp/ via the Utsubo article). |
| **Grain / noise overlay** | CSS (SVG feTurbulence or a tiled PNG), or a shader pass | S | Low as a static tiled image. A live SVG filter over a full page can be costly **(unverified; measure it)**. | Used as texture over flat colour; keep it below ~5% opacity. |
| **Type-driven layout** (huge display type, grid, small uppercase labels) | CSS, variable fonts | S | Very low | Mat Voyce, Dennis Snellenberg, Corentin Bernadou all rely on it (section 1). Highest value-for-cost item. |
| **Smooth scroll** | Lenis (MIT, a few KB, works with GSAP ScrollTrigger and syncs WebGL) | S | Low | Lenis wraps native scroll so sticky and anchors keep working; respects `prefers-reduced-motion` by default; recommended GSAP wiring is documented at https://github.com/darkroomengineering/lenis |
| **Scroll-triggered motion / sticky storytelling / pinned sections** | GSAP ScrollTrigger | M | Low to medium | GSAP is now fully free including plugins ("GSAP is now 100% free for all users, thanks to Webflow's support", https://gsap.com/pricing/ ; the page does not spell out commercial licence terms, so check the licence text). |
| **Native CSS scroll-driven animations** | CSS `animation-timeline: scroll()/view()` | S | Very low (can run off the main thread). | Chrome 115, Edge 115, Safari 26, Firefox in preview per https://developer.chrome.com/docs/css-ui/scroll-driven-animations . Good for progress bars and simple reveals, with a fallback. |
| **Split-text reveals** | GSAP SplitText (chars, words, lines, `mask` option, auto re-split on font load, `aria-label` added automatically) | S | Low | https://gsap.com/docs/v3/Plugins/SplitText/ . The docs do not discuss reduced motion; wrap in `gsap.matchMedia()`. |
| **Reduced-motion handling in GSAP** | `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)` and `reduce` branches; auto-reverts | S | None | https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/ |
| **Magnetic buttons / custom cursor** | GSAP quickTo, or Framer Motion springs | S | Low | Cursor-following mask in Corentin Bernadou's menu (abduzeedo link above). Disable on touch and for `prefers-reduced-motion`. I could not confirm magnetic buttons on Dennis Snellenberg's site **(unverified)**. |
| **Page transitions** | PJAX (Corentin), Swup (Joffrey Spitzer), Next.js App Router + Framer Motion, or the View Transitions API | M | Low to medium | Same-document View Transitions are Baseline Newly available since 14 Oct 2025, Firefox 144 added them (https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available). Cross-document: Chrome/Edge 126, Safari 18.2, Firefox not supported at last report (https://developer.chrome.com/blog/view-transitions-in-2025 , search summary; check MDN tables before relying on it). Firefox has no view-transition types. |
| **Theme switch animation** (circular reveal from the toggle) | `document.startViewTransition()` + animated `clip-path` on `::view-transition-new(root)`; fall back to an instant swap | S | Low, but snapshots can stutter on very complex pages | Pattern and gotchas (`flushSync` in React, disable the default cross-fade, respect reduced motion): https://dev.to/praveen-sripati/i-stole-this-awesome-ripple-effect-from-ant-design-and-you-can-too-2mkg and https://minhvo.is-a.dev/projects/react-theme-switch-animation . MDN's own page has no theme example (https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API). If a 3D scene is on the page, also tween its colour uniforms to the new theme. |
| **Preloader** | GSAP timeline, or R3F `useProgress` | S to M | Low, but it adds time before first interaction | Huy Phan, Maria Vasilyeva, Ameen Abdullah and Weisdevice all have one. Keep it short, and keep the HTML content and LCP element outside it. |
| **Horizontal scroll section** | GSAP ScrollTrigger pin, or CSS scroll-snap | M | Medium: pinning plus long sections get janky on mobile | Use for the work list only, and provide a normal vertical layout on small screens. |
| **Image distortion on hover** | OGL or Three.js plane with a displacement uniform, or curtains.js | M | Medium to high if many planes render at once | Codrops tutorial: https://tympanus.net/codrops/?p=44003 . One curtains.js demo is rated poor at graceful degradation: if WebGL fails the container stays empty (https://freefrontend.com/code/webgl-lens-distortion-hover-2026-04-29/). Keep the real `<img>` in the DOM as the fallback. |
| **Marquee** | CSS keyframes, or GSAP | S | Low | Mat Voyce's logo row (markup shows the set repeated 4 times). Pause on hover and under reduced motion, because it starts automatically (see WCAG 2.2.2 below). |
| **Blender-baked 3D scene** | Blender, glTF + Draco, KTX2 | L | Controlled by asset budget | Bruno Simon's repo documents glTF-Transform and KTX/ETC1S compression (https://github.com/brunosimon/folio-2025). |
| **WebGPU renderer with WebGL fallback** | Three.js `WebGPURenderer`, TSL | M | Varies; profile first | About 87% browser support, falls back to WebGL 2 automatically, but some users report slower results (https://www.utsubo.com/blog/threejs-best-practices-100-tips). Bruno Simon exposes it as an option. |

### Performance rules worth adopting (sourced)
- Cap pixel ratio: `Math.min(devicePixelRatio, 2)`; a 3x phone renders 9x the pixels of a 1x screen. Mobile draw-call budget "<100 draw calls and <100,000 vertices" (Don McCurdy, quoted in https://www.utsubo.com/blog/threejs-best-practices-100-tips).
- Instancing for repeated meshes; KTX2 textures (4 to 8x less GPU memory); Draco for geometry; call `dispose()` on geometries, materials and textures (same source).
- R3F: `frameloop="demand"` so the loop only renders when something changes; `PerformanceMonitor` to lower `dpr` when FPS drops; instancing under "a few hundred" (https://r3f.docs.pmnd.rs/advanced/scaling-performance).
- Shadows: a point-light shadow renders the scene six times; avoid on mobile (same Utsubo guide).
- Pause the render loop when the canvas is off-screen or on text-heavy pages (Weisdevice practice, via creativedevjobs).
- Lenis and GSAP: drive Lenis from GSAP's ticker and set `gsap.ticker.lagSmoothing(0)` (https://github.com/darkroomengineering/lenis).

---

## 3. Anti-patterns, accessibility and performance

### What makes a site feel like a template or "AI slop"
- Purple/indigo gradients, gradient-filled headline text, glassmorphism everywhere, floating gradient orbs behind the hero, a bounce on every hover (https://vibecodekit.dev/ai-slop-design , https://www.sailop.com/blog/anti-slop-prompt-template-2026 ; secondary and partly promotional sources, so treat as heuristics).
- The default layout: centred badge, headline, then three identical feature cards (same sources).
- Inter as the only typeface with no hierarchy beyond size. This is a heuristic from the same sources; your CLAUDE.md brand file is separate and not part of this research.
- Effects "bolted on rather than choreographed", plain fades or hard cuts between states, a polished template with no point of view (https://www.hontran.dev/blog/best-award-winning-websites-2026).
- A weak static hero frame: "if the static hero frame is weak, the motion is hiding weak art direction" (same source; it is a juror-style heuristic from a vendor blog).
- Random particle fields or a spinning blob that has nothing to do with the content. This is my own inference from the above; the sources only say effects should be choreographed.
- Hiding content behind a game or a scavenger hunt (Bruno Simon's page has no project gallery or text alternative; the creativedevjobs list shows several "collect items to learn about me" sites).

### Accessibility
- `prefers-reduced-motion` is Baseline "Widely available" (https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion). MDN recommends replacing large scaling and panning with muted effects such as fades, not removing all feedback.
- WCAG 2.2.2 Pause, Stop, Hide (Level A): anything that moves, blinks or scrolls automatically and lasts over 5 seconds needs a control, and content triggered by hover, focus or scroll-into-view still counts as starting automatically (https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html). Relevant to marquees, looping 3D and background particle fields.
- WCAG 2.3.3 Animation from Interactions (Level AAA): non-essential motion animation triggered by interaction should be switchable. Parallax is named as a typical non-essential case; extra animation added to scrolling must be optional (https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html).
- Real data point: the Awwwards Developer Award accessibility sub-scores for recent winners are the weakest line: Maria Vasilyeva 6.4, Huy Phan 7.0, LPAS 7.0 versus Animations 8.0 to 8.2 (pages linked in section 1). Even winning sites under-invest here, so it is an easy place to stand out.
- SplitText adds an `aria-label` to the parent and `aria-hidden` to the children by default, so screen readers do not read letter by letter (https://gsap.com/docs/v3/Plugins/SplitText/).
- Lenis disables smoothing under reduced motion by default (https://github.com/darkroomengineering/lenis).
- Keep a DOM text version of every canvas-only message. Canvas content is invisible to screen readers and search engines. **(my inference; not from a fetched source)**

### Performance
- LCP thresholds: good 2.5 s or less, poor over 4.0 s at the 75th percentile (https://web.dev/articles/lcp). The LCP candidate list on that page names images, video posters, background images and text blocks, and does not list `<canvas>`, so I would not count on the canvas as the LCP element. Make a text heading or an image the LCP element, and let the 3D scene hydrate after. Treat the canvas question as **(unverified)** and measure in Lighthouse.
- Web fonts can delay text LCP (same page); preload the display font.
- Failure modes named by a juror-style post: a 3D hero at about 18 fps on a mid-range Android, and a 9 MB page taking six seconds to paint (https://www.hontran.dev/blog/best-award-winning-websites-2026). Their advice: throttle the CPU 4x in DevTools and check you can hold about 60 fps, and test the reduced-motion path.
- Always offer a static or lower-quality fallback: Bruno Simon has a "Low" quality toggle and a renderer option. A portfolio can go further and show a poster image when WebGL or reduced-motion is detected.
- Lazy-load the 3D bundle (`next/dynamic` with `ssr: false` is the usual Next.js route; **unverified for your Next version, check the bundled Next docs under `node_modules/next/dist/docs/`**).

---

## 4. Developer portfolio structure and "selected work"

### Sections most developer portfolios use
From a 23-site roundup (https://reallygooddesigns.com/developer-portfolio-examples/): About (short bio), Work/Projects (main showcase), Contact (form or links, often in the footer). Less common extras: Services, Blog, Testimonials, Awards. One-page layouts with anchor links are common. Interactive hero sections with 3D shapes or illustration are a recurring pattern, as are dark/light toggles and minimal full-screen menus.

Concrete single-page flow seen on Dennis Snellenberg's site (https://dennissnellenberg.com): greeting, hero ("Freelance Designer & Developer" plus one line of positioning), four recent-work cards with title, category and year, "More work (11)" link, then a "Let's work together" contact block, then a footer with local time and a "Code by" credit. This is the cleanest template-free structure I found.

Suggested outline for you (my synthesis, not a sourced claim): Hero, Selected work (4 to 6 projects), About, Experience timeline, Contact, with a "more work" archive page. Your own React Native and mobile angle is a differentiator, because most reference sites are web-only. Phone-frame mockups or a live device preview could replace the usual browser mockups.

### How top sites present selected work
- **Card grid with category and year, linking to case-study pages:** Dennis Snellenberg, Lusion (ten cards with tags plus "See all projects"). Fast, readable, SEO-friendly.
- **Previews inside the WebGL layer:** Corentin Bernadou puts project previews into a homepage WebGL geometry while keeping a flat typographic layer (abduzeedo link above). Premium but needs a plain-HTML fallback.
- **Animated previews (video or GIF) with "View project":** Mat Voyce (fetched page above).
- **Dedicated project page types with gallery and case study:** Awwwards lists "Project gallery" and "Case Study" as distinct elements on Huy Phan's and Maria Vasilyeva's pages (links in section 1).
- **Per-project accent colour:** Arnaud Rocca (snippet only, unverified).
- **Windowed or folder metaphors:** Weisdevice (four thumbnails, "More" link per project).
- **A "stack used" line per project:** common on developer portfolios (Jesse Martinez in the reallygooddesigns roundup). Weisdevice also lists tools in About.

### Takeaways for a developer, not a studio
1. Spend the 3D budget on one thing: either a hero object or work previews. Not both. (Pattern across Corentin Bernadou, Huy Phan, Minh Pham.)
2. Motion system first (GSAP + Lenis), WebGL second.
3. Type, grid and a two-colour palette do most of the premium work (Huy Phan: #FF4949 and #181818; Maria Vasilyeva: #131313 and #F9F9F9).
4. Treat content as plain HTML first: project titles, role, stack and links are text, with the canvas as enhancement.
5. Add a developer-specific signature detail: layout grid toggle (Corentin Bernadou), local time, a "Code by" credit, open source on GitHub.
6. A theme toggle is a cheap place to show craft: View Transitions circular reveal plus a 3D scene colour tween.
7. Plan EN/TR content up front. None of the reference sites I fetched show a language switch pattern, so I have no sourced example. **(unverified)**

---

## Sources index (every URL used)
- https://www.awwwards.com/websites/portfolio/
- https://www.awwwards.com/websites/three-js/
- https://www.awwwards.com/websites/developer/
- https://www.awwwards.com/websites/sites_of_the_year/
- https://www.awwwards.com/inspiration/portfolio-sector-32-2025
- https://www.awwwards.com/sites/huy-phan-vol-2
- https://www.awwwards.com/sites/maria-vasilyeva-portfolio
- https://www.awwwards.com/sites/lpas
- https://www.awwwards.com/lusion/
- https://awwwards.com/igloo-inc-case-study.html
- https://www.awwwards.com/sites/copy-dennis-collection
- https://www.utsubo.com/blog/best-threejs-websites-2026
- https://www.utsubo.com/blog/threejs-best-practices-100-tips
- https://www.creativedevjobs.com/blog/best-threejs-portfolio-examples-2025
- https://www.hontran.dev/blog/best-award-winning-websites-2026
- https://abduzeedo.com/corentin-bernadous-webgl-portfolio-blends-swiss-design-and-code
- https://tympanus.net/codrops/2026/03/05/inside-corentin-bernadous-portfolio-swiss-inspired-layouts-webgl-geometry-and-thoughtful-motion/ (403)
- https://tympanus.net/codrops/?p=112139 (403), ?p=108883 (403), ?p=104256, ?p=101800, ?p=44003 (snippets only)
- https://github.com/brunosimon/folio-2025 , https://bruno-simon.com , https://www.mux.com/blog/3d-web-development-and-beyond-a-chat-with-bruno-simon
- https://dennissnellenberg.com , https://matvoyce.tv , https://lusion.co , https://weisdevice.xyz
- https://gsap.com/pricing/ , https://gsap.com/docs/v3/Plugins/SplitText/ , https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/
- https://github.com/darkroomengineering/lenis
- https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API , https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available , https://developer.chrome.com/blog/view-transitions-in-2025 , https://web.dev/articles/lcp
- https://developer.chrome.com/docs/css-ui/scroll-driven-animations
- https://r3f.docs.pmnd.rs/advanced/scaling-performance
- https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html , https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- https://dev.to/praveen-sripati/i-stole-this-awesome-ripple-effect-from-ant-design-and-you-can-too-2mkg , https://minhvo.is-a.dev/projects/react-theme-switch-animation
- https://freefrontend.com/code/webgl-lens-distortion-hover-2026-04-29/
- https://reallygooddesigns.com/developer-portfolio-examples/
- https://vibecodekit.dev/ai-slop-design , https://www.sailop.com/blog/anti-slop-prompt-template-2026
- https://recent.design/?ref=godly (Godly redirect target)
