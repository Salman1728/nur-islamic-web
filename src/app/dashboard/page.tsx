'use client';
import Link from 'next/link';
import { BookOpen, CalendarDays, Check, ChevronRight, Compass, GraduationCap, HandHeart } from 'lucide-react';
import AppShell from '@/components/app-shell';
import { LiveMark } from '@/components/content-page';
import { useSettings } from '@/lib/settings';
import { PRAYERS, formatCountdown, formatTime, placeHour, prayerState, useNow } from '@/lib/prayer';
import { hadithOfDay, sunnahUrl } from '@/lib/hadith';
import { LocationBanner } from '@/components/location-banner';
import { useJourney } from '@/lib/use-journey';
import type { LastRead } from '../quran/[n]/reader';
import { formatGregorian, formatHijri, upcomingOccasions, HIJRI_MONTHS } from '@/lib/hijri';
import { dayKey, useStored, type TrackerLog } from '@/lib/store';
import { LESSONS } from '@/lib/content';

const quick = [
  [GraduationCap, 'Learn Salah', 'Step-by-step prayer guide', '/learn-salah'],
  [BookOpen, 'Read Qur’an', 'Read, listen and reflect', '/quran'],
  [Compass, 'Qibla Finder', 'Face the Kaaba', '/qibla'],
  [HandHeart, 'Daily Duas', 'Duas for every moment', '/duas'],
  [CalendarDays, 'Islamic Calendar', 'Hijri dates & occasions', '/calendar'],
] as const;

