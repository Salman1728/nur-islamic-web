# Implementation Spec — Dashboard Navigation & Accessibility

Feature branch: `claude/dashboard-nav-a11y` (base `main`)
Author: Planner stage
Grounding: verified against `src/app/*`, `globals.css`, and the vendored Next.js 16.2.10 docs in `node_modules/next/dist/docs/`.

---

## 1. Request summary

Make the dashboard navigation and controls functional and accessible, without changing the visual design system:

- Create stub ("coming soon") pages for all 9 sidebar destinations: Prayer Times, Qur'an, Learn Islam, Learn Salah, Duas & Adhkar, Qibla Finder, Islamic Calendar, Prayer Tracker, Settings.
- Convert dashboard sidebar `<a>` (no `href`) into real `next/link` `<Link>`s with `href`s; derive the active state from the current route instead of the hardcoded `true` on Dashboard.
- Make the topbar search a real, accessible `<input>` (stub — no backend search).
- Add `aria-label`s to icon-only controls (bell, mobile-menu; avatar handled per decision below).
- Add `lang="ar" dir="rtl"` to the dashboard's two `.arabic` divs.
- Keep the existing design system (globals.css tokens, custom classes, Marcellus/Mulish/Amiri fonts). Stub pages must feel intentional and on-brand.

---

## 2. Current architecture and relevant conventions

- Next.js **16.2.10**, React **19.2.4**, App Router, TypeScript `strict: true`. Path alias `@/*` → `./src/*` (`tsconfig.json`).
- `src/app/layout.tsx` — root layout: `<html lang="en" …>` with the three font CSS variables (`--font-display` Marcellus, `--font-body` Mulish, `--font-arabic` Amiri) and `<body>{children}</body>`. Exports `metadata`.
- `src/app/page.tsx` — landing page (`/`), server component, class `.landing-shell`. Uses `<Link href="/dashboard">` in multiple CTAs. Its Arabic verse already correctly uses `lang="ar" dir="rtl"` (`page.tsx:132`) — this is the pattern to mirror.
- `src/app/dashboard/page.tsx` — single dense **server component** at `/dashboard`. Renders the entire app shell inline: `<main className="app-shell">` → `<aside className="sidebar">` (brand `Link`, `<nav>` of un-`href`ed `<a>`, side-support/Donate) + `<section className="workspace">` → `<header className="topbar">` (mobile-menu button, `.searchbox` `<span>` placeholder, top-meta with location/`Bell`/avatar/name) + `<div className="dashboard-content">` (page content).
  - Nav data: `const nav: [LucideIcon, string, boolean?][]` — Dashboard has hardcoded `active = true`.
  - Two `.arabic` divs (verse `dashboard/page.tsx:24`, dhikr `dashboard/page.tsx:33`) lack `lang`/`dir`.
  - Note: the `:any` issue described in `docs/improvement-plan.md` P1-3 does **not** exist in the current file (tuples are already typed); ignore it.
- `src/app/globals.css` — single stylesheet. Design tokens in `:root`. Landing styles, then a `═════ Dashboard (app shell) ═════` block (line ~215) with `.app-shell`, `.sidebar`, `.workspace`, `.topbar`, `.searchbox`, `.avatar`, `.mobile-menu`, `.dashboard-content`, `.arabic`, `.quick-card`, etc.
  - **Important CSS fact:** several dashboard buttons are styled by **tag selector**, not class — e.g. `.next-prayer button {…}` and `.verse-card button {…}`. This matters when converting buttons to links (see §3.7, §7). By contrast `.quick-card` and `.sidebar nav a` are class/tag selectors that survive the conversions planned here.
- Responsive breakpoints (must be respected): **1100px**, **820px**, **560px**. At ≤820px `.sidebar { display: none }`, `.mobile-menu { display: block }`, `.searchbox { display: none }`.
- Icons: `lucide-react`. Global `:focus-visible { outline: 2px solid var(--gold) … }` already exists.
- No test framework, no `tsc`/`typecheck` script (only `dev`, `build`, `start`, `lint`). Verification uses `npm run lint`, `npx tsc --noEmit`, `npm run build`.

