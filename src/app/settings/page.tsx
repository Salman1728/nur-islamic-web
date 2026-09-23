'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Bell, Clock, LocateFixed, MapPin, Moon, Trash2, User } from 'lucide-react';
import { ContentPage } from '@/components/content-page';
import { CITIES, METHODS, useSettings, type Method } from '@/lib/settings';
import { useLocate } from '@/lib/locate';
import { tzLabel } from '@/lib/prayer';

const STORED_KEYS = ['nur.settings', 'nur.tracker', 'nur.lessons', 'nur.duas.saved', 'nur.quran.bookmark', 'nur.quran.translit', 'nur.quran.english', 'nur.world', 'nur.visited', 'nur.practice', 'nur.journey.manual', 'nur.quran.last', 'nur.quran.mode', 'nur.quran.size', 'nur.quran.tab', 'nur.reminders', 'nur.notified'];
const REGIONS = [...new Set(CITIES.map(c => c.region))];

export default function SettingsPage() {
  const { settings, update, chooseCity, ready } = useSettings();
  const { locate, busy, error } = useLocate();
  const [confirm, setConfirm] = useState(false);
  const cityValue = CITIES.find(c => c.place === settings.place)?.place ?? '';

  const clearAll = () => {
    STORED_KEYS.forEach(k => { try { localStorage.removeItem(k); } catch { /* ignore */ } });
    window.location.reload();
  };

  return (
    <ContentPage eyebrow="Your preferences" title="Settings" description="Everything here is saved in this browser only. The one exception is the optional calendar feed, whose link carries your location so Nur can calculate the times — nothing is stored.">
      <div className="settings-list">
        <label className="card setting-row">
          <User />
          <div><b>Your name</b><small>Used only for your greeting.</small></div>
          <input className="field" value={ready ? settings.name : ''} onChange={e => update({ name: e.target.value.slice(0, 40) })} placeholder="Optional" />
        </label>

        <div className="card setting-row wrap">
          <MapPin />
          <div><b>Location</b><small>{settings.place} · {settings.lat.toFixed(2)}, {settings.lng.toFixed(2)} · {ready ? `${tzLabel(settings)} (${settings.tz.replace(/_/g, ' ')})` : ''}</small><small>Picking a city also sets its time zone and the calculation method used there.</small>{error && <small className="form-error">{error}</small>}</div>
          <div className="setting-controls">
            <select className="field" value={cityValue} onChange={e => { const c = CITIES.find(x => x.place === e.target.value); if (c) chooseCity(c); }} aria-label="Choose a city">
              {!cityValue && <option value="">Custom location</option>}
              {REGIONS.map(r => (
                <optgroup key={r} label={r}>
                  {CITIES.filter(c => c.region === r).map(c => <option key={c.place} value={c.place}>{c.place}</option>)}
                </optgroup>
              ))}
            </select>
            <button className="field-button" onClick={locate} disabled={busy}><LocateFixed size={16} /> {busy ? 'Locating…' : 'Use my location'}</button>
          </div>
        </div>

        <label className="card setting-row">
          <Moon />
          <div><b>Calculation method</b><small>Different regions use different Fajr and Isha angles.</small></div>
          <select className="field" value={settings.method} onChange={e => update({ method: e.target.value as Method })}>
            {METHODS.map(([m, label]) => <option key={m} value={m}>{label}</option>)}
          </select>
        </label>

        <label className="card setting-row">
          <Moon />
          <div><b>Asr time</b><small>Hanafi Asr begins later in the afternoon.</small></div>
          <select className="field" value={settings.madhab} onChange={e => update({ madhab: e.target.value as 'shafi' | 'hanafi' })}>
            <option value="shafi">Standard (Shafi‘i, Maliki, Hanbali)</option>
            <option value="hanafi">Hanafi</option>
          </select>
        </label>

        <label className="card setting-row">
          <Clock />
          <div><b>24-hour clock</b><small>Show 17:45 instead of 5:45 PM.</small></div>
          <input type="checkbox" className="switch" checked={settings.hour24} onChange={e => update({ hour24: e.target.checked })} />
        </label>

        <Link href="/prayer#reminders" className="card setting-row">
          <Bell />
          <div><b>Prayer reminders</b><small>Calendar alerts that work even when Nur is closed, plus notifications while it’s open.</small></div>
          <strong className="setting-link">Set up →</strong>
        </Link>

        <div className="card setting-row danger">
          <Trash2 />
          <div><b>Clear my data</b><small>Removes your settings, prayer log, lesson progress, saved duas and bookmarks from this browser.</small></div>
          {confirm
            ? <div className="setting-controls"><button className="field-button danger" onClick={clearAll}>Yes, clear everything</button><button className="field-button" onClick={() => setConfirm(false)}>Cancel</button></div>
            : <button className="field-button" onClick={() => setConfirm(true)}>Clear…</button>}
        </div>
      </div>
    </ContentPage>
  );
}
