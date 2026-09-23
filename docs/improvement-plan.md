# Improvement Plan — Nur Islamic Web

Status: **documentation only / backlog**. Every item below is a
recommendation. **None of these items are implemented in this PR** — this
plan makes no change to `src/`, `package.json`, or any build/deploy config,
and introduces no new runtime behavior. Each item explicitly restates this
deferral so it cannot be mistaken for completed work.

Companion document: `docs/architecture-review.md` (factual findings this
plan is derived from).

Priority key: **P0** = should be addressed soon, meaningful risk/quality
gap; **P1** = important but not urgent; **P2** = nice-to-have / groundwork.
Effort key: **S** = small (hours), **M** = medium (roughly a day), **L** =
large (multi-day / needs design input).

---

## P0 items

### P0-1 — Add a pre-deploy quality gate to the CI/CD workflow

- **Priority:** P0
- **Rationale:** `.github/workflows/deploy.yml` deploys straight to Vercel
  production on every push to `main` with no `eslint`, `tsc --noEmit`, or
  standalone `next build` verification step, and installs the Vercel CLI
  globally rather than running `npm ci` against the project's own
  `package-lock.json`. A broken build or lint/type error currently reaches
  production before anyone finds out. Recommend adding a job (or
  pre-deploy step) that runs `npm ci`, `npm run lint`, `npx tsc --noEmit`,
  and a build check, and fails the workflow (blocking deploy) if any of
  them fail. Reference Vercel/GitHub Actions secrets by name only
  (`VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `VERCEL_TOKEN`) — no values in
  this document.
- **Affected files:** `.github/workflows/deploy.yml`
- **Effort:** M
- **Risk:** Low. Adding a gating step is additive to the pipeline; the
  main risk is mis-ordering steps such that a flaky check blocks a valid
  deploy — mitigated by keeping the same secrets/permissions and testing
  the workflow on a branch before relying on it for `main`.
- **Deferred:** Not implemented in this PR. No workflow file is modified
  here; this is a recommendation only.

### P0-2 — Rewrite `README.md` to match the actual project

- **Priority:** P0
- **Rationale:** `README.md` is unmodified `create-next-app` boilerplate.
  It tells contributors to edit `app/page.tsx` (the real path is
  `src/app/page.tsx`) and says the project uses the **Geist** font, but
  `src/app/layout.tsx` actually loads **Marcellus, Mulish, and Amiri** via
  `next/font/google`. This actively misleads new contributors about where
  code lives and what the design system is.
- **Affected files:** `README.md`
- **Effort:** S
- **Risk:** Low. A README rewrite has no runtime impact; risk is limited
  to omitting a detail a future contributor needed, mitigated by keeping
  the rewrite grounded in the verified facts in `docs/architecture-review.md`.
- **Deferred:** Not implemented in this PR. Per the task's out-of-scope
  list, editing `README.md` is explicitly excluded from this
  documentation-only change; this item records it as the next actionable
  step.

---

## P1 items

### P1-1 — Make dashboard interactive controls functional (or explicitly mark them as mockup-only)

- **Priority:** P1
- **Rationale:** `src/app/dashboard/page.tsx:11` renders sidebar
  navigation as `<a>` elements with **no `href` attribute**, so they are
  not real links (not keyboard-focusable in the normal tab order, no
  navigation on click/Enter). Multiple `<button>` elements have no
  handler (Donate at line 12; "View All Prayer Times" at line 21; "Read
  in Qur'an" at line 23; lesson/beginner CTAs at lines 27 and 34; the
  mobile-menu toggle at line 15). The search control (line 15) is a
  `<span>` with placeholder text rather than an `<input>`. Recommend
  either wiring these to real routes/handlers as the app gains real
  functionality, or — if this remains a static mockup for now —
  documenting that intent so it isn't mistaken for a bug during future
  audits.
- **Affected files:** `src/app/dashboard/page.tsx`
- **Effort:** M/L (M if only documenting as intentional mockup state and
  adding `href`s to the nav links; L if wiring up real navigation,
  search, and CTA behavior, which likely requires converting parts of
  the page to Client Components and adding actual routes/handlers)
- **Risk:** Medium. Converting parts of a currently pure Server Component
  page into interactive Client Components changes the rendering model
  (per the Server/Client Components docs verified in
  `docs/architecture-review.md` §2) and increases the client JS bundle;
  should be scoped carefully to only the interactive pieces (e.g. the
  search input, the mobile-menu toggle) rather than converting the whole
  page.
- **Deferred:** Not implemented in this PR. No JSX, handlers, or `href`
  values are added here; this is a recommendation only.

### P1-2 — Close accessibility gaps (icon-only controls, non-link nav items, missing `lang`/`dir` on dashboard Arabic text)

- **Priority:** P1
- **Rationale:** Several accessibility gaps were found by direct
  inspection:
  - Icon-only controls without `aria-label`: the mobile-menu button
    wrapping a bare `<Menu/>` (`dashboard/page.tsx:15`), the `<Bell
    size={19}/>` notification icon (line 15), and the initials avatar
    `<span className="avatar">S</span>` (line 15).
  - The sidebar `<a>` elements without `href` (line 11) are not reliably
    keyboard-focusable/announced as links (see P1-1).
  - The landing page correctly sets `lang="ar" dir="rtl"` on its Qur'an
    verse (`src/app/page.tsx:132`), but the dashboard's two `.arabic`
    divs do **not**: `dashboard/page.tsx:23`
    (`إِنَّ مَعَ الْعُسْرِ يُسْرًا`) and `dashboard/page.tsx:32`
    (`سُبْحَانَ اللَّهِ وَبِحَمْدِهِ`) have no `lang`/`dir` attributes.
  - Emoji used directly in heading/body copy (`🌿` in the `<h1>` at
    `dashboard/page.tsx:17`, `📍` in the location label at line 15) have
    no `aria-hidden`/text-alternative treatment and should get a design
    review pass.
- **Affected files:** `src/app/dashboard/page.tsx`
- **Effort:** M
- **Risk:** Low. These are additive attribute changes (`aria-label`,
  `lang`, `dir`, `href`) with no expected visual/layout impact; low
  regression risk, should still go through a visual smoke check since
  `globals.css` has some `[dir]`/RTL-adjacent styling already in the
  Arabic verse rule on the landing page that dashboard changes should
  stay consistent with.
- **Deferred:** Not implemented in this PR. No accessibility attributes
  are added here; this is a recommendation only.

### P1-3 — Remove `:any` usage in the dashboard, add proper types

- **Priority:** P1
- **Rationale:** `src/app/dashboard/page.tsx` uses an explicit `:any`
  type annotation in two `.map()` destructurings, defeating
  `tsconfig.json`'s `"strict": true` at those two call sites:
  - `dashboard/page.tsx:11` —
    `.map(([Icon,label,active]:any)=>...)` over the sidebar nav tuple
    array.
  - `dashboard/page.tsx:25` —
    `.map(([Icon,title,desc]:any)=>...)` over the `quick` links tuple
    array.
  Recommend replacing the untyped tuple arrays with a typed
  `const`/`readonly` tuple type (e.g. `type NavItem = readonly
  [LucideIcon, string, boolean?]`) or an array of named objects, removing
  the need for `:any` entirely.
- **Affected files:** `src/app/dashboard/page.tsx`
- **Effort:** S
- **Risk:** Low. This is a type-level change only (adding types to
  existing literals); no behavior change expected as long as the
  destructured shape stays the same. `npm run lint` and `npx tsc
  --noEmit` should be re-run after the change to confirm no new
  strict-mode errors surface once `any` is removed.
- **Deferred:** Not implemented in this PR. No source file is modified
  here; this is a recommendation only.

---

## P2 items

### P2-1 — Establish a single shared data source for prayer/verse content (fix Fajr time drift)

- **Priority:** P2
- **Rationale:** Prayer-time data is duplicated and has already drifted:
  `src/app/page.tsx:12` lists Fajr as `5:12 AM` while
  `src/app/dashboard/page.tsx:4` lists Fajr as `5:06 AM` — same app, same
  presumed day, two different values, because each page owns an
  independent hardcoded copy. Recommend introducing a shared module
  (e.g. `src/data/` or `src/lib/`) as the single source of truth for
  prayer times and verse content, imported by both pages, once real data
  (or a real calculation) replaces the current placeholders.
- **Affected files:** `src/app/page.tsx`, `src/app/dashboard/page.tsx`
  (read); new shared module path TBD, e.g. `src/data/prayer-times.ts`
  (not created in this PR)
- **Effort:** M
- **Risk:** Low-medium. Consolidating data is low risk in isolation, but
  because both pages currently show *different* Fajr times, picking a
  canonical value (or, better, replacing hardcoded times with a real
  calculation) is a product decision, not just a refactor — flag for
  product/content sign-off before implementation.
- **Deferred:** Not implemented in this PR. No data module is created and
  no existing data is changed here; this is a recommendation only.

### P2-2 — Parameterize hardcoded personal-looking content ("Salman", "Nairobi, Kenya")

- **Priority:** P2
- **Rationale:** `src/app/dashboard/page.tsx` hardcodes a name ("Salman",
  lines 15 and 17) and a location ("Nairobi, Kenya", line 15) directly in
  markup. There is no auth/user-data model in this repo today, so this is
  placeholder mockup content rather than real personal data being
  collected or stored — but it should be parameterized (e.g. driven by a
  user/session object) before any real user data flows through this page,
  to avoid the pattern of personal-looking strings living in source code.
- **Affected files:** `src/app/dashboard/page.tsx`
- **Effort:** S
- **Risk:** Low. Purely presentational placeholder replacement; risk is
  limited to needing a real data source to parameterize against, which
  does not exist yet (depends on future auth/user-profile work).
- **Deferred:** Not implemented in this PR. No source file is modified
  here; this is a recommendation only.

### P2-3 — Decide whether to adopt Tailwind utilities or drop the Tailwind import

- **Priority:** P2
- **Rationale:** `src/app/globals.css:1` does `@import "tailwindcss";`
  (via the `@tailwindcss/postcss` plugin configured in
  `postcss.config.mjs`), but no JSX in `src/app/page.tsx` or
  `src/app/dashboard/page.tsx` uses a Tailwind utility class — every
  `className` is a custom, hand-authored name. The import is not fully
  dead code (Tailwind's preflight/reset still applies), but the project
  is paying for the Tailwind v4 toolchain (dependency, PostCSS plugin,
  build step) while getting essentially none of its utility-class value.
  Recommend a deliberate decision: either start adopting Tailwind
  utilities going forward, or remove the Tailwind dependency/import and
  keep the existing hand-written CSS as the sole styling approach.
- **Affected files:** `src/app/globals.css`, `postcss.config.mjs`,
  `package.json` (only if the decision is to remove Tailwind)
- **Effort:** S/M (S to decide and document the direction; M if actually
  removing the dependency and confirming no visual regression from losing
  Tailwind's preflight/reset)
- **Risk:** Medium if removing — Tailwind's preflight currently
  contributes to the baseline styling (e.g. box-sizing, margin resets)
  even though no utility classes are used, so removing the import without
  care could shift layout; low risk if the decision is simply to start
  adopting utilities incrementally.
- **Deferred:** Not implemented in this PR. Neither the CSS import nor
  the PostCSS/dependency config is changed here; this is a recommendation
  only.

### P2-4 — Extract shared components; add a test framework

- **Priority:** P2
- **Rationale:** Both `src/app/page.tsx` and `src/app/dashboard/page.tsx`
  contain sizeable, repeated inline markup patterns (feature/quick/lesson
  cards, prayer-time rows, the brand lockup which is duplicated near-
  verbatim between `page.tsx:57` and `dashboard/page.tsx:10`). There is
  also no test framework in `package.json` (no `test` script, no
  Jest/Vitest/Playwright/Testing Library dependency), so there is
  currently no automated way to catch regressions like the Fajr-time
  drift (P2-1) or a broken `href`. Recommend extracting shared
  presentational components (e.g. a `BrandLockup`, `PrayerRow`, `Card`)
  and introducing a test framework with at least smoke/render tests for
  both routes.
- **Affected files:** `src/app/page.tsx`, `src/app/dashboard/page.tsx`;
  new files under a future `src/components/` and a future test directory
  (paths TBD, not created in this PR); `package.json` (only if adding a
  test-framework dependency and `test` script)
- **Effort:** L
- **Risk:** Low-medium. Component extraction is mechanical and low risk
  if markup/CSS class names are preserved exactly; adding a test
  framework is additive (new dev dependency + script) and does not touch
  runtime code, but is a larger, multi-step effort that should be scoped
  as its own follow-up rather than bundled with other fixes.
- **Deferred:** Not implemented in this PR. No components are extracted
  and no test framework is added here; this is a recommendation only.

### P2-5 — Document `next.config.ts` as the intentional place for future config

- **Priority:** P2
- **Rationale:** `next.config.ts` currently exports an empty
  `NextConfig` object (`const nextConfig: NextConfig = {};`). This is not
  a defect — it simply means no image domains, custom headers, redirects,
  or other Next.js configuration options have been needed yet. Recommend
  keeping this noted as the intended location for such config once a need
  arises (e.g. remote image domains if `next/image` is used with external
  sources in the future), so it isn't overlooked or duplicated elsewhere.
- **Affected files:** `next.config.ts`
- **Effort:** S
- **Risk:** Low. Documentation/awareness item only; no config change is
  proposed at this time.
- **Deferred:** Not implemented in this PR (and no concrete config change
  is even proposed yet — this item is a placeholder note for future
  needs).

---

## Summary table

| # | Title | Priority | Effort | Affected files (primary) |
|---|---|---|---|---|
| P0-1 | CI quality gate before deploy | P0 | M | `.github/workflows/deploy.yml` |
| P0-2 | Rewrite stale README | P0 | S | `README.md` |
| P1-1 | Functional dashboard controls (or documented mockup state) | P1 | M/L | `src/app/dashboard/page.tsx` |
| P1-2 | Accessibility gaps (aria-labels, `href`, `lang`/`dir`) | P1 | M | `src/app/dashboard/page.tsx` |
| P1-3 | Remove `:any` in dashboard, add types | P1 | S | `src/app/dashboard/page.tsx` |
| P2-1 | Shared data source, fix Fajr time drift | P2 | M | `src/app/page.tsx`, `src/app/dashboard/page.tsx` |
| P2-2 | Parameterize hardcoded name/location | P2 | S | `src/app/dashboard/page.tsx` |
| P2-3 | Decide on Tailwind adoption vs. removal | P2 | S/M | `src/app/globals.css`, `postcss.config.mjs` |
| P2-4 | Extract shared components; add tests | P2 | L | `src/app/page.tsx`, `src/app/dashboard/page.tsx` |
| P2-5 | Document `next.config.ts` as future config point | P2 | S | `next.config.ts` |

**No item in this table is implemented by this PR.** This document is a
prioritized backlog only; each item above restates its own deferral status
individually, and no source, dependency, or configuration file is changed
by adding this plan.
