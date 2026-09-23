'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpen, BookText, CalendarDays, CheckCircle2, Compass, GraduationCap, HandHeart, Home, MapPin, Menu, MoonStar, Search, Settings, Sparkles, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSettings } from '@/lib/settings';
import { formatCountdown, formatTime, prayerState, useNow } from '@/lib/prayer';
import { DUAS, LESSONS, TERMS } from '@/lib/content';

export const NAV = [
  [Home, 'Dashboard', '/dashboard'],
  [MoonStar, 'Prayer Times', '/prayer'],
  [BookOpen, 'Qur’an', '/quran'],
  [Sparkles, 'Learn Islam', '/learn'],
  [GraduationCap, 'Learn Salah', '/learn-salah'],
  [HandHeart, 'Duas & Adhkar', '/duas'],
  [Compass, 'Qibla Finder', '/qibla'],
  [CalendarDays, 'Islamic Calendar', '/calendar'],
  [CheckCircle2, 'Prayer Tracker', '/tracker'],
  [BookText, 'Glossary', '/terms'],
  [Settings, 'Settings', '/settings'],
] as const;

type Hit = { label: string; hint: string; href: string };

const INDEX: Hit[] = [
  ...NAV.map(([, label, href]) => ({ label, hint: 'Page', href })),
  ...LESSONS.map(l => ({ label: l.title, hint: 'Lesson', href: `/learn/${l.slug}` })),
  ...DUAS.map(d => ({ label: `Dua: ${d.title}`, hint: 'Dua', href: `/duas#${d.id}` })),
  ...TERMS.map(([t]) => ({ label: t, hint: 'Glossary', href: `/terms?q=${encodeURIComponent(t)}` })),
];

function SearchBox() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const hits = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    return INDEX.filter(h => h.label.toLowerCase().includes(needle)).slice(0, 7);
  }, [q]);

  useEffect(() => {
    const close = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setQ(''); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const go = (h: Hit) => { setQ(''); router.push(h.href); };

  return (
    <div className="searchbox" ref={box}>
      <Search size={17} aria-hidden="true" />
      <input
        value={q}
        placeholder="Search pages, lessons, duas, terms…"
        aria-label="Search"
        onChange={e => { setQ(e.target.value); setActive(0); }}
        onKeyDown={e => {
          if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, hits.length - 1)); }
          if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
          if (e.key === 'Enter' && hits[active]) go(hits[active]);
          if (e.key === 'Escape') setQ('');
        }}
      />
      {q.trim() && (
        <div className="search-results" role="listbox">
          {hits.length === 0 && <p className="search-empty">Nothing found for “{q}”.</p>}
          {hits.map((h, i) => (
            <button key={h.href + h.label} role="option" aria-selected={i === active} className={i === active ? 'on' : ''} onMouseEnter={() => setActive(i)} onClick={() => go(h)}>
              <span>{h.label}</span><small>{h.hint}</small>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { settings } = useSettings();
  const now = useNow(1000);
  const state = now ? prayerState(now, settings) : null;
  const initial = settings.name.trim().charAt(0).toUpperCase();

  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; }, [open]);

  return (
    <div className="app-shell" data-phase={state?.phase ?? 'dhuhr'}>
      <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Main navigation">
        <div className="side-head">
          <Link href="/" className="side-brand"><span className="brand-mark"><MoonStar size={20} /></span><span><strong>Nur</strong><small>Your Islamic Companion</small></span></Link>
          <button className="side-close" aria-label="Close menu" onClick={() => setOpen(false)}><X /></button>
        </div>
        <nav>
          {NAV.map(([Icon, label, href]) => {
            const on = pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/'));
            return <Link onClick={() => setOpen(false)} key={href} href={href} className={on ? 'active' : ''} aria-current={on ? 'page' : undefined}><Icon size={18} />{label}</Link>;
          })}
        </nav>
        <Link href="/prayer" className="side-next" onClick={() => setOpen(false)}>
          <small>Next prayer</small>
          <strong>{state ? state.next.name : '—'}</strong>
          <span>{state && now ? `${formatTime(state.next.time, settings.hour24)} · in ${formatCountdown(state.next.time.getTime() - now.getTime())}` : ' '}</span>
        </Link>
      </aside>
      {open && <button className="mobile-overlay" aria-label="Close menu" onClick={() => setOpen(false)} />}
      <div className="workspace">
        <header className="topbar">
          <button className="mobile-menu" aria-label="Open menu" onClick={() => setOpen(true)}><Menu /></button>
          <SearchBox />
          <div className="top-meta">
            <Link href="/settings" className="location"><MapPin size={15} />{settings.place}</Link>
            <Link href="/settings" className="avatar" aria-label="Settings">{initial || <Settings size={16} />}</Link>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
