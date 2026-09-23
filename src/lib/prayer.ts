'use client';
import { CalculationMethod, Coordinates, Madhab as AdhanMadhab, PrayerTimes, Qibla } from 'adhan';
import { useCallback, useSyncExternalStore } from 'react';
import type { Settings } from './settings';

export const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
export type PrayerName = (typeof PRAYERS)[number];
export type Phase = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export type DayTimes = { name: PrayerName | 'Sunrise'; time: Date }[];

function params(s: Settings) {
  const p = CalculationMethod[s.method]();
  p.madhab = s.madhab === 'hanafi' ? AdhanMadhab.Hanafi : AdhanMadhab.Shafi;
  return p;
}

export function timesFor(date: Date, s: Settings) {
  return new PrayerTimes(new Coordinates(s.lat, s.lng), date, params(s));
}

export function dayTimes(date: Date, s: Settings): DayTimes {
  const t = timesFor(date, s);
  return [
    { name: 'Fajr', time: t.fajr },
    { name: 'Sunrise', time: t.sunrise },
    { name: 'Dhuhr', time: t.dhuhr },
    { name: 'Asr', time: t.asr },
    { name: 'Maghrib', time: t.maghrib },
    { name: 'Isha', time: t.isha },
  ];
}

export type PrayerState = {
  today: DayTimes;
  current: PrayerName | null; // null = after midnight, before Fajr (still Isha's night)
  next: { name: PrayerName; time: Date };
  prevTime: Date; // when the current period began, for progress bars
  phase: Phase;
  sunT: number; // 0 at sunrise, 1 at maghrib; <0 or >1 at night
};

export function prayerState(now: Date, s: Settings): PrayerState {
  const today = dayTimes(now, s);
  const five = today.filter(p => p.name !== 'Sunrise') as { name: PrayerName; time: Date }[];
  let current: PrayerName | null = null;
  let prevTime = new Date(now);
  for (const p of five) if (p.time <= now) { current = p.name; prevTime = p.time; }

  let next = five.find(p => p.time > now);
  if (!next) {
    const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1);
    next = { name: 'Fajr', time: timesFor(tomorrow, s).fajr };
  }
  if (!current) {
    const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
    prevTime = timesFor(yesterday, s).isha;
  }

  const sunrise = today[1].time.getTime(), maghrib = today[4].time.getTime();
  const sunT = (now.getTime() - sunrise) / (maghrib - sunrise);
  const phase: Phase = (current ?? 'Isha').toLowerCase() as Phase;
  return { today, current, next, prevTime, phase, sunT };
}

export function qiblaBearing(s: Settings) {
  return Qibla(new Coordinates(s.lat, s.lng));
}

export function formatTime(d: Date, hour24 = false) {
  return d.toLocaleTimeString(hour24 ? 'en-GB' : 'en-US', { hour: 'numeric', minute: '2-digit', hour12: !hour24 });
}

export function formatCountdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600), m = Math.floor((total % 3600) / 60), sec = total % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${sec.toString().padStart(2, '0')}s`;
  return `${sec}s`;
}

// One shared clock per interval. Server snapshot is null so server and first client render match.
type Clock = { now: Date | null; subs: Set<() => void>; id?: ReturnType<typeof setInterval> };
const clocks = new Map<number, Clock>();

function clock(ms: number): Clock {
  let c = clocks.get(ms);
  if (!c) { c = { now: null, subs: new Set() }; clocks.set(ms, c); }
  return c;
}

function subscribeClock(ms: number, cb: () => void) {
  const c = clock(ms);
  c.subs.add(cb);
  if (!c.id) {
    c.now = new Date();
    c.id = setInterval(() => { c.now = new Date(); c.subs.forEach(f => f()); }, ms);
  }
  return () => {
    c.subs.delete(cb);
    if (!c.subs.size && c.id) { clearInterval(c.id); c.id = undefined; }
  };
}

function readClock(ms: number) {
  const c = clock(ms);
  if (!c.now) c.now = new Date();
  return c.now;
}

/** Current time, ticking every `ms`. Null during server render and hydration. */
export function useNow(ms = 1000) {
  const subscribe = useCallback((cb: () => void) => subscribeClock(ms, cb), [ms]);
  return useSyncExternalStore(subscribe, () => readClock(ms), () => null);
}