### Next.js 16 conventions confirmed from vendored docs
- **Route groups** `(app)` organize routes without affecting the URL (`.../file-conventions/route-groups.md`). A `layout.tsx` inside the group wraps all its pages and does NOT need `<html>`/`<body>` (that stays in the root layout).
- **`usePathname`** is a Client Component hook from `next/navigation`; reading the current URL in a Server Component is unsupported — so active-state logic requires a `'use client'` component (`.../functions/use-pathname.md`).
- **`<Link>`** from `next/link` with `href` is the primary navigation primitive; it renders an `<a>`, can be used inside a layout, and is auto-prefetched (`.../linking-and-navigating.md`).

---

## 3. Scope

1. Introduce a `(app)` route group with a shared `layout.tsx` that renders the app shell (sidebar + topbar + main region) exactly once, replacing the shell that is currently inlined in the dashboard page.
2. Move the dashboard into the group and strip the shell from it, keeping only its `.dashboard-content` body.
3. Client `Sidebar` component: real `<Link>`s with `href`s; active state derived from `usePathname`.
4. Client `SearchBox` component: accessible controlled `<input>` stub.
5. Nine on-brand stub pages via a shared server `StubPage` component.
6. Accessibility: `aria-label`s on icon-only controls, `aria-hidden` on decorative icons/emoji as noted, `lang="ar" dir="rtl"` on dashboard Arabic, a single `<main>` landmark.
7. Wire the dashboard's unambiguous in-page controls to their new routes (see §4 decision): the 5 quick-cards, "View All Prayer Times" (`/prayer-times`), and "Read in Qur'an" (`/quran`). This directly serves "make controls functional."
   - **CSS caveat (must be honored):** the quick-cards are styled by the **class** `.quick-card`, so `<article>`→`<Link>` keeps their styling. But "View All Prayer Times" and "Read in Qur'an" are **class-less `<button>`s styled by tag selectors** (`.next-prayer button` and `.verse-card button`). Converting them to `<Link>` (which renders an `<a>`) would drop all their styling. Therefore each converted link gets `className="cta"` AND the two CSS rules are broadened to also match `.cta` (see §7). Do **not** nest a `<button>` inside a `<Link>` (invalid HTML).
8. Minimal additive/targeted CSS for the stub page, the search input, and the two CTA-link selectors, using existing tokens/naming.

---

## 4. Out of scope (explicit)

- **No backend, no real search.** `SearchBox` is a stub input; submitting does nothing (prevented default). No search route, no results.
- **No prayer-time calculation / real data.** All prayer times, dates, verses, dhikr, progress remain the existing hardcoded placeholders.
- **No Donate/payment flow.** The Donate button keeps its visible text label and stays a plain `<button>` with **no `href` and no handler**.
- **Mobile navigation drawer is NOT implemented** (see §9 and §15 — this is the primary open risk). The mobile-menu button gets an `aria-label` only, no toggle behavior.
- **Bell / notifications:** `aria-label` only, **no `href`** (no notifications route exists).
- **CTA buttons with no clear destination stay inert:** "Continue" (lesson), "Start Learning" (beginner), "Donate", and the next-prayer/verse buttons other than the two named in §3.7. Wiring these is a defensible follow-up, not this change.
- No changes to the root layout's fonts, the landing page, `next.config.ts`, CI workflow, README, Tailwind decision, or the Fajr-time data drift (improvement-plan P2 items).

**Decision record for icon controls (task required this be explicit):**

