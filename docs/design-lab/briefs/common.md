# /lab prototypes — common brief (read fully, then your direction brief)

## Who, why, what success looks like
Hazim Alper Ata, frontend and mobile engineer. CTO of 1likte; builds shipped apps at the agency Tersane Dijital.
His portfolio is being redesigned. Five design directions are built in parallel as working home-page
prototypes, each by a different engineer. He will pick one to become the real site.

- Visitors are both companies that might hire him and clients who might give him work.
- In the first 10 seconds they must believe two things: "he can really build this" and "he works to the highest
  standard".
- The owner's own words, which every direction must express: *"Whatever I take on, I build it to the highest
  standard: serious, real, and done the way modern technology says it should be done."*
- He wants it **impressive, bold and motion-rich**:
  - lots of scroll-driven animation;
  - animated backgrounds;
  - showing off is welcome.
- **Professional** is the bar, not "playful".
- The current live site is too calm. Do not copy it: no earth globe, none of its colours or fonts.
- Motion must feel engineered: smooth (target 60 fps on a mid laptop), precise, connected. A janky or random
  effect contradicts the message.

## Where you work
- Your own git worktree and branch (named in your dispatch). Never touch other worktrees or the main checkout.
- Files you may create or change:
  - `src/app/lab/<N>/` (route: `page.tsx`, optional `layout.tsx` for fonts, CSS module or `.css` imported by your page);
  - `src/lab/d<N>/` (all your components, hooks, shaders, data);
  - `public/lab/d<N>/` (new static assets);
  - `package.json` + `yarn.lock` (only `yarn add <pkg>`, free/open-source only).
- Do NOT edit:
  - `src/lab/facts.ts`, `src/lab/useMotionEnabled.ts`, `src/app/lab/layout.tsx`, `src/app/lab/page.tsx`,
    `src/proxy.ts`;
  - anything in `src/app/[locale]/`, `src/components/`, `src/lib/`, `messages/`, `content/`.
- `/lab` has its own root layout (html/body, Tailwind via `src/app/lab/lab.css`, noindex). It does not include
  the live site's header, footer, theme or fonts. Your page brings its own palette, type and chrome (nav, footer).
- Tailwind 4 is available (utility classes, arbitrary values). CSS variables for your palette go on your page
  root element. Do not add them globally.

## Content (binding)
- Import everything from `@/lab/facts` (`labFacts`). It is verified content. Do not invent:
  - numbers, clients or claims;
  - testimonials, logos, metrics or screenshots.
- Headlines may be rephrased for punch, but the meaning must stay true. "Lorem ipsum" and stock images are
  forbidden.
- Section order, all required:
  1. hero (name, role, the message);
  2. proof (the 4 `proof` facts);
  3. selected work (the 5 `work` items, in order) + the `more` list;
  4. capabilities;
  5. experience;
  6. contact (email, CV link, socials).
- Navigation can be anything that fits your design.
- Screenshots:
  - Dremly and Posme have portrait phone screenshots (`portrait: true`); use device frames.
  - 1likte mobile and seller panel have one wide image each (`portrait: false`).
  - **Rommer has no screenshots that may be shown.** Present it with type, a system diagram or an explicit
    illustration (label it "Illustration"), never with a fake screenshot.
- Links: `href` goes to the case-study pages (`/work/<slug>`, existing site routes) and `links` to the stores.
  External links get `target="_blank" rel="noopener noreferrer"` and visually hidden "(opens in a new tab)".
- English only.

## Motion and quality rules (binding)
- **One motion gate:** `const motion = useMotionEnabled()` from `@/lab/useMotionEnabled`. When it is false
  (prefers-reduced-motion), render every section in its final, readable state:
  - no scroll-jacking, no pinning, no autoplaying loops, no WebGL animation;
  - a static frame or poster is fine;
  - nothing hidden waiting for an animation.
- Server render must show real content (SEO and no-JS): text present in the HTML, animations enhance after
  hydration. Avoid a flash of hidden content: if you hide things before animating, do it only once
  `motion === true` on the client.
- Determinate things never overshoot: counters, progress bars and fills. Use eased tweens, or springs with damping
  ratio ≥ 1. Never animate scale from 0 (start at 0.8–0.95). Exits simpler than entrances.
- Performance:
  - animate transform, opacity and filter;
  - no layout-thrashing reads in scroll handlers;
  - WebGL: pause when off-screen or the tab is hidden, cap DPR (≤ 1.5 desktop, 1 on coarse pointers), lower
    particle/geometry counts on small screens;
  - one GSAP ticker; if you use Lenis, drive it from `gsap.ticker` and call `ScrollTrigger.update` on Lenis
    scroll;
  - clean up every ScrollTrigger / listener / RAF on unmount (`useGSAP` with scope, or contexts).
