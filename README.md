# Nur — Your Islamic Companion

Nur is a web companion for daily Islamic life: prayer times, Qur'an reading, duas, learning resources, and a personal dashboard. The current build is a static front-end — content is hardcoded while the product takes shape (see [docs/improvement-plan.md](docs/improvement-plan.md) for what's next).

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router, Server Components) — **note:** this Next.js version has breaking changes; consult the vendored guides in `node_modules/next/dist/docs/` before relying on conventions from older versions (see `AGENTS.md`)
- React 19, TypeScript (strict)
- Tailwind CSS v4 (via `@tailwindcss/postcss`) plus hand-written design tokens in `src/app/globals.css`
- [lucide-react](https://lucide.dev) icons
- Fonts via `next/font/google`: Marcellus (display), Mulish (body), Amiri (Arabic)

## Getting started

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (flat config, `eslint-config-next`) |
| `npx tsc --noEmit` | Type-check |

## Project structure

```
src/app/
  layout.tsx          Root layout, fonts, metadata
  page.tsx            Landing page ("day of light" prayer-cycle concept)
  dashboard/page.tsx  Dashboard (prayer times, daily verse, learning journey)
  globals.css         Design tokens + all styling
docs/                 Architecture review and improvement plan
```

## Deployment

Pushes to `main` deploy to production on Vercel via GitHub Actions (`.github/workflows/deploy.yml`). A quality job (lint, type-check, build) gates the deploy and also runs on pull requests. Required repository secrets: `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `VERCEL_TOKEN`.

## Documentation

- [Architecture review](docs/architecture-review.md) — current state of the codebase
- [Improvement plan](docs/improvement-plan.md) — prioritized backlog (P0–P2)
