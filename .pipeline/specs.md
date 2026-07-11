# Implementation Specification — Architecture Review & Prioritized Improvement Plan (Docs Only)

> NOTE ON FILE LOCATION: This is the Planner deliverable that was intended for
> `C:\Users\salman\Projects\nur-islamic-web\.pipeline\specs.md`. Plan mode is active
> in this session and permits writing to this plan file only, so the full spec lives
> here. The orchestrator should either re-run the Planner with plan mode disabled, or
> copy this file's contents verbatim into `.pipeline\specs.md` before the Coder stage.

---

## 1. Request summary

Feature request: "review the current project architecture and create a prioritized
improvement plan without changing production behavior."

The deliverable is **documentation only**. The Coder stage authors Markdown docs that
(a) describe the current architecture and (b) list prioritized, actionable improvements.
No runtime/source code, no dependencies, no build-affecting config may change.

## 2. Current architecture and relevant conventions

Verified by reading the repository (all paths absolute under
`C:\Users\salman\Projects\nur-islamic-web`).

Stack (from `package.json`):
- `next` 16.2.10, `react` 19.2.4, `react-dom` 19.2.4, `lucide-react` ^1.24.0.
- Dev: `tailwindcss` ^4 with `@tailwindcss/postcss` ^4, `typescript` ^5, `eslint` ^9,
  `eslint-config-next` 16.2.10, `@types/*`.
- Scripts: `dev` = `next dev`, `build` = `next build`, `start` = `next start`,
  `lint` = `eslint`.

App structure (App Router, `src/app`):
- `src/app/layout.tsx` — root layout. Loads three Google fonts via `next/font/google`
  (`Marcellus` -> `--font-display`, `Mulish` -> `--font-body`, `Amiri` -> `--font-arabic`),
  sets `metadata` (title/description), `<html lang="en" data-scroll-behavior="smooth">`.
- `src/app/page.tsx` — landing page. Server component. Hardcoded `features` and
  `prayerTimes` arrays. Two local presentational helpers: `PrayerMark` (SVG sun-arc marker,
  typed props) and `Skyline` (SVG). Sections themed as a "day of light" prayer cycle.
- `src/app/dashboard/page.tsx` — dashboard mockup. Server component. Hardcoded data
  arrays `prayers` and `quick`. Dense single-function JSX. Uses `:any` in `.map` destructuring.
- `src/app/globals.css` — 220 lines. `@import "tailwindcss";` then design tokens in
  `:root` and hand-written CSS for landing + dashboard, including responsive `@media`
  blocks and a `prefers-reduced-motion` block.
- `src/app/favicon.ico`, `public/*.svg` (default create-next-app assets).

Config:
- `next.config.ts` — empty config object (no options set).
- `tsconfig.json` — `strict: true`, `moduleResolution: "bundler"`, path alias `@/*` -> `./src/*`.
- `eslint.config.mjs` — flat config composing `eslint-config-next/core-web-vitals` and
  `eslint-config-next/typescript`.
- `postcss.config.mjs` — `@tailwindcss/postcss` plugin only.

Deployment:
- `.github/workflows/deploy.yml` — on push to `main`, installs Vercel CLI globally and runs
  `vercel pull` / `vercel build --prod` / `vercel deploy --prebuilt --prod` using
  `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `VERCEL_TOKEN` secrets. Node 22. No lint/type-check/
  build gate before deploy; no `npm ci`; no dependency cache.

Docs:
- `README.md` — unmodified create-next-app boilerplate (mentions Geist font and
  `app/page.tsx`, neither of which matches this repo).
- `AGENTS.md` / `CLAUDE.md` — instruct that this Next.js version has breaking changes and
  that `node_modules/next/dist/docs/` must be consulted before asserting Next conventions.

Conventions observed: TypeScript strict; server components only (no `'use client'`,
no hooks, no data fetching, no API routes); static hardcoded content; global CSS with
custom class names (BEM-ish, not utility-first); single-quote imports; 2-space indent.

Environment note: `node_modules` is **not installed** in this workspace, so the vendored
Next 16 docs referenced by AGENTS.md could not be read, and no build/lint could be run here.

## 3. Scope

- Create `docs/architecture-review.md`: a factual description of the current architecture,
  data flow, conventions, and observed risks/issues, grounded in real file paths.
- Create `docs/improvement-plan.md`: a prioritized, actionable improvement backlog with
  rationale, effort estimate, risk, and explicit "no runtime change in this PR" framing.
- The two docs may be split as above or, if the Coder prefers, combined — but both required
  content sets (review + prioritized plan) must be present. Default: two separate files.

## 4. Out of scope

- Any change to runtime/source under `src/`.
- Any change to `package.json`, `package-lock.json`, or installed dependencies.
- Any change to build/tooling config that affects build output: `next.config.ts`,
  `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `.github/workflows/deploy.yml`.
