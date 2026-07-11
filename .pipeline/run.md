# Pipeline Run

- **Request:** Make the dashboard navigation and controls functional and accessible: create stub pages (consistent layout, "coming soon" content) for all sidebar destinations (Prayer Times, Qur'an, Learn Islam, Learn Salah, Duas & Adhkar, Qibla Finder, Islamic Calendar, Prayer Tracker, Settings); convert sidebar anchors to real Next.js Links with hrefs; make the search a real input; add aria-labels to icon-only buttons (bell, mobile menu); add lang="ar" dir="rtl" to dashboard Arabic text; keep the existing visual design system (globals.css tokens, Marcellus/Mulish/Amiri fonts)
- **Branch:** claude/dashboard-nav-a11y
- **Base branch:** main
- **Timestamp:** 2026-07-11
- **Note:** Per user's saved standard workflow — coder loads design skills context; UI audit pass (mobile-first, accessibility, code-review-ui, QA) runs before PR.
