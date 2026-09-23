'use client';
import { Check } from 'lucide-react';
import { ContentPage } from '@/components/content-page';
import { useSettings } from '@/lib/settings';
import { PRAYERS, dayTimes, formatTime, useNow } from '@/lib/prayer';
import { dayKey, streak, useStored, type TrackerLog } from '@/lib/store';

export default function Tracker() {
  const now = useNow(60_000);
  const { settings } = useSettings();
  const [log, setLog] = useStored<TrackerLog>('nur.tracker', {});

  const toggle = (key: string, p: string) => setLog(prev => {
    const cur = prev[key] ?? [];
    return { ...prev, [key]: cur.includes(p) ? cur.filter(x => x !== p) : [...cur, p] };
  });

  if (!now) return <ContentPage eyebrow="Private progress" title="Prayer Tracker" description="A private way to notice your consistency."><div className="card tracker-card" /></ContentPage>;

  const key = dayKey(now);
  const today = log[key] ?? [];
  const times = dayTimes(now, settings);
  const week = Array.from({ length: 7 }, (_, i) => { const d = new Date(now); d.setDate(now.getDate() - (6 - i)); return d; });
  const run = streak(log, now);

  return (
    <ContentPage eyebrow="Private progress" title="Prayer Tracker" description="A private way to notice your consistency. It lives only in this browser — no accounts, no leaderboards, no pressure.">
      <div className="tracker-layout">
        <section className="card padded tracker-card">
          <div className="card-title"><h3>Today</h3><span className="muted-text">{today.length} of 5</span></div>
          {PRAYERS.map(p => {
            const on = today.includes(p);
            const t = times.find(x => x.name === p)!.time;
            const upcoming = t > now;
            return (
              <button className={`tracker-row ${on ? 'on' : ''}`} key={p} onClick={() => toggle(key, p)} aria-pressed={on}>
                <span className="tick">{on && <Check size={15} />}</span>
                <b>{p}</b>
                <small>{on ? 'Prayed' : upcoming ? `at ${formatTime(t, settings.hour24)}` : 'Not marked'}</small>
              </button>
            );
          })}
        </section>

        <div className="tracker-side">
          <section className="card streak-card">
            <strong>{run}</strong>
            <span>{run === 1 ? 'day' : 'days'} with all five prayers</span>
            <p>{run > 0 ? 'Keep going gently.' : 'Every prayer counts.'} Missing a prayer does not mean giving up on the day — make it up and carry on.</p>
          </section>
          <section className="card padded">
            <div className="card-title"><h3>Last 7 days</h3></div>
            <div className="week-dots">
              {week.map(d => {
                const k = dayKey(d); const got = log[k] ?? [];
                return (
                  <div key={k} className="week-col">
                    <small>{d.toLocaleDateString('en-GB', { weekday: 'narrow' })}</small>
                    {PRAYERS.map(p => (
                      <button key={p} className={`dot ${got.includes(p) ? 'on' : ''}`} onClick={() => toggle(k, p)} aria-pressed={got.includes(p)} aria-label={`${p} on ${d.toLocaleDateString('en-GB', { weekday: 'long' })}`} title={`${p} · ${d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}`} />
                    ))}
                  </div>
                );
              })}
            </div>
            <p className="muted-text">Rows are Fajr → Isha. Tap a dot to fix an earlier day.</p>
          </section>
        </div>
      </div>
    </ContentPage>
  );
}