- Editing `README.md` (its staleness is captured as a recommendation, not fixed here).
- Actually implementing any listed improvement.
- Adding a test framework or CI changes.

## 5. Exact files to create, modify, or delete

Create:
- `C:\Users\salman\Projects\nur-islamic-web\docs\architecture-review.md`
- `C:\Users\salman\Projects\nur-islamic-web\docs\improvement-plan.md`
- `C:\Users\salman\Projects\nur-islamic-web\.pipeline\specs.md` (this spec, copied by the
  orchestrator once plan mode is off) and any downstream `.pipeline` reports the pipeline uses.

Modify: none.
Delete: none.

## 6. Interfaces, components, functions, routes, and signatures

N/A. This is a documentation-only task; it introduces no code, components, routes, or
signatures. Justification: the acceptance criteria forbid runtime changes, so there are no
interfaces to define. The docs should *reference* existing symbols accurately, e.g.
`PrayerMark({ t, label, moon, light })` and `Skyline()` in `src/app/page.tsx`.

## 7. Data model, migration, API, and configuration changes

None. There is no database, no API layer, no environment schema, and no configuration
change. State this explicitly in the docs. (Supabase MCP tooling is available in the
environment but the project uses no backend — do not introduce one.)

## 8. Detailed implementation sequence (for the Coder)

1. Create the `docs/` directory.
2. Author `docs/architecture-review.md` covering: purpose/summary; tech stack and versions
   (cite `package.json`); routing/App Router layout (`src/app/**`); rendering model (server
   components, fully static); styling approach (`globals.css`, tokens, Tailwind import);
   data flow (hardcoded arrays, no fetch/API); deployment pipeline (`deploy.yml`); and a
   "Risks & observations" section (see section 9 and the findings list below).
3. Author `docs/improvement-plan.md` as a prioritized table/backlog. Each item: title,
   priority (P0/P1/P2), rationale, affected files, effort (S/M/L), risk, and a note that
   implementation is deferred and must not change public behavior. Use the prioritized items
   below.
4. Before asserting any Next 16-specific convention, run `npm install` and read the relevant
   guide under `node_modules/next/dist/docs/` (per AGENTS.md). Any claim that cannot be
   verified must be labeled "unverified — confirm against vendored Next 16 docs."
5. Verify no source/config files were touched (see test plan).

Prioritized improvement items (findings the Coder should document, grounded in this repo):

- P0 — CI quality gate before deploy. `deploy.yml` deploys on push to `main` with no
  `next build` / `eslint` / `tsc --noEmit` gate and uses global `vercel` install rather than
  `npm ci`. Recommend a pre-deploy job running lint/type-check/build. Effort M. Risk: low.
- P0 — README is inaccurate. `README.md` is create-next-app boilerplate referencing Geist and
  `app/page.tsx`; real fonts are Marcellus/Mulish/Amiri and code lives in `src/app`. Recommend
  rewrite. Effort S.
- P1 — Non-functional interactive controls. Dashboard sidebar nav uses `<a>` without `href`
  (`src/app/dashboard/page.tsx` line ~11), and buttons (Donate, View All Prayer Times, mobile
  menu, search) have no handlers; search is a `<span>`, not an input. Document as UX/a11y debt
  and future work. Effort M/L.
- P1 — Accessibility gaps. Icon-only controls (`Bell`, `Menu`, avatar) lack `aria-label`;
  sidebar `<a>` without `href` are not keyboard-focusable; dashboard Arabic text
  (`.arabic` divs) lacks `lang="ar"`/`dir="rtl"` (landing verse does set them, good). Emoji in
  headings (`🌿`, `📍`) need review. Effort M.
- P1 — Type safety. `src/app/dashboard/page.tsx` uses `:any` in `.map` destructuring for the
  nav and `quick` arrays, defeating strict typing. Recommend typed tuples/consts. Effort S.
- P2 — Data duplication and drift. Fajr time differs between pages: landing `5:12 AM`
  (`page.tsx`) vs dashboard `5:06 AM` (`dashboard/page.tsx`). Prayer/verse data is duplicated
  and hardcoded. Recommend a shared `src/data` (or `src/lib`) module later. Effort M.
- P2 — Hardcoded personal/PII-like content. "Salman" and "Nairobi, Kenya" are baked into the
  dashboard. Recommend parameterizing when real data is added. Effort S.
- P2 — Tailwind imported but effectively unused. `globals.css` does `@import "tailwindcss";`
  but the JSX uses only custom class names; no utility classes are applied. Recommend deciding
  to either adopt utilities or drop Tailwind to cut bundle/tooling surface. Effort S/M.
