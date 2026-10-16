# hazimalperata.com

Personal site of Hazim Alper Ata, a software engineer. A single dark home page where a field of particles turns the
real commit history of the projects into a timeline, with selected work, an about section, a gallery and contact
links. Each project has its own case-study page. English by default, Turkish under `/tr`.

## Stack

- Next.js 16 (App Router, `src/app/[locale]/`), React 19, TypeScript
- next-intl for i18n (`en` without a prefix, `tr` under `/tr`)
- Tailwind CSS 4, dark only
- React Three Fiber and three.js particle engine (`src/components/signal/`), GSAP + ScrollTrigger, Lenis smooth scroll
- MDX case studies in `content/projects/`
- Vitest + Testing Library (unit), Playwright + axe (end to end, accessibility)
- Hosted on Vercel

## Commands

Package manager is Yarn 1.

| Command | What it does |
| --- | --- |
| `yarn dev` | Dev server on http://localhost:3000 |
| `yarn gate` | Typecheck, lint, unit tests and production build. Must pass before every commit that matters |
| `yarn e2e` | Playwright on desktop and mobile. It serves the last build, so run `yarn build` first |
| `yarn signal` | Refreshes the commit data in `src/data/signal.json` (see below) |
| `yarn start` | Serves the last build |

Read the exit code of `yarn gate` directly. Piping it into `tail` hides a failure.

## Refreshing the commit data

The particle timeline is drawn from `src/data/signal.json`: per day commit counts for each lane, dates and numbers
only. No commit messages, no repo names.

1. Copy `signal.config.example.json` to `signal.config.local.json` (git-ignored).
2. Fill in the absolute paths of the local repos for each lane, and the `author` pattern (a `git log --author`
   regular expression, so alternatives are written `name\\|login\\|email`).
3. Run `yarn signal`. It only runs `git log` in those repos.
4. Review `git diff src/data/signal.json`, then commit it.

The collector refuses to overwrite the data with nothing. If the config is missing or unreadable, or no lane
produced a single commit (wrong paths, wrong author), it prints a message to stderr, exits with a non-zero code and
leaves `src/data/signal.json` untouched.

## Adding a project

Create `content/projects/<slug>.en.mdx`. English is the source: a slug exists only when its `.en.mdx` exists. Add
`<slug>.tr.mdx` for a Turkish version; without it the English text is shown on `/tr`. The slug may contain letters,
digits and hyphens.

Frontmatter fields (see `src/lib/content.ts` and any existing file, for example `content/projects/posme.en.mdx`):

| Field | Meaning |
| --- | --- |
| `title`, `summary` | Heading and one-sentence summary |
| `publishedAt`, `year` | Date (`YYYY-MM-DD`) and display year; the year falls back to `publishedAt` |
| `images` | List of image paths under `public/`; the first is the cover |
| `portraitImages` | `true` when the screenshots are portrait |
| `link` | External link, optional |
| `status` | `completed`, `inProgress` or `planned` (default `completed`) |
| `role` | Your role on the project |
| `stack` | List of technology names |
| `featured`, `order` | Featured projects come first, sorted by `order` (default 99); the rest by date, newest first |
| `kind` | `product`, `client`, `startup` or `personal` (default `personal`) |
| `platforms` | List such as `["iOS", "Android"]` |
| `storeLinks` | List of `{ store: appStore \| googlePlay, href }` |
| `signal` | Id of the lane that belongs to this project, or leave it out |

The body is MDX. Interface text around it (labels, headings) comes from the messages files.

A project is tied to a lane in two places: `signal: "<lane id>"` in its frontmatter, and `slug` on the lane in
`src/data/lanes.ts`. A project without a lane renders normally, just without a commit timeline in its header.

## Adding a lane

1. Add an entry to `src/data/lanes.ts`: `id` (also add it to the `LaneId` type), a name in `en` and `tr`, a colour,
   and the `slug` of its project if there is one. Order is chronological by first commit.
2. Add a matching `{ id, repos }` entry to `signal.config.local.json` (and to `signal.config.example.json`).
3. Run `yarn signal` and review the diff.

## Messages

Every visible string lives in `messages/<locale>/<namespace>.json` (`en` and `tr`, one file per namespace). Do not
write copy in JSX. A new key goes into both locales. The Turkish text is the owner's to write; drafts are marked as
drafts.

Performance checks live in `docs/perf/README.md`. Lighthouse JSON and screenshots are local, git-ignored outputs.
