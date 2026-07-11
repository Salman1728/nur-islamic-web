# Architecture Review — Nur Islamic Web

Status: documentation only. No production code, dependency, or configuration
was changed to produce this review. All facts below were verified against the
files in this repository as of this review (Next.js `16.2.10`, repo branch
`claude/architecture-review-plan`).

## 1. Summary

Nur is a static, content-first Next.js App Router site: a marketing/landing
page (`src/app/page.tsx`) and a dashboard mockup (`src/app/dashboard/page.tsx`),
both rendered as React Server Components with hardcoded in-file data. There is
no client-side interactivity (`'use client'` is not used anywhere), no data
fetching, no API routes, and no backend/database. Deployment is a single
GitHub Actions workflow that ships every push to `main` straight to Vercel
production with no automated quality gate.

## 2. Tech stack and versions

Source: `package.json`.

| Package | Version |
|---|---|
| `next` | `16.2.10` |
| `react` / `react-dom` | `19.2.4` |
| `lucide-react` | `^1.24.0` |
| `tailwindcss` / `@tailwindcss/postcss` (dev) | `^4` |
| `typescript` (dev) | `^5` |
| `eslint` (dev) | `^9` |
| `eslint-config-next` (dev) | `16.2.10` |

Scripts (`package.json`): `dev` → `next dev`, `build` → `next build`,
`start` → `next start`, `lint` → `eslint`. There is no `type-check`,
`test`, or `format` script.

`node_modules` was not present at the start of this review. Per
`AGENTS.md`'s mandate to consult the vendored Next 16 docs before asserting
any Next.js convention, `npm install` was run and the following claims in
this document were verified directly against
`node_modules/next/dist/docs/01-app/01-getting-started/`:

- **Server Components by default** — confirmed in
  `05-server-and-client-components.md`: "By default, layouts and pages are
  Server Components." This repo has zero `'use client'` directives, so both
  routes are fully server-rendered.
- **`next/font/google` usage** — confirmed in `13-fonts.md`: the documented
  pattern (`const font = SomeFont({ subsets: [...] })`, applied via a CSS
  variable/className on `<html>`) matches `src/app/layout.tsx` exactly.
- **Static `metadata` export in a Server Component** — confirmed in
  `14-metadata-and-og-images.md`: `export const metadata: Metadata = {...}`
  in a server `layout.tsx`/`page.tsx` is the documented static-metadata
  pattern used here.

No Next-16-specific *breaking-change* guide (e.g. a `guides/upgrading/version-16`
page) was found under the vendored docs in this environment, so this review
makes **no** claims about version-16-specific behavior changes (Turbopack
defaults, async request APIs, caching-default changes, etc.). Any such claim
would be **unverified — confirm against vendored Next 16 docs** and is
deliberately omitted rather than guessed.

## 3. Routing / App Router layout

All routes live under `src/app` (App Router):

- `src/app/layout.tsx` — root layout. Loads three Google fonts via
  `next/font/google`: `Marcellus` (`--font-display`, weight 400),
  `Mulish` (`--font-body`), `Amiri` (`--font-arabic`, weights 400/700,
  subsets `arabic`+`latin`). Sets page `metadata` (`title`, `description`).
  Renders `<html lang="en" data-scroll-behavior="smooth" className={...font vars...}>`
  and `<body>{children}</body>`.
- `src/app/page.tsx` — `/` landing page. Server component, default export
  `LandingPage`. Two local presentational helper components:
  - `PrayerMark({ t, label, moon = false, light = false })` — renders an SVG
    "sun arc" marker used as a section eyebrow.
  - `Skyline()` — renders a decorative SVG mosque-skyline silhouette.
  Content is organized as a "day of light" prayer-cycle narrative: hero
  (Fajr) → features (Dhuhr) → learning journey (Asr) → Qur'an verse
  (Maghrib) → footer (Isha).
- `src/app/dashboard/page.tsx` — `/dashboard` page. Server component, default
  export `Dashboard`. A single dense function returning the full dashboard
  mockup (sidebar nav, topbar, prayer-time cards, quick links, lesson/progress
  cards, dhikr, upcoming events).
- `src/app/globals.css` — 221 lines. `@import "tailwindcss";` at the top,
  then hand-authored CSS: design tokens in `:root`, buttons, the landing
  page's five themed sections, then a separate "Dashboard (app shell)" block,
  plus responsive `@media` rules for both areas and a
  `prefers-reduced-motion` block.
- `src/app/favicon.ico`, `public/*.svg` — default `create-next-app` static
  assets.

No other route segments, layouts, loading/error boundaries, route handlers
(`route.ts`), or middleware/proxy files exist in `src/app`.

## 4. Rendering model

Both pages are React Server Components (no `'use client'` anywhere in the
codebase). Per the verified Next 16 docs (§2 above), Server Components are
the default for layouts and pages and render on the server with no
client-side JavaScript shipped for their own logic. Consequently:

- There is no `useState`/`useEffect`/event-handler interactivity anywhere in
  `src/app/page.tsx` or `src/app/dashboard/page.tsx`.