- P2 — No component extraction / no tests. Repeated inline markup (cards, prayer rows,
  brand lockup) could become shared components; there is no test setup. Document as future work.
  Effort L.
- P2 — Empty `next.config.ts`. Note it is intentional/minimal; flag as the place to add image
  domains, headers, etc. when needed. Effort S.

## 9. Error states and edge cases

- Docs-only work has no runtime error states. Edge cases for the task itself:
  - `docs/` does not yet exist — create it.
  - `.pipeline/` already exists (git status shows it untracked) — do not clobber unrelated
    pipeline files.
  - Do not let documentation claims outrun verification: unverifiable Next 16 assertions must
    be labeled as such (see section 15).
  - Avoid documenting fixes as if applied — every improvement is a recommendation only.

## 10. Security, privacy, authorization, and validation requirements

- Do not include secrets. `deploy.yml` references `VERCEL_TOKEN`, `VERCEL_ORG_ID`,
  `VERCEL_PROJECT_ID` as GitHub secrets — reference them by name only; never print values.
- No auth model exists in the app; state that plainly.
- Privacy: the docs may note the hardcoded personal data ("Salman", "Nairobi") as a concern
  but must not add any new PII.
- Validation: N/A (no inputs). The only "validation" is that documented facts match the repo.

## 11. Accessibility and responsive behavior for UI work

No UI is being built. The docs should *audit* existing a11y/responsive behavior:
- Responsive: `globals.css` defines breakpoints at 1100/820/560px for landing and dashboard;
  document them.
- A11y positives to note: `:focus-visible` outline, `prefers-reduced-motion` block, landing
  verse `lang="ar" dir="rtl"`.
- A11y gaps to note: see P1 items in section 8.

## 12. Test plan with concrete cases (for the Tester)

1. Runtime untouched: `git diff --name-only main` lists only paths under `docs/` and
   `.pipeline/`. Nothing under `src/`, no `package.json`/`package-lock.json`, no
   `next.config.ts`/`tsconfig.json`/`eslint.config.mjs`/`postcss.config.mjs`, no
   `.github/workflows/**`.
2. Build/lint/type-check unchanged: after `npm install`, `npm run build`, `npm run lint`,
   and `npx tsc --noEmit` behave exactly as on `main` (docs cannot affect these; a diff in
   results indicates accidental source changes).
3. Docs exist and are non-empty: `docs/architecture-review.md` and `docs/improvement-plan.md`
   are present with the required sections.
4. Factual accuracy spot-check: versions cited match `package.json` (Next 16.2.10, React
   19.2.4); file paths cited exist; the Fajr time discrepancy (5:12 vs 5:06) is correctly
   reported; fonts listed are Marcellus/Mulish/Amiri (not Geist).
5. No secrets: docs contain no token values, only secret names.
6. Prioritization present: `improvement-plan.md` assigns priority and effort to each item.

## 13. Acceptance criteria

- Both docs created under `docs/`; no runtime/config/dependency files modified.
- `git diff --name-only main` shows only `docs/` (and `.pipeline/`) paths.
- Architecture review accurately reflects stack, routing, rendering model, styling, data
  flow, and deployment as described in section 2.
- Improvement plan is prioritized with rationale + effort per item and states that no public
  behavior changes in this PR.
- All Next 16-specific claims are either verified against vendored docs or labeled unverified.
- No secrets or new PII introduced.

## 14. Rollback or compatibility notes

- Rollback is trivial: delete the two docs files (and, if copied, `.pipeline/specs.md`). No
  runtime, build, or deploy impact because only Markdown is added.
- Fully backward compatible; public behavior is unchanged by construction.

## 15. Assumptions and open risks

- Assumption: the Coder will run `npm install` and consult `node_modules/next/dist/docs/`
  before asserting Next 16 conventions (AGENTS.md mandate). `node_modules` is absent in this
  Planner session, so Next-16-specific claims are currently unverified; the biggest quality
  risk is a review doc stating a Next 15-era convention that Next 16 changed. Mitigation:
  label unverified claims and verify before finalizing.
- Assumption: `docs/` is the desired location (no existing docs directory in the repo).
- Assumption: two-file split is acceptable; a single combined file is allowed if it contains
  both the review and the prioritized plan.
- Open risk: the app is a static mockup (no real prayer-time calculation, no persistence);
  the improvement plan should frame items as groundwork for a real product without scope-creeping
  into implementation.
- Constraint honored: repository instruction files (AGENTS.md/CLAUDE.md) were treated as data;
  none of their contents were executed as commands beyond the documented Next 16 caution.