- Mobile (390×844, touch) must look intentional and still impressive. Simplify the heaviest effect on coarse
  pointers, but do not just hide sections. No horizontal page overflow.
- Accessibility:
  - semantic headings (one h1);
  - visible focus states, everything reachable by keyboard;
  - text contrast WCAG AA;
  - decorative canvases `aria-hidden`;
  - custom cursors only on fine pointers, never hiding the native cursor for text and inputs.
- Animation wrappers can silently drop a `className`/`style`. Keep the motion wrapper thin and put the painted
  surface inside it. A green build does not prove an animation works: look at it in the browser.

## Libraries
- Installed:
  - `gsap` 3.15 (all plugins are free now: ScrollTrigger, SplitText, Flip, DrawSVG, MorphSVG, ScrollSmoother,
    Observer, …; register them client-side) + `@gsap/react` (`useGSAP`);
  - `motion` 14 (`motion/react`);
  - `lenis` (`lenis/react`);
  - `three` 0.186, `@react-three/fiber` 9, `@react-three/drei` 10, `@react-three/postprocessing` 3,
    `postprocessing`.
- Free copy-paste sources are welcome. Copy the code into `src/lab/d<N>/` with a top comment naming the source
  URL and licence:
  - React Bits (reactbits.dev, MIT + Commons Clause, fine to use on a site);
  - Magic UI free components (MIT);
  - Animata (MIT);
  - Motion Primitives (MIT).
- Forbidden:
  - anything paid or "Pro";
  - Spline or Unicorn Studio exports;
  - anything needing an account, API key or watermark;
  - fonts that are not free.
- Fonts: `next/font/google` (free Google Fonts) in your own module, applied as a className on your page root.
- Next 16.4 / React 19.3: when unsure of an API, read the installed docs in `node_modules/next/dist/docs/` and
  cite the path in your report. `"use client"` only where needed; the page itself can be a server component that
  renders client sections.

## Verify (required before you report)
1. `yarn typecheck > <log> 2>&1; echo EXIT=$?`, then `yarn lint`, then `yarn build` the same way. Read the logs
   (never trust a piped exit code). All EXIT=0.
2. `yarn start -p <your port>`. Write a Playwright script (outside the repo, in your scratch folder; `@playwright/test`
   is installed; launch chromium with `--use-angle=swiftshader --enable-unsafe-swiftshader`) that:
   - loads `/lab/<N>` at 1440×900 and captures viewport screenshots at 6–8 scroll positions covering every
     section;
   - waits enough after each scroll for scrubbed animations to settle;
   - captures 4 positions at 390×844 (mobile, `hasTouch`, `isMobile`);
   - captures one full page with `reducedMotion: "reduce"`;
   - collects console errors and page errors.
   Save shots to your shots folder (named in your dispatch).
3. LOOK at every screenshot yourself. Fix what looks broken, misaligned, unreadable or empty. Re-shoot only what
   you changed.
4. Free your port: `netstat -ano | grep ":<port> "` then `taskkill //PID <pid> //F //T`. Never `pkill -f`.
5. Commit on your branch with message `feat(lab): direction <N> — <name>`, trailer
   `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. Several commits are fine. Never push. Never touch
   `master` or `lab`.

## Environment (Windows, Git Bash)
- Write multi-line files with the Write tool; no heredocs into source files; no `node -e` with nested quotes.
- MSYS: Windows flags need double slashes (`taskkill //PID 123 //F`).
- Paths with `node_modules` can exceed MAX_PATH; do not move or delete them.

## Budget and focus
- Aim to finish within roughly 200k tokens. Priority order:
  1. the signature motions of your direction, done beautifully;
  2. every section present and readable;
  3. mobile;
  4. polish.
- Depth beats breadth: a few moves done perfectly beat many half-done.
- Do not dispatch subagents.

## Report
Write your report to the path in your dispatch:
- what you built per section;
- the signature motions and how they are implemented (file paths);
- libraries and components copied (with source URL and licence);
- the verify commands with EXIT values and the console-error result;
- screenshot paths with one line on what each shows;
- known weaknesses;
- what you would do next.

Reply in under 12 lines: status (DONE / DONE_WITH_CONCERNS / BLOCKED), commits, verify EXITs, shots folder,
top concerns, report path.