- All content is hardcoded array/object literals evaluated at render time —
  no `fetch`, no async data loading, no revalidation.
- Because nothing in either page performs dynamic, per-request data access,
  both routes are effectively static/prerenderable content. (This is an
  observation grounded in the source, not an assertion about a specific Next
  16 default — labeled here as **unverified — confirm against vendored Next
  16 docs** if a definitive prerendering-mode claim is needed.)

## 5. Styling approach

- `src/app/globals.css` begins with `@import "tailwindcss";` (Tailwind v4's
  single-import entry point, per `postcss.config.mjs`'s
  `@tailwindcss/postcss` plugin), which pulls in Tailwind's preflight/reset
  styles even though the codebase applies **zero** Tailwind utility classes
  in JSX — every `className` in `page.tsx` and `dashboard/page.tsx` is a
  custom, hand-authored class name (e.g. `hero-section`, `prayer-card`,
  `quick-grid`). The import is not literally "unused": it still affects the
  rendered baseline styles via preflight, even with no utilities consumed.
- Design tokens are defined once in `:root` (`--night`, `--dawn`, `--day`,
  `--leaf`, `--gold`, `--dusk`, `--ink`, `--muted`, `--line`, `--card`, plus
  three "legacy" aliases — `--green`, `--green-2`, `--cream` — kept for the
  dashboard block).
- Styling is organized by page section using custom class names (BEM-ish,
  not utility-first): landing page sections are commented per prayer
  (Fajr/Dhuhr/Asr/Maghrib/Isha); the dashboard block (`globals.css` lines
  216–220) is a single, largely unformatted (minified-looking) CSS block
  under the `/* ═════ Dashboard (app shell) ═════ */` heading.
- Responsive breakpoints: landing page uses `max-width: 1100px / 820px /
  560px` media queries (`globals.css` lines 192–213); the dashboard block
  uses the same three breakpoints separately (lines 218–220).
- Accessibility-relevant CSS present: a global `:focus-visible` outline
  rule (line 33) and a `@media (prefers-reduced-motion: reduce)` block
  (lines 119–122) that disables the hero's rise/sunrise animations.

## 6. Data flow

There is no data layer. All content is hardcoded directly in the two page
components:

- `src/app/page.tsx`: `features` (array of 4 feature-card objects) and
  `prayerTimes` (array of 5 `{ name, time, now? }` objects), both module-level
  `const`s.
- `src/app/dashboard/page.tsx`: `prayers` (array of `[name, time]` tuples)
  and `quick` (array of `[Icon, title, desc]` tuples), also module-level
  `const`s.

No `fetch`, no environment variables, no API routes (`route.ts`), no
external service calls, and no persistence exist anywhere in `src/`. There is
no authentication/authorization model. Confirmed: the project uses no
backend — the environment's Supabase MCP tooling was not and should not be
introduced here.

**Data duplication / drift observed:** the two pages independently hardcode
overlapping prayer-time data and it has diverged:

- `src/app/page.tsx:12` — `{ name: 'Fajr', time: '5:12 AM', now: true }`
- `src/app/dashboard/page.tsx:4` — `['Fajr','5:06 AM']`

Same day, same app, two different Fajr times (5:12 AM vs 5:06 AM), because
each page owns its own copy of the data with no shared source of truth.

## 7. Deployment pipeline

`.github/workflows/deploy.yml` — "Deploy to Vercel":

- Trigger: `push` to `main` (no PR-time run, no manual `workflow_dispatch`).
- Runner: `ubuntu-latest`, Node `22` (`actions/setup-node@v5`).
- Steps: `npm install --global vercel@latest`, then
  `vercel pull --yes --environment=production --token=...`,
  `vercel build --prod --token=...`,
  `vercel deploy --prebuilt --prod --token=...`.
- Secrets referenced **by name only** (values never printed/logged in this
  review): `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` (exposed as workflow-level
  `env`), and `VERCEL_TOKEN` (passed inline per step via `--token=`).
- Observations: the workflow does not run `npm ci` to install project
  dependencies (only installs the global `vercel` CLI), does not cache
  dependencies, and — most importantly — runs no `eslint`, `tsc --noEmit`,
  or non-Vercel `next build` step before deploying to production. A broken
  build is only caught by `vercel build` itself, after the code is already
  on `main`, with no separate lint/type-check signal.

## 8. Documentation state

- `README.md` is unmodified `create-next-app` boilerplate: it references
  editing `app/page.tsx` (the actual App Router root is `src/app/page.tsx`,
  i.e. under `src/`) and states the project uses the **Geist** font. The
  actual fonts loaded in `src/app/layout.tsx` are **Marcellus, Mulish, and
  Amiri** — Geist is not used anywhere in this repo. This document
  (`docs/architecture-review.md`) does not modify `README.md`; the fix is
  captured as a backlog item in `docs/improvement-plan.md`.
- `AGENTS.md` / `CLAUDE.md` instruct that this is a modified Next.js with
  potential breaking changes vs. training data, and mandate reading
  `node_modules/next/dist/docs/` before asserting conventions. This review
  followed that mandate (§2).

