'use client';
import { useEffect } from 'react';
import { PRAYERS, addDays, dayTimes, type PrayerState } from './prayer';
import { dayKey, useStored } from './store';
import type { Settings } from './settings';

// In-app prayer reminders. A website can only notify while it is open (a tab or the installed
// app window), so the always-on option is the calendar feed; this covers people who keep Nur open.

export type Reminders = { enabled: boolean; before: number; atTime: boolean; prayers: string[] };
export const DEFAULT_REMINDERS: Reminders = { enabled: false, before: 10, atTime: true, prayers: [...PRAYERS] };
export const BEFORE_OPTIONS = [0, 5, 10, 15, 20, 30];

export function useReminders() {
  return useStored<Reminders>('nur.reminders', DEFAULT_REMINDERS);
}

export const notificationsSupported = () => typeof window !== 'undefined' && 'Notification' in window;

export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return null;
  try { return await navigator.serviceWorker.register('/sw.js'); } catch { return null; }
}

export async function showNotification(title: string, body: string, tag: string) {
  if (!notificationsSupported() || Notification.permission !== 'granted') return false;
  const options: NotificationOptions = { body, tag, icon: '/app-icon/192', badge: '/app-icon/192' };
  const reg = await registerServiceWorker();
  if (reg) { await navigator.serviceWorker.ready; await reg.showNotification(title, options); return true; }
  try { new Notification(title, options); return true; } catch { return false; }
}

const FIRED_KEY = 'nur.notified';
const WINDOW_MS = 2 * 60_000; // fire if we are within 2 minutes after the moment (tabs wake late in the background)

/** Claims a reminder so it fires once even with several Nur tabs open. */
function claim(key: string) {
  try {
    const fired: string[] = JSON.parse(localStorage.getItem(FIRED_KEY) ?? '[]');
    if (fired.includes(key)) return false;
    localStorage.setItem(FIRED_KEY, JSON.stringify([...fired, key].slice(-60)));
    return true;
  } catch { return true; }
}

/** Runs inside the app shell on every page; checks once per tick whether a reminder is due. */
export function useReminderEngine(now: Date | null, state: PrayerState | null, s: Settings) {
  const [r] = useReminders();
  const minute = now ? Math.floor(now.getTime() / 15_000) : 0; // re-check every 15 s, not every render

  useEffect(() => {
    if (!now || !state || !r.enabled || !notificationsSupported() || Notification.permission !== 'granted') return;
    const today = state.day;
    const due: { key: string; at: number; title: string; body: string }[] = [];
    for (const day of [today, addDays(today, 1)]) {
      for (const t of dayTimes(day, s)) {
        if (!r.prayers.includes(t.name)) continue;
        const k = `${dayKey(day)}-${t.name}`;
        if (r.before > 0) due.push({ key: `${k}-before`, at: t.time.getTime() - r.before * 60_000, title: `${t.name} in ${r.before} minutes`, body: `Prepare for ${t.name} — make wudu and find a quiet place.` });
        if (r.atTime) due.push({ key: `${k}-now`, at: t.time.getTime(), title: `It’s time for ${t.name}`, body: `${t.name} has begun in ${s.place.split(' (')[0]}.` });
      }
    }
    const t = now.getTime();
    for (const d of due) {
      if (t >= d.at && t - d.at < WINDOW_MS && claim(d.key)) void showNotification(d.title, d.body, d.key);
    }
    // `minute` throttles this effect; `now` is read inside on purpose.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minute, r, s, state?.day.getTime()]);
}
