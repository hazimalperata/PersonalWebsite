# hazimalperata.com

Personal site of Hazim Alper Ata: a single home page (hero, selected work, about, gallery, contact) over a
scroll-driven 3D earth, plus a case-study page per project. English by default, Turkish under `/tr`.

## Stack

- Next.js (App Router, `src/app/[locale]/`), React, TypeScript
- next-intl for i18n (`en` without a prefix, `tr` under `/tr`)
- Tailwind CSS 4, dark and light themes
- React Three Fiber (earth scene), GSAP + ScrollTrigger, Lenis smooth scroll
- MDX case studies in `content/projects/`
- Vitest + Testing Library (unit), Playwright + axe (end to end, accessibility)
- Hosted on Vercel

## Commands

Package manager is Yarn 1.

| Command | What it does |
| --- | --- |
| `yarn dev` | Dev server on http://localhost:3000 |
| `yarn gate` | Typecheck, lint, unit tests and production build. Must pass before every commit that matters |
| `yarn e2e` | Playwright on desktop and mobile (serves the last `yarn build` on port 3210, so build first) |
| `yarn textures` | Rebuilds the earth texture sets from the original 10k JPEGs. The sources are not in the tree: put them in `public/textures/earth/` first (file names in `scripts/textures.mjs`, or `git checkout <sha> -- public/textures/earth` from the commit before "feat: add texture pipeline") |
| `yarn start` | Serves the last build |

Files under `/textures` and `/posters` are served with `Cache-Control: immutable` for a year. Changed content needs a new file name; overwriting a file in place will not reach returning visitors.

Performance checks live in `docs/perf/README.md`. Lighthouse JSON and screenshots are local, git-ignored outputs you regenerate.

## Adding a project

Create `content/projects/<slug>.en.mdx` (and optionally `<slug>.tr.mdx`) and put images in
`public/images/projects/<slug>/`. A Turkish URL without a Turkish file shows the English text with a short
note. The frontmatter fields are described in `content/README.md`. Set `featured: true` to show the project
under "Selected work" on the home page.

## Adding a language

1. Add the locale code to `locales` in `src/i18n/routing.ts`.
2. Copy `messages/en.json` to `messages/<code>.json` and translate every key.
3. Add the language to the text fields in `src/data/profile.ts` and `src/data/gallery.ts` (type `L`) and to the
   content files if you want translated case studies (`<slug>.<code>.mdx`).
4. The locale switch currently toggles between two languages; with three or more it needs a menu.

## Notes

- `/_vercel/insights/script.js` returns 404 on a local server. That is expected: Vercel Analytics only exists on
  Vercel.
- Reduced motion and weak devices get a still poster instead of the 3D scene.
