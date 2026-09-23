'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Globe2, LocateFixed, MapPin, Settings2, X } from 'lucide-react';
import { ContentPage } from '@/components/content-page';
import { LocationBanner } from '@/components/location-banner';
import { CITIES, METHODS, useSettings, type Settings } from '@/lib/settings';
import { addDays, dayTimes, formatCountdown, formatTime, prayerState, tzLabel, useNow } from '@/lib/prayer';
import { formatHijri } from '@/lib/hijri';
import { useLocate } from '@/lib/locate';
import { useStored } from '@/lib/store';

const DEFAULT_WORLD = ['Makkah, Saudi Arabia', 'London, United Kingdom', 'New York, USA'];

function WorldClock({ now, base }: { now: Date | null; base: Settings }) {
  const [places, setPlaces] = useStored<string[]>('nur.world', DEFAULT_WORLD);
  const cities = places.map(p => CITIES.find(c => c.place === p)).filter(c => c !== undefined);
  const available = CITIES.filter(c => !places.includes(c.place) && c.place !== base.place);

  return (
    <section className="card padded world-card">
      <div className="card-title">
        <h3><Globe2 size={17} /> Around the world</h3>
        <select className="field" value="" onChange={e => e.target.value && setPlaces(p => [...p, e.target.value].slice(-8))} aria-label="Add a city">
          <option value="">Add a city…</option>
          {available.map(c => <option key={c.place} value={c.place}>{c.place}</option>)}
        </select>
      </div>
      <div className="world-grid">
        {cities.map(c => {
          // Each city uses its own local method and zone; the reader's madhab and clock format carry over.
          const s: Settings = { ...base, place: c.place, lat: c.lat, lng: c.lng, tz: c.tz, method: c.method };
          const st = now ? prayerState(now, s) : null;
          return (
            <article key={c.place} className="world-item">
              <button className="world-remove" onClick={() => setPlaces(p => p.filter(x => x !== c.place))} aria-label={`Remove ${c.place}`}><X size={14} /></button>
              <b>{c.place.split(',')[0]}</b>
              <strong>{now ? formatTime(now, s) : '--:--'}</strong>
              <small>{now ? tzLabel(s, now) : ' '}</small>
              <span>{st && now ? `${st.next.name} ${formatTime(st.next.time, s)} · in ${formatCountdown(st.next.time.getTime() - now.getTime())}` : ' '}</span>
            </article>
          );
        })}
        {cities.length === 0 && <p className="empty">Add cities to see their local time and next prayer.</p>}
      </div>
    </section>
  );
}

export default function PrayerPage() {
  const { settings } = useSettings();
  const now = useNow(1000);
  const { locate, busy, error } = useLocate();
  const [showWeek, setShowWeek] = useState(false);
  const state = now ? prayerState(now, settings) : null;
  const methodName = METHODS.find(([m]) => m === settings.method)?.[1];
  const progress = state && now ? Math.min(100, ((now.getTime() - state.prevTime.getTime()) / (state.next.time.getTime() - state.prevTime.getTime())) * 100) : 0;

  const week = state ? Array.from({ length: 7 }, (_, i) => { const d = addDays(state.day, i); return { d, times: dayTimes(d, settings) }; }) : [];

  return (
    <ContentPage eyebrow="Worship" title="Prayer Times" description="Calculated for your location and shown in its local time, wherever you are reading from.">
      <LocationBanner />
      <div className="feature-layout">
        <section className="next-prayer big">
          <small>Next prayer</small>
          <h2>{state?.next.name ?? '—'}</h2>
          <strong>{state ? formatTime(state.next.time, settings) : '--:--'}</strong>
          <p className="countdown">{state && now ? formatCountdown(state.next.time.getTime() - now.getTime()) : ' '}</p>
          <div className="time-progress"><i style={{ width: `${progress}%` }} /></div>
          <div className="inline-actions">
            <button onClick={locate} disabled={busy}><LocateFixed size={16} /> {busy ? 'Locating…' : 'Use my location'}</button>
            <Link href="/settings"><MapPin size={16} /> {settings.place}</Link>
          </div>
          {error && <p className="form-error">{error}</p>}
        </section>

        <section className="card padded">
          <div className="card-title"><h3>Today</h3><span className="muted-text">{state ? formatHijri(state.day) : ''}</span></div>
          {(state?.today ?? []).map(p => (
            <div className={`prayer-row ${p.name === state?.current ? 'current' : ''} ${p.name === 'Sunrise' ? 'muted' : ''}`} key={p.name}>
              <div>
                <b>{p.name}</b>
                <small>{p.name === 'Sunrise' ? 'Fajr time ends' : p.name === state?.current ? 'Now' : p.name === state?.next.name ? 'Next' : now && p.time < now ? 'Passed' : ''}</small>
              </div>
              <strong>{formatTime(p.time, settings)}</strong>
            </div>
          ))}
          <p className="method-line">Local time in {settings.place.split(' (')[0]} · {now ? tzLabel(settings, now) : ''}</p>
          <Link href="/settings" className="method"><Settings2 size={14} /> {methodName} · Asr: {settings.madhab === 'hanafi' ? 'Hanafi' : 'Standard'} · change</Link>
        </section>
      </div>

      <WorldClock now={now} base={settings} />

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
                    {times.map(t => <td key={t.name}>{formatTime(t.time, settings)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <p className="fine-print">Times are calculated, not taken from a mosque timetable. If your local mosque publishes times, follow them. In far-north cities, Fajr and Isha use the recommended high-latitude rule in summer.</p>
    </ContentPage>
  );
}
