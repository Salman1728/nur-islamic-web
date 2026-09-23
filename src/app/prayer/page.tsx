'use client';
import { useState } from 'react';
import Link from 'next/link';
import { LocateFixed, MapPin, Settings2 } from 'lucide-react';
import { ContentPage } from '@/components/content-page';
import { METHODS, useSettings } from '@/lib/settings';
import { dayTimes, formatCountdown, formatTime, prayerState, useNow } from '@/lib/prayer';
import { formatHijri } from '@/lib/hijri';
import { useLocate } from '@/lib/locate';

export default function PrayerPage() {
  const { settings } = useSettings();
  const now = useNow(1000);
  const { locate, busy, error } = useLocate();
  const [showWeek, setShowWeek] = useState(false);
  const state = now ? prayerState(now, settings) : null;
  const methodName = METHODS.find(([m]) => m === settings.method)?.[1];
  const progress = state && now ? Math.min(100, ((now.getTime() - state.prevTime.getTime()) / (state.next.time.getTime() - state.prevTime.getTime())) * 100) : 0;

  const week = now ? Array.from({ length: 7 }, (_, i) => { const d = new Date(now); d.setDate(now.getDate() + i); return { d, times: dayTimes(d, settings) }; }) : [];

  return (
    <ContentPage eyebrow="Worship" title="Prayer Times" description="Calculated for your location, updated every second. Prepare a little before each salah.">
      <div className="feature-layout">
        <section className="next-prayer big">
          <small>Next prayer</small>
          <h2>{state?.next.name ?? '—'}</h2>
          <strong>{state ? formatTime(state.next.time, settings.hour24) : '--:--'}</strong>
          <p className="countdown">{state && now ? formatCountdown(state.next.time.getTime() - now.getTime()) : ' '}</p>
          <div className="time-progress"><i style={{ width: `${progress}%` }} /></div>
          <div className="inline-actions">
            <button onClick={locate} disabled={busy}><LocateFixed size={16} /> {busy ? 'Locating…' : 'Use my location'}</button>
            <Link href="/settings"><MapPin size={16} /> {settings.place}</Link>
          </div>
          {error && <p className="form-error">{error}</p>}
        </section>

        <section className="card padded">
          <div className="card-title"><h3>Today</h3><span className="muted-text">{now ? formatHijri(now) : ''}</span></div>
          {(state?.today ?? []).map(p => (
            <div className={`prayer-row ${p.name === state?.current ? 'current' : ''} ${p.name === 'Sunrise' ? 'muted' : ''}`} key={p.name}>
              <div>
                <b>{p.name}</b>
                <small>{p.name === 'Sunrise' ? 'Fajr time ends' : p.name === state?.current ? 'Now' : p.name === state?.next.name ? 'Next' : now && p.time < now ? 'Passed' : ''}</small>
              </div>
              <strong>{formatTime(p.time, settings.hour24)}</strong>
            </div>
          ))}
          <Link href="/settings" className="method"><Settings2 size={14} /> {methodName} · Asr: {settings.madhab === 'hanafi' ? 'Hanafi' : 'Standard'} · change</Link>
        </section>
      </div>

      <section className="card padded week-card">
        <div className="card-title">
          <h3>This week</h3>
          <button className="text-button" onClick={() => setShowWeek(v => !v)} aria-expanded={showWeek}>{showWeek ? 'Hide' : 'Show'}</button>
        </div>
        {showWeek && (
          <div className="table-scroll">
            <table className="week-table">
              <thead><tr><th>Day</th><th>Fajr</th><th>Sunrise</th><th>Dhuhr</th><th>Asr</th><th>Maghrib</th><th>Isha</th></tr></thead>
              <tbody>
                {week.map(({ d, times }, i) => (
                  <tr key={i} className={i === 0 ? 'today' : ''}>
                    <th>{d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</th>
                    {times.map(t => <td key={t.name}>{formatTime(t.time, settings.hour24)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <p className="fine-print">Times are calculated, not taken from a mosque timetable. If your local mosque publishes times, follow them.</p>
    </ContentPage>
  );
}