| Control | Current | Decision |
|---|---|---|
| Bell | `<Bell/>` bare | Wrap in `<button aria-label="Notifications">`, **no href**, no handler |
| Mobile menu | `<button className="mobile-menu"><Menu/></button>` | `aria-label` (see §9/§15 — inert this change) |
| Avatar | `<span className="avatar">S</span>` beside `<b>Salman</b>` | Add `aria-hidden="true"` (initials duplicate the adjacent visible name; not interactive) |
| Donate | `<button>Donate</button>` | Unchanged — visible text label, no aria-label needed, no href |
| Location `📍` / `🌿` emoji | inline in copy | Wrap emoji in `<span aria-hidden="true">` (decorative) |

---

## 5. Exact files to create, modify, or delete

### Create
- `src/app/(app)/layout.tsx` — shared app-shell layout (server component).
- `src/app/(app)/_components/Sidebar.tsx` — `'use client'` sidebar with active-state nav.
- `src/app/(app)/_components/SearchBox.tsx` — `'use client'` accessible search input stub.
- `src/app/(app)/_components/StubPage.tsx` — server component; reusable "coming soon" page body.
- `src/app/(app)/prayer-times/page.tsx`
- `src/app/(app)/quran/page.tsx`
- `src/app/(app)/learn-islam/page.tsx`
- `src/app/(app)/learn-salah/page.tsx`
- `src/app/(app)/duas/page.tsx`
- `src/app/(app)/qibla/page.tsx`
- `src/app/(app)/calendar/page.tsx`
- `src/app/(app)/tracker/page.tsx`
- `src/app/(app)/settings/page.tsx`

### Move + modify
- `src/app/dashboard/page.tsx` → `src/app/(app)/dashboard/page.tsx`
  - Remove the shell (`app-shell`/`sidebar`/`workspace`/`topbar`); return only the `.dashboard-content` body.
  - Add `lang="ar" dir="rtl"` to both `.arabic` divs.
  - Wire in-page controls to routes (§3.7); add `className="cta"` to the two converted CTA links; wrap decorative emoji in `aria-hidden` spans.
  - Drop now-unused imports (`Home`, `Menu`, `Search`, `Bell`, `Settings`, `CheckCircle2`, `Sparkles`, `MoonStar` — keep only what the body still uses: `BookOpen`, `ChevronRight`, and the `quick` icon set `GraduationCap`, `Compass`, `HandHeart`, `CalendarDays`; verify against final JSX).

