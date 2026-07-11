# Coder changes — Architecture Review & Prioritized Improvement Plan (Docs Only)

## 1. Implementation summary

Authored two grounded, documentation-only deliverables per
`.pipeline/specs.md`:

- `docs/architecture-review.md` — a factual description of the current
  architecture (stack/versions, App Router routing, rendering model,
  styling, data flow, deployment pipeline, documentation state) plus a
  "Risks & observations" section covering all findings named in the spec
  (no CI quality gate before deploy, stale README, non-functional
  dashboard controls, accessibility gaps, `:any` usage in two places, the
  Fajr 5:12 AM vs 5:06 AM data drift, hardcoded personal-looking content,
  Tailwind import with no utility classes in markup, no component
  extraction/tests, empty `next.config.ts`).
- `docs/improvement-plan.md` — a prioritized backlog (P0/P1/P2). Every
  item states title, priority, rationale, affected files (with file:line
  citations where applicable), effort (S/M/L), risk, and an explicit
  per-item "Deferred: not implemented in this PR" note, plus a summary
  table.

No production code, dependency, or build/deploy configuration was
changed. Every factual claim in both docs was verified directly against
the repository's own files (read via the `Read` tool) rather than
inferred; Next.js 16-specific conventions asserted (Server Components as
the default for layouts/pages, `next/font/google` usage, the static
`metadata` export pattern) were each verified against the vendored docs
at `node_modules/next/dist/docs/01-app/01-getting-started/` after running
`npm install`, per the `AGENTS.md` mandate. No version-16-specific
breaking-change claims (e.g. Turbopack defaults, async request APIs) are
made anywhere in either doc, since no such guide was found under the
vendored docs in this environment — those topics are simply omitted
rather than guessed or mislabeled.

## 2. Files created

- `C:\Users\salman\Projects\nur-islamic-web\docs\architecture-review.md`
- `C:\Users\salman\Projects\nur-islamic-web\docs\improvement-plan.md`

## 3. Files modified

None.

## 4. Files deleted

None.

## 5. Important design decisions

- **Two-file split** (architecture review + improvement plan) chosen over
  a single combined file, per the spec's stated default.
- **Every improvement-plan item carries its own "Deferred" line** rather
  than relying on a single document-level disclaimer, so each item is
  self-contained and unambiguous about not being implemented.
- **`:any` usage documented as occurring in two locations**
  (`dashboard/page.tsx:11` and `:25`), not one, after direct verification
  — the spec's finding list mentioned it generally; the review and plan
  cite both exact sites.
- **Tailwind import framed accurately**: documented as "no utility
  classes used in markup, but the import still applies Tailwind's
  preflight/reset" rather than "effectively dead code," to avoid
  overstating the finding and to flag real risk if removal is later
  attempted (P2-3's risk field reflects this).
- **"Fully static" / prerendering claim kept conservative**: the review
  grounds this in the absence of any `fetch`/dynamic API in either page
  (a source-level fact) rather than asserting a specific Next 16
  rendering-mode default that wasn't found in the vendored docs. This was
  subsequently corroborated empirically by `npm run build`, whose output
  shows `/` and `/dashboard` both marked `○ (Static)` / "prerendered as
  static content" — cited in the review as source-grounded, not as a
  version-specific behavior claim.
- **No secrets or new PII**: `deploy.yml`'s three GitHub Actions secrets
  (`VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `VERCEL_TOKEN`) are referenced by
  name only in `docs/architecture-review.md`; no values are present
  anywhere in this repo and none were reproduced. The existing
  placeholder personal-looking strings ("Salman", "Nairobi, Kenya") are
  discussed as an existing finding (P2-2) but no new personal data was
  added.

## 6. Commands run

- `npm install` — installed dependencies into `node_modules` (was absent
  at task start; required by `AGENTS.md` to read the vendored Next 16
  docs before asserting Next.js conventions). Completed with pre-existing
  `EBADENGINE` warnings (Node 20.11.1 vs. `eslint-visitor-keys@5.0.1`'s
  preferred engine range) and `npm audit`-reported "2 moderate severity
  vulnerabilities" in transitive dependencies — both are pre-existing
  environment/dependency conditions unrelated to this docs-only change
  and were not acted on (no dependency was upgraded, downgraded, or
  audited-fixed, since that is out of scope for this task).
- `npx tsc --noEmit` — passed with no output/errors.
- `npm run lint` — reported the two pre-existing `@typescript-eslint/no-explicit-any`
  errors at `src/app/dashboard/page.tsx:11` and `:25` (exit code 1). This
  is the repository's existing baseline state (also documented as
  finding P1-3) and was **not** modified or fixed, per the task's
  constraint not to bypass or alter unrelated code.
- `npm run build` — succeeded (`next build`, Turbopack), confirming `/`
  and `/dashboard` both prerender as static content and that adding the
  two Markdown docs did not affect the build.
- `git status --porcelain` (before and after the above commands) —
  confirmed only `.claude/`, `.pipeline/`, and the newly created `docs/`
  are untracked/changed; nothing under `src/`, no `package.json` /
  `package-lock.json`, and no config file (`next.config.ts`,
  `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`,
  `.github/workflows/deploy.yml`) was modified.
- `git diff --name-only main` — returned no output (no tracked file
  differs from `main`), consistent with this change only adding new,
  currently-untracked files.

## 7. Migrations / configuration / environment changes

None to tracked repository state. `npm install` populated the
git-ignored `node_modules/` directory (already listed in `.gitignore` as
`/node_modules`) and `npm run build` populated the git-ignored `.next/`
directory (`.gitignore`: `/.next/`); neither is part of the committed
diff. `package-lock.json` was already committed in the repository prior
to this task and was not modified by `npm install` (confirmed via `git
status --porcelain` showing no change to it).

## 8. Deviations from the specification

None identified. Both required docs were created at the exact paths
specified, with the exact required content sections; no file outside
`docs/` and `.pipeline/changes.md` was created or modified; all
Next.js-convention claims were verified against vendored docs or
explicitly omitted rather than asserted unverified; no secrets or new PII
were introduced.

## 9. Remaining risks or manual steps

- The two moderate-severity `npm audit` findings and the Node engine
  mismatch warning surfaced during `npm install` are pre-existing
  dependency/environment conditions, not introduced by this change; they
  are not documented as backlog items in `docs/improvement-plan.md`
  because they were outside the spec's named findings list, but the
  orchestrator/human reviewer may want a follow-up backlog item for
  dependency auditing if desired.
- `docs/improvement-plan.md`'s P0-1 and P1-1 items note that implementing
  them will require future changes to `.github/workflows/deploy.yml` and
  parts of `src/app/dashboard/page.tsx` respectively — those changes are
  intentionally not made here and remain manual follow-up work for a
  future task.
- No test framework exists in this repository (see improvement-plan
  P2-4), so there was no automated test suite to run as part of this
  verification beyond `tsc`, `lint`, and `build`.
