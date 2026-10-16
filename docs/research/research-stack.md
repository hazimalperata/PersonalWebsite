# Portfolio redesign: technical stack research (as of 2026-10-16)

Method: npm registry (latest tags), official Next.js / React / Motion / R3F docs and release pages, plus web search.
Anything I could not confirm from a primary source is marked "(unverified)".

## 0. Repo baseline (read from package.json / source)

- next 16.2.4, react ^19.2.4, three ^0.184, gsap ^3.15, framer-motion ^12.38, @once-ui-system/core ^1.6.4, sass, @next/mdx + next-mdx-remote, yarn 1.
- `"lint": "next lint"` is BROKEN on Next 16 (command removed). Source: https://nextjs.org/docs/app/guides/upgrading/version-16
- 23 files import @once-ui-system (Once UI is the whole UI layer, not a thin dependency).
- Pages are not i18n'd: `src/app/(main)/...`, MDX projects live in `src/app/(main)/work/projects/*.mdx`, plus `[slug]/page.tsx`.
- `EarthScene.tsx` is vanilla three, imperative `useEffect`, EffectComposer from three-stdlib + UnrealBloomPass, GSAP ScrollTrigger, framer-motion overlay.

## 1. Current versions (npm registry, 2026-10-16)

| Package | Latest | Notes |
|---|---|---|
| next | 16.4.2 | 16.4 released 2026-10-06 (https://nextjs.org/blog/next-16-4). Ships React 19.3. |
| react | 19.3.1 | `<ViewTransition>` + Fragment refs stable (https://react.dev/blog/2026/09/09/react-19-3) |
| three | 0.186.1 | repo has ^0.184 |
| @react-three/fiber | 9.8.2 (released 2026-10-15) | peer `react >=19 <19.4`, `three >=0.156`. v10 is still alpha (alpha.5, WebGPU/TSL focus) |
| @react-three/drei | 10.7.9 | peer react ^19, three >=0.159, fiber ^9 |
| @react-three/postprocessing | 3.2.0 | peer fiber >=9.7.0, `postprocessing ^6.36` |
| motion (framer-motion successor) | 14.3.0 (2026-10-15) | repo's framer-motion 12 is 2 majors behind; see section 2 |
| gsap | 3.15.0 | "Standard no charge license" in the npm license field |
| @gsap/react | 2.1.2 | `useGSAP` hook |
| lenis | 1.3.27 | `lenis/react` entry (ReactLenis). Old @studio-freight/* packages are legacy |
| next-intl | 4.14.9 | peer next 12..16 |
| next-themes | 0.4.6 | still the same version, effectively unmaintained (section 4) |
| tailwindcss | 4.3.3 | CSS-first config |
| @next/mdx | 16.4.2 | |
| ogl | 1.0.11 | ~423 KB unpacked (small, WebGL-only) |

## 2. 3D: R3F vs vanilla three, alternatives

### Compatibility with React 19 / Next 16

- R3F major must match React major: v8 with React 18, v9 with React 19 (https://r3f.docs.pmnd.rs/getting-started/installation).
- R3F 9.8.0 added React 19.3 support (https://github.com/pmndrs/react-three-fiber/releases). 9.8.1 adds Activity support and renderer disposal on Canvas unmount. 9.8.2 fixes `frameloop="demand"` object-removal and auto pixel-ratio updates across displays.
- Recommendation: use fiber 9.8.x, not the v10 alpha. v10 targets WebGPU/TSL and is explicitly "experimental and subject to change".
- Docs say to add `three` to `transpilePackages` if an add-on ships untranspiled code. With Turbopack this is rarely needed for current drei, but harmless. (I did not find a Next 16 + R3F 9 incompatibility report. A search found no source testing them together explicitly, so treat as "works in practice, verify in a spike".)
- Peer-range trap: fiber `react <19.4`. If Next later bumps to React 19.4, expect a peer warning until R3F updates.

### SSR pitfalls (known R3F/Next behaviour)

- `<Canvas>` needs a Client Component (`"use client"`). It renders a wrapper div on the server and creates the WebGL context only after mount, so plain SSR does not crash. The real problems are:
  1. Importing three/drei in a Server Component, which fails.
  2. Hydration mismatches from `window` / `matchMedia` reads during render. Read those in effects or `useSyncExternalStore`.
  3. 3D bundle weight in the main chunk.
- `next/dynamic({ ssr: false })` is only allowed in Client Components. In a Server Component it is a build error (https://nextjs.org/docs/app/guides/lazy-loading). Pattern: `Hero3DLoader.tsx` ("use client") does `dynamic(() => import('./Hero3D'), { ssr: false, loading: () => <Poster/> })`, and the Server Component page renders `<Hero3DLoader/>`.
- In Next 16.4 there is also `experimental.turbopackLazyDynamicImports` (dev-only compile deferral). Not needed.
- Strict Mode and Activity: R3F 9.8 handles both. Unmounting a Canvas now disposes the renderer.

### R3F vs vanilla three for a portfolio

- Keep vanilla when: one self-contained, scroll-scripted scene (like the current Earth page), heavy custom shader/postprocessing, you want the smallest JS, or you do not need React state driving the scene.
- Use R3F when: several scenes across routes, the 3D should react to React state (theme, locale, hover on DOM cards, route transitions), you want drei helpers (`Environment`, `Float`, `PerformanceMonitor`, `AdaptiveDpr`, `Preload`, `useGLTF` + Draco/meshopt, `View`), and declarative cleanup (the current `EarthScene` is ~hundreds of lines of manual dispose/cleanup).
- Cost: R3F + drei adds React reconciler overhead and roughly 40-60 KB gz before tree-shaking (unverified figure). Acceptable if lazy-loaded.
- Suggested hybrid: migrate to R3F for the new hero and shared 3D, and port the Earth scene to R3F only if it is kept as a flagship page. Do not rewrite it just to rewrite it.
- Hero uses `@react-three/drei` `<View>` if you want one canvas serving several DOM-anchored 3D bits (avoids multiple WebGL contexts, important on iOS Safari which limits contexts).

### Postprocessing

- Use `@react-three/postprocessing` 3.2 (wraps pmndrs/postprocessing 6.36+), not three-stdlib EffectComposer. It merges effects into fewer passes.
- WebGPU caveat: EffectComposer and pmndrs/postprocessing do NOT run on `WebGPURenderer` (third-party migration guide: https://www.utsubo.com/blog/webgpu-threejs-migration-guide, unverified against official docs). Stay on WebGL renderer for now. WebGPURenderer falls back to WebGL2 automatically (https://threejs.org/docs/pages/WebGPURenderer.html) but custom ShaderMaterial code needs TSL porting.
- Keep effects minimal on the hero (Bloom + Vignette/Noise at most), disable on mobile.

### Lighter alternatives

| Option | Size | Best when |
|---|---|---|
| OGL 1.0.11 | ~423 KB unpacked (a few tens KB gz, unverified) | One full-screen shader/mesh hero (gradient mesh, particles, liquid distortion). No scene-graph needs |
| three + one ShaderMaterial on a plane, no R3F | three tree-shaken ~150 KB gz (unverified) | Shader background with DOM text on top. Cheapest path if you already have three |
| Raw WebGL/regl or a tiny fragment shader on `<canvas>` | <5 KB | Pure gradient/noise background |
| CSS 3D transforms / `perspective` + SVG filters | 0 KB | Tilt cards, parallax, fake depth. Often indistinguishable on mobile |
| Pre-rendered video/Lottie/AVIF sequence | asset only | Mobile + reduced-motion fallback for the hero |
| Spline/Rive | runtime 100s KB | Only if a designer authors it. Not recommended for a dev portfolio |

Recommendation for a "premium" feel: one well-lit R3F hero (Environment-lit glass/metal object or shader particles) + CSS/GSAP motion everywhere else. Do not use WebGL for every section.

## 3. Motion: Motion vs GSAP, Lenis, View Transitions

### Motion (formerly framer-motion)

- Package `motion` (import from `motion/react`). Latest 14.3.0 (2026-10-15). framer-motion 12 line ended at 12.43 (2026-07-27) per https://motion.dev/changelog. Both v13 and v14 shipped since; v13 removed the optional `@emotion/is-prop-valid` dependency (smaller), v14.0.0 removed internal APIs restored in 13.5.1.
- Changelog items relevant here: 13.4.0 added `AnimateView` (View Transitions wrapper built on React 19.3 `ViewTransition`); 13.1.1/13.4.x React 19 Strict Mode and AnimatePresence fixes; 14.2.0 hardware-accelerated independent transforms (x, y, scale); 14.1.0 `animateLayout` for vanilla JS; 13.2.0 `threeEffect`/`animate.addEffect()` (unverified what it covers).
- Migration from framer-motion 12: change imports to `motion/react`, check release notes for 13/14 breaking changes (v14 is a "removes internal APIs" major). Low risk for typical usage (motion.div, variants, AnimatePresence, useScroll, useTransform).
- Best at: React component state animations (enter/exit via AnimatePresence, layout animations, gestures/hover/tap, springs, `useScroll` + `useTransform` for simple scroll-linked values), `LazyMotion` + `domAnimation` for small bundles.

### GSAP

- Fully free including ScrollTrigger, SplitText, ScrollSmoother, MorphSVG, etc. The Club plugins became free after Webflow's acquisition; GSAP CDN notes say every plugin is free since 3.13 (https://gsap.com/resources/Webflow/, https://webflow.com/updates/gsap-becomes-free). npm license field for 3.15.0: "Standard 'no charge' license: https://gsap.com/standard-license". Note the license still forbids building a competing visual animation tool (read it, not an issue for a portfolio). The exact date of the change is not confirmed by a single source (unverified: 2025-04-30).
- SplitText was rewritten (smaller, accessibility aware, `aria` handling) (Webflow post above).
- Best at: timeline choreography, scroll-driven pinned/scrubbed storytelling (ScrollTrigger), text splitting reveals, SVG/morph, anything imperative or multi-element sequenced, driving three.js uniforms/camera.
- Use `@gsap/react` `useGSAP()` for scoped cleanup in React 19 Strict Mode. Register plugins once in a client module.

### Using both

- Division of labour that works: Motion for component-level UI (mount/unmount, hover, layout, route-level fades via AnimatePresence if not using View Transitions). GSAP for hero/scroll storytelling + SplitText + WebGL camera/uniform tweens. Never animate the same property of the same element with both.
- Bundle: Motion with LazyMotion ~5-20 KB gz; gsap core ~27 KB gz + ScrollTrigger ~12 KB gz + SplitText (figures approximate, unverified).
- Alternative that reduces dependencies: GSAP only (+ CSS for hovers) and drop Motion. The repo already has both; keeping both is fine.

### Lenis

- Active: lenis 1.3.27, MIT, repo darkroomengineering/lenis (~16.6k stars), has a V2-ROADMAP.md (https://github.com/darkroomengineering/lenis).
- React: `import { ReactLenis } from 'lenis/react'` with `root`; import `lenis/dist/lenis.css`. `@studio-freight/react-lenis` is legacy (secondary sources: https://dev.to/codebucks/a-developers-guide-to-smooth-scrolling-and-parallax-in-nextjs-using-lenis-and-gsap-1j0).
- GSAP sync (from README): `lenis.on('scroll', ScrollTrigger.update)`; `gsap.ticker.add((t) => lenis.raf(t * 1000))`; `gsap.ticker.lagSmoothing(0)`. With ReactLenis use `autoRaf: false` and a ref, then drive via gsap.ticker.
- `respectReducedMotion` defaults to true (smoothing off for reduced-motion users). Anchor links need `anchors: true`. `smoothTouch` was removed; use `syncTouch` (unverified details, from a third-party guide). Safari caps at 60 fps, 30 fps in low power mode. No CSS scroll-snap (use `lenis/snap`).
- Next 16 note: Next no longer overrides `scroll-behavior` on navigation; if you set `scroll-behavior: smooth` globally add `data-scroll-behavior="smooth"` to `<html>`. With Lenis do not use CSS smooth scroll at all.
- Existing `ScrollToHash.tsx` in the repo will conflict with Lenis anchors. Replace with Lenis `scrollTo`.
- Judgment: Lenis gives the premium "weighty scroll" feel but costs accessibility/native-feel; disable on touch (or let `syncTouch` default off), and for reduced motion.

### View Transitions in Next 16 / React 19.3

- `<ViewTransition>` is STABLE in React 19.3 (https://react.dev/blog/2026/09/09/react-19-3). Next 16.4 ships React 19.3. Next docs (updated 2026-10-15) say: "View transitions work in the App Router with no configuration." (https://nextjs.org/docs/app/guides/view-transitions). So `experimental.viewTransition: true` is no longer needed on 16.4 (the flag page 404'd; secondary sources describing the flag predate 19.3).
- Features in Next: `<Link transitionTypes={['nav-forward']}>`, `router.push(..., { transitionTypes })`, `addTransitionType`. Shared-element morph via `<ViewTransition name="project-{id}">` on card image and detail hero. Works best with prefetched/cached pages. If destination suspends into a fallback, no morph pair forms (documented).
- Animations only fire inside Transitions (route navigations, Suspense reveals, `useDeferredValue`, `startTransition`), not plain `setState`.
- Put `<ViewTransition>` in `page.tsx`, not `layout.tsx` (layouts persist so enter/exit never fire).
- Browser support: needs transition types and `view-transition-class` (Chromium 125+, recent Safari/Firefox). Without support, app works with no animation.
- Must add `::view-transition { pointer-events: none }` and a `prefers-reduced-motion` block (Next guide shows both). Named elements are skipped by hit-testing during the transition.
- Motion's `AnimateView` (13.4+) is a wrapper for the same API. I did not verify its ergonomics. Plain `<ViewTransition>` + CSS is enough.
- Gotcha for 3D: a persistent WebGL canvas should sit in a layout and be excluded from transitions (give it a fixed `view-transition-name` with `animation: none`, like the Next guide's header trick), otherwise the snapshot freezes/crossfades the canvas.

## 4. i18n (EN default, TR)

### Options

| | next-intl 4.14.9 | Lingui | Paraglide (paraglide-next/JS) |
|---|---|---|---|
| App Router / RSC support | First class | Via macros, extra extract/compile step; more manual (https://intlayer.org/en-GB/blog/nextjs-internationalization-using-lingui) | Compiler-generated typed functions, near-zero runtime; own message format, not ICU. paraglide-next status for Next 16: unverified |
| Routing | Built-in (`defineRouting`, `proxy.ts`, `createNavigation`) | None, DIY | DIY or adapter (unverified) |
| Static rendering | Yes. 16.3+ with `next/root-params` (recommended), `setRequestLocale` is now "legacy" | DIY | DIY |
| Fit | Default for new App Router apps (consensus of https://dev.to/erayg/best-i18n-libraries-for-nextjs-react-react-native-in-2026-honest-comparison-3m8f, https://www.pkgpulse.com/guides/next-intl-vs-react-i18next-vs-lingui-react-i18n-2026) | PO-file/translator workflows | Max type-safety/min bundle |

### Pick: next-intl 4.14.x

Reasons: built-in locale routing, locale-aware `Link`/`useRouter`, typed messages, metadata helpers (`generateMetadata` + `getTranslations`), hreflang alternates, active development tracking Next 16 (peer next ^16).

### Recommended setup (from https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing, fetched 2026-10)

- `src/i18n/routing.ts`: `defineRouting({ locales: ['en','tr'], defaultLocale: 'en' })`. Use `localePrefix: 'as-needed'` if you want `/` = English and `/tr/...` for Turkish (option documented in next-intl config, I did not re-fetch that page this session: unverified exact wording). Otherwise `/en` and `/tr` always-prefixed, which matches the user's "/en, /tr" request.
- `src/proxy.ts` (NOT middleware.ts on Next 16): `export default createMiddleware(routing)` with matcher excluding `api|trpc|_next|_vercel|.*\\..*`. Docs say: "proxy.ts was called middleware.ts up until Next.js 16". Proxy runtime is Node.js (no edge).
- `src/i18n/navigation.ts`: `createNavigation(routing)`.
- `src/i18n/request.ts`: read the locale from `next/root-params` (default-on from Next 16.3, `experimental.rootParams` before), validate with `hasLocale`, `notFound()` otherwise.
- Move all layouts/pages under `src/app/[locale]/`. `generateStaticParams` returns both locales to prerender everything.
- With `next/root-params` the `[locale]` segment must be a ROOT param: no `app/layout.tsx` above `[locale]/layout.tsx`; the `[locale]` layout owns `<html lang>`/`<body>` (per https://aurorascharff.no/posts/implementing-nextjs-16-use-cache-with-next-intl-internationalization/ and https://github.com/aurorascharff/next-intl-cache-components). Non-locale routes (`/api/og`, `robots.ts`, `sitemap.ts`) stay outside it, which requires them to be in a separate root layout group or route handlers (which do not need layouts).
- `setRequestLocale` vs root-params: sources conflict about whether setRequestLocale can be fully dropped (unverified). The official page labels it legacy.
- Content: UI strings in `messages/en.json`/`tr.json`; MDX project pages per locale: `content/projects/<slug>.en.mdx` / `.tr.mdx` (or `content/{en,tr}/projects/<slug>.mdx`), loaded via dynamic `import()` with a fallback to EN when TR is missing.
- SEO: `alternates.languages` in metadata, localized `sitemap.ts` entries, `<html lang>` per locale.
- Language switch: use next-intl's `useRouter().replace(pathname, { locale })`, wrap in a `ViewTransition` type if desired.
- Cache Components interaction: next-intl issue #1493 tracked `cacheComponents` support (https://github.com/amannn/next-intl/issues/1493), status stale. A demo repo (https://github.com/aurorascharff/next-intl-cache-components) shows `cacheComponents: true` + root params working on 16.2+, but you must pass `locale` explicitly to `getTranslations({locale, namespace})` inside `"use cache"` (unverified for 4.14.9). Safe default: do NOT enable cacheComponents initially (section 7).

## 5. Theme

- next-themes 0.4.6: still the most-used, but unmaintained; React 19 prints dev-only "Encountered a script tag while rendering React component" warning (https://github.com/pacocoursey/next-themes/issues/387, #397; shadcn issue #10104). It is a console warning in dev, functionality is fine (reports say dev-only; unverified in prod).
- Alternatives: `@teispace/next-themes` (fork, drop-in) and `@wrksz/themes` (rewrite using `useServerInsertedHTML`) (https://dev.to/wrksz/i-was-tired-of-next-themes-being-abandoned-so-i-built-a-drop-in-replacement-4dbk). Both small third-party, vet before adopting (unverified).
- Zero-dependency option (my recommendation for a portfolio): hand-roll. 30 lines: inline blocking script in `<head>` (via `<script dangerouslySetInnerHTML>` in the `[locale]` layout, which is a Server Component, so no React 19 warning because it is server-rendered HTML) reading `localStorage`/`prefers-color-scheme` and setting `data-theme` on `<html>` before paint; `suppressHydrationWarning` on `<html>`; `ThemeProvider` context with `useSyncExternalStore`. Avoids flash and the dependency.
- If you keep next-themes: `attribute="data-theme"`, `defaultTheme="system"`, `disableTransitionOnChange` (conflicts with animated switch, see below), and put `suppressHydrationWarning` on `<html>`.
- Once UI has its own theme system (`data-theme`, `data-neutral`, etc., via its `Providers`/`ThemeProvider` and `once-ui.config.ts`). Replacing Once UI means replacing that.

### Animated theme switch (View Transitions circle reveal)

Pattern (multiple sources: https://rebeccamdeprey.com/blog/view-transition-api, https://dev.to/praveen-sripati/i-stole-this-awesome-ripple-effect-from-ant-design-and-you-can-too-2mkg):
1. On click, compute origin = button center, `r = Math.hypot(max(x, innerWidth-x), max(y, innerHeight-y))`.
2. `const t = document.startViewTransition(() => flushSync(() => setTheme(next)))` (flushSync so React commits the DOM class/attribute change synchronously inside the callback. For the hand-rolled setter you can set the attribute directly, no flushSync needed).
3. `await t.ready`; `document.documentElement.animate({ clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] }, { duration: 500, easing: 'cubic-bezier(.4,0,.2,1)', pseudoElement: '::view-transition-new(root)' })`.
4. CSS: `::view-transition-old(root), ::view-transition-new(root) { animation: none; mix-blend-mode: normal; }`; for dark-to-light reverse put new on top (z-index) accordingly.
5. Guards: `if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) { setTheme(next); return; }`.
- No source I found shows next-themes + this combination explicitly; the flushSync detail is my own known-pattern (unverified in this exact stack). Avoid `disableTransitionOnChange` interplay problems by doing the swap yourself.
- Gotcha: this root-level transition also snapshots the WebGL canvas. Make the canvas react to the theme via a uniform/color (read CSS variable or context), not by re-mounting.

## 6. Styling and fonts

### Styling choice

| Option | Pros | Cons |
|---|---|---|
| Tailwind v4 (4.3.3) | CSS-first `@theme` tokens, `@tailwindcss/postcss` works with Turbopack (https://nextjs.org/docs/app/guides/tailwind-css), fast iteration, dominant in premium portfolio templates (shadcn/ui, Magic UI, Aceternity, etc.) | Replaces Once UI's layout primitives; class-heavy; need to design every primitive |
| Keep SCSS modules | Already in repo (Header, Footer, ProjectCard...), no migration, great for bespoke art-directed pages | Slower to build many variants, no utility-driven theming |
| Once UI (core 1.6.4) | Ready components, tokens, theming, MDX styling already wired in `mdx.tsx` | 23 files coupled; a generic "Once UI look" is hard to make look premium/unique; its own CSS layer + theme system; Tailwind v4 compat not verified (unverified) |

Recommendation: Tailwind v4 for the new design with design tokens as CSS variables in `@theme` (so light/dark and the 3D scene read the same variables), plus plain CSS/CSS-modules for bespoke effects. Phase Once UI out (or keep only for MDX typography until replaced). Do not mix Once UI's global reset with Tailwind preflight without isolating (class/reset collisions: unverified but likely). `@tailwindcss/typography` suits the MDX pages (Next docs recommend it).
Alternative if the user wants minimum rewrite: keep SCSS modules + Once UI, restyle with new tokens. Slower to reach "premium".

### Fonts (next/font)

- `next/font/google` self-hosts at build, zero layout shift. Variable fonts need no `weight`; extra axes via `axes` (https://nextjs.org/docs/app/api-reference/components/font).
- Inter on Google Fonts has `opsz` and `wght` axes (https://fonts.google.com/specimen/Inter), so "Inter Display" look = `opsz` high end via `axes: ['opsz']` + `font-optical-sizing: auto` (axes behaviour per Next docs; exact opsz range not captured: unverified).
- Geist is on Google Fonts (https://fonts.google.com/specimen/Geist); OFL license (unverified, from memory; the `geist` npm package by Vercel is also OFL). Geist Mono is good for code/labels.
- Licensing notes:
  - Satoshi, Clash Display (and most Fontshare fonts): free for personal and commercial use under the ITF Free Font License, but the license restricts redistribution/modification and recommends/asks crediting ITF, and some sources say files should not be in public repos (https://www.indiantypefoundry.com/news/introducing-fontshare, https://wiki.adom.inc/api/pages/adom/adom-theme/files/fonts/LICENSES.md; third-party, verify at https://www.fontshare.com/terms). Self-hosting via `next/font/local` puts WOFF2 on your own domain, which most readings treat as embedding (OK), but committing the files to a PUBLIC GitHub repo may count as redistribution: private repo or download at build time is safer (unverified legal conclusion).
  - PP Neue Montreal (Pangram Pangram): "free to try" (personal/trial) but commercial licenses start at $40; web font license terms/pricing not stated on the product page (https://pangrampangram.com/products/neue-montreal). A portfolio that markets your services counts as commercial: buy the web license or avoid.
- Safe premium stack with no license risk: Display = Bricolage Grotesque / Instrument Serif / Fraunces (all Google, OFL) or Inter with opsz; Body = Inter or Geist; Mono = Geist Mono / JetBrains Mono. If a distinctive grotesk is wanted, Satoshi or Clash Display via Fontshare with `next/font/local` and a private repo.
- Subset `latin` + `latin-ext` (Turkish needs ğ ş ı İ ö ü ç: confirm the chosen font covers them, Clash/Satoshi do per Fontshare listing (unverified)). Use `display: 'swap'` + `adjustFontFallback`, preload only 1-2 weights.

## 7. Performance checklist for a WebGL hero on Vercel

Sources: https://r3f.docs.pmnd.rs/advanced/scaling-performance, https://nextjs.org/docs/app/guides/lazy-loading, plus agency blogs (https://www.hontran.dev/blog/core-web-vitals-for-animation-heavy-sites, https://www.utsubo.com/blog/webgl-three-js-site-seo-rankable-guide: vendor opinions).

1. LCP element must NOT be the canvas. Make the headline text (and/or a static poster `<Image priority fetchPriority="high">`) the LCP; server-render it. Canvas fades in on top after the first frame (opacity transition, no layout shift: reserve the size with CSS aspect-ratio / fixed height).
2. Load the 3D bundle lazily: `dynamic(() => import('./Hero3D'), { ssr: false })` from a Client Component wrapper; mount it after `requestIdleCallback` / first paint / when visible via IntersectionObserver. Use `<Preload>` sparingly. Assets: GLB with Draco/meshopt + KTX2 textures (`gltf-transform` pipeline), HDR env as small `.hdr`/`.exr` or use drei `Environment preset` only if you accept its CDN fetch (self-host to avoid third-party fetch).
3. DPR cap: `<Canvas dpr={[1, 1.5]}>` (max 2 on desktop). Add `<PerformanceMonitor onDecline={() => setDpr(1)}>` or `<AdaptiveDpr pixelated />`. R3F 9.8.2 now auto-updates DPR when moving across displays.
4. On-demand rendering: `frameloop="demand"` for static/slow scenes, call `invalidate()` from GSAP/ScrollTrigger updates and pointer handlers; for always-animated hero use `frameloop="always"` but PAUSE (`frameloop="never"`) when the canvas is offscreen (IntersectionObserver) or the tab is hidden (R3F pauses via rAF when hidden).
5. Keep draw calls low (<~1000, ideally a few hundred) with `<Instances>`/`InstancedMesh`; avoid shadows (use baked/contact shadows), limit lights, `powerPreference: 'high-performance'`, `antialias` only if no postprocessing (use SMAA/MSAA in composer instead), `stencil/depth` off when unused.
6. Postprocessing: 1-2 effects, `multisampling={0}`, half-res bloom, disable on mobile/low tier.
7. Reduced motion: `matchMedia('(prefers-reduced-motion: reduce)')` -> render static poster (or one still frame with `frameloop="demand"` and no autonomous motion), disable Lenis, Motion `MotionConfig reducedMotion="user"`, CSS `@media` for view transitions. Make it reactive (listener) and SSR-safe (default to "no motion" on server, upgrade after mount to avoid hydration mismatch).
8. Mobile fallback: decide with capability, not UA: `matchMedia('(pointer: coarse)')`, `navigator.hardwareConcurrency <= 4`, `navigator.deviceMemory` (Chromium only), `connection.saveData`, plus a quick GPU tier check (`detect-gpu` package: unverified current state). Low tier -> static poster/video (AV1/WebM, <500 KB) or CSS 3D tilt. Third-party sources suggest static image on mobile as the safest CWV trade (vendor opinion).
9. Context loss: handle `webglcontextlost` (R3F `onCreated` -> gl.domElement listener) to fall back to the poster; limit to ONE canvas (use drei `<View>` for extras): iOS Safari kills older contexts.
10. Metrics: INP is the real risk (rAF loops, scroll handlers). Keep GSAP/Lenis on a single ticker, no layout reads in scroll handlers, `will-change` sparingly. Verify with Lighthouse + Vercel Speed Insights + Analytics (`@vercel/analytics` already installed). Next 16 removed First Load JS from `next build` output, so use Turbopack bundle analyzer (16.4 improvements) or `@next/bundle-analyzer`.
11. Vercel specifics: static prerender everything (both locales, SSG), images via `next/image` with AVIF/WebP, GLB/HDR served from `/public` with immutable caching (Vercel caches `/_next/static`; for `/public` set `headers()` `Cache-Control: public, max-age=31536000, immutable` and content-hash filenames), enable Brotli (default). Avoid `output: 'export'` because next-intl proxy and `next/image` optimizer need the server.
12. Fonts: preload one display + one text face, `font-display: swap`.

## 8. Next 16 gotchas (relevant to this repo)

Sources: https://nextjs.org/docs/app/guides/upgrading/version-16, https://nextjs.org/blog/next-16-4.

1. Upgrade first: 16.2.4 -> 16.4.2 (React 19.3.1). Needed for stable `<ViewTransition>`, `next/root-params` default-on (16.3), Turbopack improvements. `npx next@canary upgrade --agent=latest` or codemod `npx @next/codemod@canary upgrade latest`.
2. `next lint` is removed: your `"lint": "next lint"` script fails. Replace with `eslint .` (flat config, you already have `eslint.config.mjs`). `next build` no longer lints. Also remove `eslint` key from next.config if present.
3. `middleware.ts` -> `proxy.ts` (function named `proxy`), Node runtime only, no edge. next-intl's createMiddleware goes in `src/proxy.ts`. If you ever need edge, keep `middleware.ts`.
4. Turbopack is the default for `dev` and `build`. A custom `webpack` config makes `next build` FAIL. Your config has none, good. Sass: Turbopack does not support the `~` prefix in imports. `sassOptions.silenceDeprecations: ['legacy-js-api']` is harmless. sass-loader 16 modern API is used.
5. MDX with Turbopack: `@next/mdx` with function-based remark/rehype plugins does not work; plugins must be given as strings (`'remark-gfm'`, `['rehype-pretty-code', { ...serializable options }]`); options with functions/objects that are not serializable cannot be used (https://nextjs.org/docs/app/guides/mdx). `mdx-components.tsx` at project root (or `src/`) is REQUIRED for the App Router. `.md` support requires `extension: /\.(md|mdx)$/`. Rust compiler `experimental.mdxRs` is "not recommended for production". Frontmatter is not supported by @next/mdx: you currently use gray-matter + next-mdx-remote (server compile, no Turbopack plugin limitation since compiled at runtime/SSG by `next-mdx-remote`'s own unified pipeline). For i18n + per-locale content + syntax highlighting with function plugins, `next-mdx-remote/rsc` (or `compileMDX`) is the lower-friction route. Keep `transpilePackages: ['next-mdx-remote']` only if you hit ESM errors.
6. Async request APIs: `params`, `searchParams`, `cookies()`, `headers()` must be awaited (sync access removed in 16). Dynamic route `[locale]/work/[slug]` -> `const { locale, slug } = await params`. Use `npx next typegen` to get global `PageProps<'/[locale]/work/[slug]'>` types.
7. `cacheComponents` (a.k.a. Cache Components/PPR): Next 16.4 says it becomes the default in Next 17 and `create-next-app` now enables it. Enabling it on an existing app "can surface build errors for uncached data outside of Suspense" and requires adopting the model (docs: migration checklist). For a static portfolio it is optional; start WITHOUT it to avoid next-intl/rootParams interplay risk, and revisit. If enabled: needs Node runtime, no `output: 'export'`, `ensureStatic = 'navigation'` can guard pages from going dynamic.
8. next/image changes: default `qualities` is `[75]` only, `minimumCacheTTL` 4h, `imageSizes` no longer includes 16, local images with query strings need `localPatterns.search`. `images.domains` is deprecated (you already use remotePatterns).
9. Layout/hydration: `<html>` must live in the root layout; with next-intl root params that is `app/[locale]/layout.tsx` (no layout above it). Existing `src/app/layout.tsx`, `src/app/earth/layout.tsx`, `src/app/animation/page.tsx` (staged, new) and `api/og` routes need restructuring. `/earth` and `/animation` experiments can sit under `[locale]` or be excluded from i18n by a proxy matcher.
10. Build engines: Node >= 20.9, TypeScript >= 5.1, browsers Chrome/Edge/Firefox 111+, Safari 16.4+.
11. React Compiler: stable flag `reactCompiler: true` (needs `babel-plugin-react-compiler`), not default, slower builds. With R3F/imperative three code, compiler can occasionally break mutation-heavy code (unverified). Skip initially or opt-out per file with `"use no memo"`.
12. Parallel route slots require `default.js`. Not used here.
13. Next no longer overrides `scroll-behavior` during route changes (see Lenis section).

## 9. Recommended stack (summary)

- next 16.4.x, react 19.3.x, TypeScript 5.x, Turbopack, yarn or pnpm (your call).
- 3D: @react-three/fiber ^9.8.2, @react-three/drei ^10.7.9, @react-three/postprocessing ^3.2.0 (+ postprocessing ^6.36), three ^0.186 (hero only, lazy). Port or leave Earth page as vanilla.
- Motion: `motion` ^14.3 (replace framer-motion), gsap ^3.15 + @gsap/react ^2.1 (ScrollTrigger, SplitText), lenis ^1.3 (optional, desktop only), React `<ViewTransition>` for routes + theme switch.
- i18n: next-intl ^4.14, routes `/en` `/tr`, `proxy.ts`, `next/root-params`, SSG for both locales.
- Theme: hand-rolled `data-theme` provider with blocking script (or `@wrksz/themes`/`@teispace/next-themes` if you prefer a package), circle-reveal via View Transitions.
- Styling: Tailwind v4 (CSS-first `@theme` tokens) + CSS modules for bespoke bits; phase out Once UI.
- Fonts: Inter (opsz) or Geist for text, one display face (Bricolage Grotesque/Instrument Serif via Google, or Satoshi/Clash via next/local with licence caveat), Geist Mono for mono.
- MDX: next-mdx-remote (RSC) + gray-matter frontmatter, per-locale files, custom components map; avoid function-based remark/rehype plugins if using @next/mdx.
- Quality: eslint CLI (flat config), Vercel Analytics + Speed Insights, Lighthouse CI.

## 10. Decisions for the user

1. 3D scope and tech: R3F (new hero + reusable scenes) vs keep vanilla three vs lighter OGL/shader-only hero. Also: is the Earth page a flagship to port, or left as is.
2. Styling/UI-kit direction: go Tailwind v4 and drop Once UI (bigger rewrite, most distinctive result) vs keep SCSS/Once UI and restyle (faster, risk of "template look").
3. Fonts + licensing appetite: free OFL-only stack (Inter/Geist/Bricolage) vs Fontshare (Satoshi/Clash, free but ITF terms, private-repo caveat) vs paid PP Neue Montreal (from ~$40, web license terms unconfirmed). Related: URL scheme (`/en` always-prefixed vs English unprefixed at `/`), and whether smooth scroll (Lenis) is wanted given the accessibility trade-offs.
