/** Single source of truth for the prayer schedule shown across the app.
 *  Static placeholder data for now — replace with real location-based
 *  calculation later without touching the pages that render it. */

export type PrayerName = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export interface PrayerTime {
  name: PrayerName;
  time: string;
}

export const PRAYER_TIMES: readonly PrayerTime[] = [
  { name: 'Fajr', time: '5:06 AM' },
  { name: 'Sunrise', time: '6:28 AM' },
  { name: 'Dhuhr', time: '12:20 PM' },
  { name: 'Asr', time: '3:47 PM' },
  { name: 'Maghrib', time: '6:42 PM' },
  { name: 'Isha', time: '8:03 PM' },
];

/** Prayers only (Sunrise is a marker, not a prayer) — used where a 5-row list is wanted. */
export const FIVE_PRAYERS: readonly PrayerTime[] = PRAYER_TIMES.filter(p => p.name !== 'Sunrise');

export const NEXT_PRAYER = {
  name: 'Asr' as PrayerName,
  time: '3:47',
  meridiem: 'PM',
  remaining: '1h 24m',
};

export const CALCULATION_METHOD = 'Muslim World League';
