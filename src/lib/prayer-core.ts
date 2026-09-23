// Pure prayer-time maths — no React, so both client components and server routes
// (the calendar feed) can use it. Client code imports it through ./prayer.
import { CalculationMethod, Coordinates, HighLatitudeRule, Madhab as AdhanMadhab, PrayerTimes, Qibla } from 'adhan';
import type { Settings } from './settings';

export const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
export type PrayerName = (typeof PRAYERS)[number];
export type Phase = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export type DayTimes = { name: PrayerName | 'Sunrise'; time: Date }[];

// Two kinds of value flow through the app:
//  - instants (prayer times, "now") — formatted with timeZone: s.tz via formatTime;
//  - calendar days — a local-noon Date whose y/m/d is the date AT THE PLACE (placeToday).
//    Day keys, Hijri dates, week rows and adhan's date input all use calendar days,
//    so a visitor in Nairobi who picks London sees London's "today".

/** The calendar date at the chosen place, as a local-noon Date. */
export function placeToday(now: Date, s: Settings) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: s.tz, year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(now);
  const get = (t: string) => Number(parts.find(p => p.type === t)?.value);
  return new Date(get('year'), get('month') - 1, get('day'), 12);
}

export function addDays(day: Date, n: number) {
  const d = new Date(day); d.setDate(d.getDate() + n); return d;
}

function params(s: Settings) {
  const p = CalculationMethod[s.method]();
  p.madhab = s.madhab === 'hanafi' ? AdhanMadhab.Hanafi : AdhanMadhab.Shafi;
  // Without this, summer Fajr/Isha collapse into each other in the UK and Scandinavia.
  p.highLatitudeRule = HighLatitudeRule.recommended(new Coordinates(s.lat, s.lng));
  return p;
}

/** `day` is a calendar day from placeToday/addDays. */
export function timesFor(day: Date, s: Settings) {
  return new PrayerTimes(new Coordinates(s.lat, s.lng), day, params(s));
}

export function dayTimes(day: Date, s: Settings): DayTimes {
  const t = timesFor(day, s);
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
  day: Date; // calendar day at the place
  today: DayTimes;
  current: PrayerName | null; // null = after midnight, before Fajr (still Isha's night)
  next: { name: PrayerName; time: Date };
  prevTime: Date; // when the current period began, for progress bars
  phase: Phase;
  sunT: number; // 0 at sunrise, 1 at maghrib; <0 or >1 at night
};

export function prayerState(now: Date, s: Settings): PrayerState {
  const day = placeToday(now, s);
  const today = dayTimes(day, s);
  const five = today.filter(p => p.name !== 'Sunrise') as { name: PrayerName; time: Date }[];
  let current: PrayerName | null = null;
  let prevTime = new Date(now);
  for (const p of five) if (p.time <= now) { current = p.name; prevTime = p.time; }

  const next = five.find(p => p.time > now) ?? { name: 'Fajr' as const, time: timesFor(addDays(day, 1), s).fajr };
  if (!current) prevTime = timesFor(addDays(day, -1), s).isha;

  const sunrise = today[1].time.getTime(), maghrib = today[4].time.getTime();
  const sunT = (now.getTime() - sunrise) / (maghrib - sunrise);
  const phase: Phase = (current ?? 'Isha').toLowerCase() as Phase;
  return { day, today, current, next, prevTime, phase, sunT };
}

export function qiblaBearing(s: Settings) {
  return Qibla(new Coordinates(s.lat, s.lng));
}

/** An instant, shown as clock time at the place. */
export function formatTime(d: Date, s: Pick<Settings, 'tz' | 'hour24'>) {
  return d.toLocaleTimeString(s.hour24 ? 'en-GB' : 'en-US', { hour: 'numeric', minute: '2-digit', hour12: !s.hour24, timeZone: s.tz });
}

/** e.g. "GMT+3" — the place's offset right now. */
export function tzLabel(s: Pick<Settings, 'tz'>, at = new Date()) {
  return new Intl.DateTimeFormat('en-GB', { timeZone: s.tz, timeZoneName: 'shortOffset' }).formatToParts(at).find(p => p.type === 'timeZoneName')?.value ?? s.tz;
}

export function formatCountdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600), m = Math.floor((total % 3600) / 60), sec = total % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${sec.toString().padStart(2, '0')}s`;
  return `${sec}s`;
}

/** Hour of day (0–23) at the place. */
export function placeHour(now: Date, s: Pick<Settings, 'tz'>) {
  return Number(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone: s.tz }).format(now));
}