## 9. Risks & observations (grounded findings)

1. **No pre-deploy quality gate.** `deploy.yml` ships to production on every
   push to `main` with no lint/type-check/build verification step and no
   `npm ci`. See §7.
2. **README is stale/inaccurate.** References Geist and `app/page.tsx`
   instead of Marcellus/Mulish/Amiri and `src/app/page.tsx`. See §8.
3. **Non-functional interactive controls in the dashboard.**
   `src/app/dashboard/page.tsx:11` — the sidebar `nav` renders `<a>` elements
   built from a `[Icon, label, active]` tuple array with **no `href`
   attribute at all**, so these links are not keyboard-focusable and do not
   navigate. Multiple `<button>` elements (Donate — line 12; View All Prayer
   Times — line 21; the "Read in Qur'an", lesson/beginner "Continue"/"Start
   Learning" buttons — lines 23, 27, 34; the mobile-menu button — line 15)
   have no `onClick`/handler, which is consistent with this being a static
   mockup but is undocumented as such anywhere in the code or README. The
   search control (`div.searchbox`, line 15) is a `<span>` with placeholder
   text, not a real `<input>`.
4. **Accessibility gaps.**
   - Icon-only controls lack `aria-label`: the mobile menu `<button>`
     (`dashboard/page.tsx:15`, wraps a bare `<Menu/>`), the notification
     `<Bell size={19}/>` (line 15), and the avatar `<span className="avatar">S</span>`
     (line 15) have no accessible name beyond visual icon/initial.
   - The sidebar `<a>` elements without `href` (line 11, see item 3 above)
     are not part of the natural tab order and are not announced as links by
     assistive technology in the same way a real link would be.
   - Arabic content contrast: the **landing page does this correctly** —
     `src/app/page.tsx:132` sets `lang="ar" dir="rtl"` on the Qur'an verse
     paragraph. The **dashboard does not**: the `.arabic` divs at
     `dashboard/page.tsx:23` (`إِنَّ مَعَ الْعُسْرِ يُسْرًا`) and
     `dashboard/page.tsx:32` (`سُبْحَانَ اللَّهِ وَبِحَمْدِهِ`) have no
     `lang`/`dir` attributes at all.
   - Emoji used directly in heading/body text (`🌿` in
     `dashboard/page.tsx:17`'s `<h1>`, `📍` in the top-meta location label,
     line 15) are not wrapped with `aria-hidden` or given a text alternative;
     worth a design/a11y review pass.
5. **Type-safety escape hatches.** `src/app/dashboard/page.tsx` uses an
   explicit `:any` type annotation in **two** `.map()` destructurings:
   - line 11: `.map(([Icon,label,active]:any)=>...)` for the sidebar nav
     array.
   - line 25: `.map(([Icon,title,desc]:any)=>...)` for the `quick` links
     array.
   This bypasses `tsconfig.json`'s `"strict": true` for those two call
   sites specifically.
6. **Data duplication / drift.** See §6 — Fajr time differs (5:12 AM vs
   5:06 AM) between `page.tsx` and `dashboard/page.tsx`; all prayer/verse
   content is duplicated per-page with no shared module.
7. **Hardcoded personal-looking content.** The dashboard hardcodes a name
   ("Salman", `dashboard/page.tsx:15,17`) and a location ("Nairobi, Kenya",
   line 15). This is placeholder/mockup content, not data pulled from any
   real user record (there is no auth or user data model in this repo), but
   it reads as personal information and should be parameterized once real
   user data exists.
8. **Tailwind is imported but its utility classes are unused in markup.**
   See §5 — `@import "tailwindcss"` is present but no JSX uses Tailwind
   utility classes; only its preflight/reset currently has any effect.
9. **No component extraction, no tests.** Both pages are single large
   functions with repeated inline markup patterns (cards, prayer rows, the
   brand lockup which is duplicated between `page.tsx:57` and
   `dashboard/page.tsx:10`). There is no test framework configured in
   `package.json` (no `test` script, no Jest/Vitest/Playwright dependency).
10. **`next.config.ts` is an empty config object.** Not a bug — simply notes
    that no image domains, headers, redirects, or other Next config options
    are set yet.

## 10. Security / privacy / auth posture

- No authentication or authorization exists anywhere in this codebase.
- No secrets are stored in source. `deploy.yml` references three GitHub
  Actions secrets by name (`VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`,
  `VERCEL_TOKEN`); their values are not present in this repository and are
  not reproduced in this document.
- No user input is accepted anywhere (the dashboard "search" is
  non-functional markup, not a real input), so there is no validation
  surface to audit.
- The hardcoded "Salman" / "Nairobi, Kenya" strings are placeholder content,
  not data collected from a real user; flagged in §9 item 7 as a privacy
  consideration for when real user data is introduced.

## 11. Scope note

This review changes no runtime behavior. It documents the repository as it
exists on this branch. A companion, prioritized backlog of recommended
follow-up work is in `docs/improvement-plan.md`; none of those items are
implemented by this review.