> The move keeps the URL `/dashboard` (route groups don't alter URLs), so the landing page's `Link href="/dashboard"` CTAs keep working. Perform as a git move so history is preserved.

### Modify
- `src/app/globals.css` — (a) **append** additive rules: `.searchbox input`, `.app-main`, and a `.stub-page` / `.stub-*` block; (b) **broaden two existing rules** so the CTA links keep their styling: `.next-prayer button` → `.next-prayer button, .next-prayer .cta` and `.verse-card button` → `.verse-card button, .verse-card .cta` (see §7). These two edits are deliberate and necessary; they are the only edits to existing rules.

### Delete
- After the move, the empty `src/app/dashboard/` folder must not remain (git move handles this).

### Unchanged
- `src/app/layout.tsx`, `src/app/page.tsx`, `next.config.ts`, `package.json`, `tsconfig.json`.

---

## 6. Interfaces, components, functions, routes, and signatures

### Routes (final URL map)

| Nav label | URL | File |
|---|---|---|
| Dashboard | `/dashboard` | `(app)/dashboard/page.tsx` |
| Prayer Times | `/prayer-times` | `(app)/prayer-times/page.tsx` |
| Qur'an | `/quran` | `(app)/quran/page.tsx` |
| Learn Islam | `/learn-islam` | `(app)/learn-islam/page.tsx` |
| Learn Salah | `/learn-salah` | `(app)/learn-salah/page.tsx` |
| Duas & Adhkar | `/duas` | `(app)/duas/page.tsx` |
| Qibla Finder | `/qibla` | `(app)/qibla/page.tsx` |
| Islamic Calendar | `/calendar` | `(app)/calendar/page.tsx` |
| Prayer Tracker | `/tracker` | `(app)/tracker/page.tsx` |
| Settings | `/settings` | `(app)/settings/page.tsx` |

### `(app)/layout.tsx` (server component)
Signature: `export default function AppLayout({ children }: { children: React.ReactNode })`
Renders:
```
<div className="app-shell">
  <Sidebar />
  <div className="workspace">
    <header className="topbar">
      <button className="mobile-menu" aria-label="Open navigation menu"><Menu/></button>
      <SearchBox />
      <div className="top-meta">
        <span><span aria-hidden="true">📍</span> Nairobi, Kenya</span>
        <button aria-label="Notifications"><Bell size={19}/></button>
        <span className="avatar" aria-hidden="true">S</span>
        <b>Salman</b>
      </div>
    </header>
    <main className="app-main">{children}</main>
  </div>
</div>
```
- Server component (may import the client `Sidebar`/`SearchBox`).
- No `metadata` export required here (optional; per-page titles preferred).

### `_components/Sidebar.tsx` (`'use client'`)
- `import { usePathname } from 'next/navigation'` and `import Link from 'next/link'`.
- Nav model, typed (no `any`):
  ```ts
  type NavItem = { icon: LucideIcon; label: string; href: string };
  const NAV: readonly NavItem[] = [ … 10 entries per §6 route map … ];
  ```
- Active logic: `const active = pathname === item.href || pathname.startsWith(item.href + '/')`. Apply `className={active ? 'active' : undefined}` and `aria-current={active ? 'page' : undefined}`.
- Brand `<Link href="/" className="side-brand">` (unchanged markup).
- Side-support/Donate block unchanged (Donate stays a plain `<button>`).
- Export default `Sidebar`.

### `_components/SearchBox.tsx` (`'use client'`)
- `const [q, setQ] = useState('')`.
- Render:
  ```
  <form role="search" className="searchbox" onSubmit={e => e.preventDefault()}>
    <Search size={18} aria-hidden="true" />
    <input aria-label="Search" placeholder="Search anything..." value={q}
           onChange={e => setQ(e.target.value)} />
  </form>
  ```
- Controlled input with `onSubmit` preventDefault so Enter does not reload the page (chosen over a bare `<form>` for exactly this reason). Accessible name via `aria-label` (no visible label needed); icon is decorative.

### `_components/StubPage.tsx` (server component)
- Props interface:
  ```ts
  interface StubPageProps {
    icon: LucideIcon;
    title: string;      // e.g. "Prayer Times"
    description: string; // 1–2 sentence on-brand blurb
    points?: string[];   // optional "what's coming" bullets
  }
  ```
- Renders inside the content region:
  ```
  <div className="dashboard-content">
    <section className="stub-page">
      <span className="stub-icon"><Icon /></span>
      <span className="eyebrow">Coming soon</span>
      <h1>{title}</h1>
      <p>{description}</p>
      {points?.length ? <ul className="stub-points">…</ul> : null}
      <Link href="/dashboard" className="primary-button">Back to Dashboard</Link>
    </section>
  </div>
  ```
- Reuses existing `.dashboard-content` (padding), `.eyebrow`, `.primary-button` classes; `.stub-*` are new.

### Stub page files (thin wrappers)
Each is a server component, e.g. `(app)/prayer-times/page.tsx`:
```tsx
import { MoonStar } from 'lucide-react';
import StubPage from '../_components/StubPage';
export const metadata = { title: 'Prayer Times — Nur' }; // optional but recommended
export default function Page() {
  return <StubPage icon={MoonStar} title="Prayer Times"
    description="Accurate daily prayer times with a clear next-prayer countdown are on the way." />;
}
```
Icon per page (match the sidebar/quick-card icons already used in the dashboard): Prayer Times `MoonStar`, Qur'an `BookOpen`, Learn Islam `Sparkles`, Learn Salah `GraduationCap`, Duas & Adhkar `HandHeart`, Qibla Finder `Compass`, Islamic Calendar `CalendarDays`, Prayer Tracker `CheckCircle2`, Settings `Settings`.

---

## 7. Data model, migration, API, configuration changes

- **Data model / schema / migrations: NONE.** This is a static, presentational feature; there is no database, ORM, or persisted state in the repo. (A Supabase MCP server exists in the environment, but this repo has no Supabase integration and this change introduces none.)
- **API: NONE.** No route handlers, server actions, or endpoints.
- **Configuration: NONE.** No changes to `next.config.ts`, `package.json`, `tsconfig.json`, ESLint, or PostCSS.
- **CSS changes in `globals.css`:**
  - *(append)* `.app-main { min-width: 0; }` — preserves the `minmax(0,1fr)` overflow behavior the grids rely on (formerly carried by `.workspace`).
  - *(append)* `.searchbox input { border: 0; background: transparent; outline: none; width: 100%; font: inherit; color: var(--ink); }` and `.searchbox input::placeholder { color: #84908b; }` (matches current `.searchbox` text color). `.searchbox` keeps its existing pill styling and becomes a `<form>` — safe because it is styled by class, not tag.
  - *(edit existing — required by §3.7)* broaden the two tag-scoped button rules so the converted CTA links keep their exact look:
    - `.next-prayer button` → `.next-prayer button, .next-prayer .cta`
    - `.verse-card button` → `.verse-card button, .verse-card .cta`
    - Rationale: `next/link` renders an `<a>`, which no longer matches the `button` tag selector; adding `.cta` to the selector restores the pill/border and the green icon+text `inline-flex gap` styling. No visual change to any element (the `<a>` inherits exactly what the `<button>` had).
  - *(append)* `.stub-page` block: centered card within `.dashboard-content`, e.g. `display: grid; justify-items: center; text-align: center; gap: 14px; max-width: 560px; margin: 8vh auto 0; padding: 40px 24px; background: var(--card); border: 1px solid var(--line); border-radius: 18px; box-shadow: 0 7px 20px rgba(30,60,50,.05);` — reuses the card visual language.
  - *(append)* `.stub-icon` — reuse the quick-card circle idiom: `width: 64px; height: 64px; border-radius: 50%; display: grid; place-items: center; background: #f5ead0; color: var(--green);` (mirrors `.quick-card > span`).
  - `.stub-page h1` inherits the global display-font `h1` rule; `.stub-page p { color: var(--muted); line-height: 1.7; }`.
  - *(append, optional)* `.stub-points` — list styling with `--muted` text; keep minimal.
  - Responsive: the stub card is fluid (max-width + auto margins) and needs no new breakpoint rules; it inherits `.dashboard-content` padding at 820/560. Do **not** add entrance animations (see §9); if any are added they MUST be gated in the existing `@media (prefers-reduced-motion: reduce)` block.

---

## 8. Detailed implementation sequence

1. **Create the route group + layout.** Add `src/app/(app)/layout.tsx` with the shell markup from §6 (sidebar + workspace + topbar + `<main className="app-main">{children}</main>`). Import `Menu`, `Bell` (Search lives in SearchBox).
2. **Create `Sidebar.tsx`** (`'use client'`) with the typed `NAV` model, `usePathname` active logic, `<Link>`s, `aria-current`, brand link, and the unchanged side-support/Donate block.
3. **Create `SearchBox.tsx`** (`'use client'`) per §6.
4. **Move the dashboard** `src/app/dashboard/page.tsx` → `src/app/(app)/dashboard/page.tsx` (git move). Strip the shell; return only `<div className="dashboard-content"> … </div>`. Prune unused imports. Add `lang="ar" dir="rtl"` to both `.arabic` divs. Wrap the `🌿` emoji in the welcome `<h1>` in `<span aria-hidden="true">` (the `📍` location moves to the layout topbar).
5. **Wire in-page controls (§3.7):**
   - Convert the 5 `.quick-card` `<article>`s to `<Link>` (keep the `quick-card` className and inner markup identical), mapping to `/learn-salah`, `/quran`, `/qibla`, `/duas`, `/calendar`. (Class-scoped styling survives.)
   - Convert "View All Prayer Times" (`.next-prayer` button) to `<Link href="/prayer-times" className="cta">` and "Read in Qur'an" (`.verse-card` button) to `<Link href="/quran" className="cta">`, preserving their inner content (incl. the `BookOpen` icon on the verse CTA).
   - Broaden the two CSS selectors in `globals.css` per §7 so these two links keep their exact appearance.
6. **Create `StubPage.tsx`** per §6.
7. **Create the 9 stub page files** as thin wrappers with the correct icon/title/description and optional `metadata`.
8. **Apply CSS** from §7 to `globals.css` (append the new rules; edit the two existing selectors).
9. **Verify:** `npm run lint`, `npx tsc --noEmit`, `npm run build`; confirm all 10 routes appear in the build output; manual a11y + visual pass (§12).

---

## 9. Error states and edge cases

- **Unknown routes / 404:** No custom `not-found.tsx` is added; unknown URLs fall through to Next's default 404. Acceptable (themed 404 out of scope). Note as possible follow-up.
- **Active state on nested paths:** Use `pathname === href || pathname.startsWith(href + '/')` so a future `/quran/al-fatiha` still highlights "Qur'an". The `+ '/'` guard prevents false prefix matches (e.g. `/calendar` must not activate for `/calendarx`). The brand link (`/`) is excluded from active logic, so it never over-matches.
- **Dashboard exact match:** `/dashboard` uses the same rule; only Dashboard is active on `/dashboard`.
- **Reduced motion:** Stub pages ship with **no entrance animation** (simplest correct choice). The existing `@media (prefers-reduced-motion: reduce)` block already neutralizes landing animations; any new animation must be added there too.
- **Enter key in search:** `onSubmit` preventDefault stops a page reload; typing updates local state only.
- **Hydration:** `usePathname` in `Sidebar` is fine (no rewrites/proxy in this repo), so no hydration-mismatch mitigation needed.
- **Mobile (≤820px):** `.sidebar { display:none }` still hides the sidebar; the mobile-menu button is labeled but inert — the 9 new pages are only reachable via the wired in-page links on that screen size. See §15 risk #1.
- **Long labels / i18n:** Nav labels are fixed English strings; no wrapping concerns at current widths.

---

## 10. Security, privacy, authorization, validation

- **No secrets** introduced or referenced.
- **No auth/authorization model** exists in the repo; these are public static pages. No change.
- **Input validation:** the search input is a non-submitting stub; no data leaves the client, no injection surface. Value held in React state only. No `dangerouslySetInnerHTML`, no user-controlled URLs.
- **Privacy:** hardcoded placeholder "Salman"/"Nairobi, Kenya" are pre-existing mock strings (improvement-plan P2-2); not touched here, no real PII.
- **External nav:** all `<Link>`s are internal relative paths; no `target=_blank`/`rel` concerns.

---

## 11. Accessibility and responsive behavior

- **Landmarks:** exactly one `<main className="app-main">` per route (in the layout); sidebar is `<aside>` containing `<nav>`; topbar is `<header>`. No duplicate `<main>` (the dashboard's old `<main className="app-shell">` becomes a `<div>`).
- **Nav:** real `<Link>`s are keyboard-focusable and announced as links; the active link carries `aria-current="page"`.
- **Icon-only controls:** `aria-label` on mobile-menu and bell ("Notifications"); decorative icons (`Search`, sidebar/stub icons) get `aria-hidden="true"`; avatar `aria-hidden="true"` (name visible adjacent).
- **Search:** accessible name via `aria-label="Search"`; wrapped in `role="search"`.
- **Arabic text:** `lang="ar" dir="rtl"` on both dashboard `.arabic` divs, mirroring `page.tsx:132`. Confirm the existing `.arabic` centering/line-height still reads correctly with RTL (no `[dir]`-specific rule currently conflicts).
- **Emoji:** decorative emoji wrapped in `aria-hidden` spans.
- **Focus visibility:** relies on the existing global `:focus-visible` gold outline — verify it shows on the new links, the search input, and the labeled buttons.
- **Responsive:** reuse breakpoints 1100/820/560 unchanged. Shell grid (`.app-shell` 255px + 1fr), `.dashboard-grid`, `.top-cards`, `.quick-grid`, `.right-column` behavior preserved because markup classes are unchanged. Stub card is fluid and needs no new breakpoints. `.app-main { min-width:0 }` preserves inner-grid overflow.

---

## 12. Test plan (concrete cases)

Automated gates:
1. `npm run lint` — passes, no new warnings (esp. no `react-hooks`/`no-unused-vars` from pruned imports).
2. `npx tsc --noEmit` — passes under `strict`; `NavItem`/`StubPageProps` fully typed, no `any`.
3. `npm run build` — succeeds; build output lists all 10 app routes plus `/`. Confirm `Sidebar`/`SearchBox` are the only client components (small client bundle).

Manual / functional cases:
4. Each of the 10 sidebar links navigates to the correct URL; the target renders the shell + correct stub/dashboard body.
5. Active state: on `/dashboard` only Dashboard is highlighted; on `/quran` only Qur'an is; `aria-current="page"` present on the active link and absent elsewhere.
6. `/quran/anything` (typed) still highlights Qur'an (prefix rule) and shows Next's default 404 (no page) — acceptable.
7. Search: typing updates the field; pressing Enter does NOT reload/navigate; field has an accessible name (verify via devtools/AT).
8. Landing page `/` CTAs still reach `/dashboard` (regression check for the move).
9. Dashboard in-page controls **navigate**: the 5 quick-cards, "View All Prayer Times", and "Read in Qur'an" reach the correct routes; unchanged CTAs (Donate, Continue, Start Learning) remain inert.
10. **Dashboard in-page controls still look right (visual regression check for the button→link conversion):** "View All Prayer Times" keeps its bordered/transparent pill inside `.next-prayer`; "Read in Qur'an" keeps its solid-green pill with the `BookOpen` icon and `inline-flex` gap inside `.verse-card`; the 5 quick-cards keep their card layout, circle icon, and chevron. Confirm no styling was lost by the tag→`.cta` selector broadening.
11. a11y: run axe/Lighthouse on `/dashboard` and one stub — expect no "links without discernible name", "buttons without name", or "missing lang on RTL text" violations that this change targets. Verify Arabic divs expose `lang="ar" dir="rtl"`.
12. Reduced motion: with `prefers-reduced-motion: reduce`, no new animation appears on stub pages.
13. Responsive smoke at 1101/820/560: shell, grids, and stub card render without overflow/broken layout; sidebar hidden ≤820 (known mobile gap, §15).

(No unit-test framework exists; adding Vitest + a render smoke test would be a separate follow-up — out of scope here.)

---

## 13. Acceptance criteria

- All 9 stub routes plus `/dashboard` exist, render inside the shared shell, and are visually on-brand ("coming soon" with icon, eyebrow, description, Back-to-Dashboard link).
- Sidebar items are real `<Link>`s with correct `href`s; active state derives from `usePathname` (no hardcoded `active`), with `aria-current="page"` on the active item.
- Topbar search is a real accessible `<input>` (labeled, `role="search"`) that does not submit/reload.
- Mobile-menu and bell have `aria-label`s; avatar is `aria-hidden`; Donate unchanged.
- Both dashboard `.arabic` divs have `lang="ar" dir="rtl"`.
- The two converted CTA links and the 5 quick-card links keep their exact prior appearance (verified per §12.10).
- Design system otherwise unchanged: no token edits; existing classes reused; only additive `.stub-*`/`.searchbox input`/`.app-main` CSS plus the two deliberate `.cta` selector broadenings.
- `/dashboard` URL preserved; landing CTAs still work.
- `lint`, `tsc --noEmit`, and `build` all pass; exactly one `<main>` per route.

---

## 14. Rollback / compatibility notes

- **URL compatibility:** the route-group move preserves `/dashboard`; `src/app/page.tsx` (multiple `Link href="/dashboard"`) and the existing Vercel deploy are unaffected. New URLs are additive.
- **Rollback:** revert the branch. The only destructive step is moving `dashboard/page.tsx` into `(app)/` — a `git revert`/branch-reset restores it. No data or config migration to undo.
- **Client-bundle impact:** two small client components (`Sidebar`, `SearchBox`) are added to a previously all-server dashboard; this is the intended, scoped trade-off (per improvement-plan P1-1 risk) and is minimal.
- **CSS:** additions are non-breaking; the only edits to existing rules are the two `.cta` selector broadenings (§7), which are additive within each selector list and produce no visual change to existing elements. Net: no visual regression expected (verified §12.10).

---

## 15. Assumptions and open risks

1. **RISK #1 — Mobile navigation gap (highest).** At ≤820px `.sidebar { display:none }` and the mobile-menu button is labeled but has no handler, so the 9 new stub pages are **unreachable via the sidebar on mobile**, and an icon button labeled as opening a menu that opens nothing can mislead assistive-tech users. This change deliberately keeps the drawer out of scope (the task's explicit bullets ask only for an `aria-label`, and minimal-change favors that). **Recommended follow-up:** a small client toggle that shows the sidebar as an overlay/drawer on mobile (state shared between the mobile-menu button and `Sidebar`), gated for reduced-motion. **If the orchestrator wants the "functional & accessible navigation" goal fully met on mobile, greenlight the drawer as an addition to this spec** — it is the single largest gap between the stated goal and what is delivered. Interim mitigation: the wired in-page dashboard links (§3.7) give mobile users a path to 5 of the sections. If the drawer stays out, consider neutral `aria-label` wording that does not promise an action.
2. **Slug assumptions.** URL slugs chosen (`/quran`, `/duas`, `/qibla`, `/calendar`, `/tracker`, `/learn-islam`, `/learn-salah`, `/prayer-times`, `/settings`). If a nested scheme is preferred (e.g. `/dashboard/quran`), the group/layout structure still works but `NAV` hrefs and file paths change. Flag if product prefers nested URLs.
3. **Stub copy** (descriptions/points) is placeholder text authored within brand voice; no product-approved copy provided.
4. **`StubPage` sharing vs. per-page duplication** — chose a shared component to avoid 9x duplication; assumes stubs stay uniform. A page needing bespoke content can inline instead.
5. **No 404 theming** — relies on Next default. Assumed acceptable.
6. **Verse/dhikr RTL rendering** — assumes the existing `.arabic` CSS reads correctly once `dir="rtl"` is applied (centered text; verified visually in §12.13). Low risk.

---

## 16. ORCHESTRATOR ADDENDUM — Mobile navigation drawer (approved scope addition)

The risk flagged in §15 #1 is accepted as in-scope: shipping "functional navigation" that is unreachable at <=820px contradicts the feature goal and the user's mobile-first quality bar.

Addition to scope:
- Make the mobile-menu button functional: it toggles a navigation drawer at <=820px that reuses the existing Sidebar component/markup (same links, same active state).
- Minimal implementation consistent with the spec architecture: a small client component (e.g. AppShell client wrapper or a MobileNav client component owning the button + drawer state). Keep server/client split as lean as the spec's Sidebar/SearchBox approach.
- A11y requirements: button gets aria-expanded and aria-controls; drawer closes on link navigation and Escape; focus is not trapped incorrectly; body scroll locked while open is optional.
- CSS: additive only, reusing existing tokens/breakpoints (drawer styled from the existing .sidebar rules where practical, e.g. a .sidebar.open override inside the 820px media query, plus an overlay/backdrop class).
- prefers-reduced-motion: respect the existing reduced-motion block for any drawer transition.

Everything else in §4 Out of scope remains out of scope.