const greeting = (h: number) => (h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');

export default function Dashboard() {
  const { settings } = useSettings();
  const now = useNow(1000);
  const [log, setLog] = useStored<TrackerLog>('nur.tracker', {});
  const [done] = useStored<string[]>('nur.lessons', []);
  const journey = useJourney();
  const [lastRead] = useStored<LastRead>('nur.quran.last', null);
  const state = now ? prayerState(now, settings) : null;
  const day = state?.day ?? null; // calendar day at the chosen place
  const today = day ? log[dayKey(day)] ?? [] : [];
  const events = day ? upcomingOccasions(day, 3) : [];
  const hadith = day ? hadithOfDay(day) : null;
  const nextLesson = LESSONS.find(l => !done.includes(l.slug)) ?? LESSONS[0];
  const pct = Math.round((done.length / LESSONS.length) * 100);

  const progress = state && now ? Math.min(100, ((now.getTime() - state.prevTime.getTime()) / (state.next.time.getTime() - state.prevTime.getTime())) * 100) : 0;
  const toggle = (p: string) => day && setLog(prev => {
    const k = dayKey(day); const cur = prev[k] ?? [];
    return { ...prev, [k]: cur.includes(p) ? cur.filter(x => x !== p) : [...cur, p] };
  });

  return (
    <AppShell>
      <main className="dashboard-content">
        <div className="welcome-row">
          <div>
            <LiveMark />
            <h1>Assalamu Alaikum{settings.name ? `, ${settings.name}` : ''}</h1>
            <p>{now ? `${greeting(placeHour(now, settings))}. May Allah bless your day and guide your steps.` : 'May Allah bless your day and guide your steps.'}</p>
          </div>
          <div className="date-card">
            <b>{day ? formatHijri(day) : ' '}</b>
            <small>{day ? formatGregorian(day) : ' '}</small>
          </div>
        </div>
        <LocationBanner />

        <div className="dashboard-grid">
          <div className="main-column">
            <div className="top-cards">
              <article className="next-prayer">
                <small>Next prayer</small>
                <h2>{state?.next.name ?? '—'}</h2>
                <strong>{state ? formatTime(state.next.time, settings) : '--:--'}</strong>
                <p>{state && now ? `in ${formatCountdown(state.next.time.getTime() - now.getTime())}` : ' '}</p>
                <div className="time-progress" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Time until next prayer"><i style={{ width: `${progress}%` }} /></div>
                <Link href="/prayer">All prayer times <ChevronRight size={15} /></Link>
              </article>

              <article className="card prayer-list">
                <h3>Today’s prayers</h3>
                {(state?.today ?? []).map(p => {
                  const isPrayer = p.name !== 'Sunrise';
                  const prayed = today.includes(p.name);
                  return (
                    <div key={p.name} className={`${p.name === state?.current ? 'current' : ''} ${!isPrayer ? 'muted' : ''}`}>
                      {isPrayer
                        ? <button className={`tick ${prayed ? 'on' : ''}`} onClick={() => toggle(p.name)} aria-pressed={prayed} aria-label={`Mark ${p.name} as prayed`}>{prayed && <Check size={12} />}</button>
                        : <span className="tick ghost" />}
                      <span>{p.name}</span>
                      <b>{formatTime(p.time, settings)}</b>
                    </div>
                  );
                })}
                <small>{PRAYERS.filter(p => today.includes(p)).length} of 5 marked · <Link href="/tracker">tracker</Link></small>
              </article>

              <article className="card verse-card">
                <h3>A verse to carry</h3>
                <div className="arabic" lang="ar" dir="rtl">إِنَّ مَعَ الْعُسْرِ يُسْرًا</div>
                <p>“Indeed, with hardship comes ease.”</p>
                <small>Surah Ash-Sharh · 94:6</small>
                {lastRead
                  ? <Link href={`/quran/${lastRead.surah}#ayah-${lastRead.ayah}`} className="text-link"><BookOpen size={15} /> Continue: {lastRead.name} · {lastRead.ayah}</Link>
                  : <Link href="/quran/94" className="text-link"><BookOpen size={15} /> Read the surah</Link>}
              </article>
            </div>

            <div className="quick-grid">
              {quick.map(([Icon, title, desc, href]) => (
                <Link href={href} key={title} className="quick-card">
                  <span className="arch-icon"><Icon size={20} /></span>
                  <h4>{title}</h4>
                  <p>{desc}</p>
                </Link>
              ))}
            </div>

            <div className="lower-grid">
              <article className="card lesson-card">
                <div className="card-title"><h3>{done.length === LESSONS.length ? 'Review a lesson' : 'Up next'}</h3><small>{nextLesson.minutes} min read</small></div>
                <div className="lesson-inner">
                  <h4>{nextLesson.title}</h4>
                  <p>{nextLesson.summary}</p>
                  <Link href={`/learn/${nextLesson.slug}`} className="primary-button small">Continue <ChevronRight size={15} /></Link>
                </div>
              </article>
              <article className="card progress-card">
                <div className="card-title"><h3>My learning journey</h3><span>{pct}%</span></div>
                <div className="progress-bar"><i style={{ width: `${pct}%` }} /></div>
                {LESSONS.slice(0, 5).map((l, i) => {
                  const d = done.includes(l.slug);
                  return <Link href={`/learn/${l.slug}`} key={l.slug} className={d ? 'done' : ''}><span>{d ? '✓' : i + 1}</span>{l.title}</Link>;
                })}
              </article>
            </div>
          </div>

          <aside className="right-column">
            {hadith && (
              <article className="card hadith-card">
                <div className="card-title"><h3>Hadith of the day</h3><Link href="/hadith">More</Link></div>
                <blockquote>{hadith.text}</blockquote>
                <p className="hadith-ref">Narrated by {hadith.narrator} · <a href={sunnahUrl(hadith.number)} target="_blank" rel="noreferrer">Sahih al-Bukhari {hadith.number}</a></p>
              </article>
            )}
            <article className="card dhikr">
              <h3>Daily dhikr</h3>
              <div className="arabic small" lang="ar" dir="rtl">سُبْحَانَ اللَّهِ وَبِحَمْدِهِ</div>
              <b>Subḥāna-Llāhi wa bi-ḥamdih</b>
              <p>Glory be to Allah and praise be to Him.</p>
              <span className="chip">100 times · Bukhari 6405</span>
            </article>
            <article className="card events">
              <div className="card-title"><h3>Coming up</h3><Link href="/calendar">Calendar</Link></div>
              {events.map(e => (
                <div key={e.title}>
                  <b>{e.date.toLocaleDateString('en-GB', { day: '2-digit' })}<small>{e.date.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase()}</small></b>
                  <span><strong>{e.title}</strong><small>{e.hijri.day} {HIJRI_MONTHS[e.hijri.month - 1]} {e.hijri.year} · expected</small></span>
                </div>
              ))}
            </article>
            <article className="card beginner">
              <span className="page-eyebrow">{journey.doneCount === 0 ? 'New to Islam?' : `My first 30 days · ${journey.doneCount}/30`}</span>
              {journey.current ? (
                <>
                  <h3>{journey.doneCount === 0 ? 'Start your journey here.' : journey.current.title}</h3>
                  <p>{journey.doneCount === 0 ? 'One small step a day — lessons, prayer practice and your first prayers, at your own pace.' : journey.current.note}</p>
                  <Link href={journey.doneCount === 0 ? '/journey' : journey.current.href} className="primary-button small">{journey.doneCount === 0 ? 'Begin day 1' : journey.current.cta} <ChevronRight size={15} /></Link>
                </>
              ) : (
                <>
                  <h3>All 30 steps complete.</h3>
                  <p>MashaAllah. Revisit any step whenever you like.</p>
                  <Link href="/journey" className="primary-button small">See your journey <ChevronRight size={15} /></Link>
                </>
              )}
            </article>
          </aside>
        </div>
      </main>
    </AppShell>
  );
}
