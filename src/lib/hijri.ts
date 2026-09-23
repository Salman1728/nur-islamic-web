// Hijri dates via the browser's built-in Umm al-Qura calendar. These are calculated,
// not moon-sighted — local announcements can differ by a day, so the UI says "expected".

const partsFmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'numeric', year: 'numeric' });

export const HIJRI_MONTHS = [
  'Muharram', 'Safar', 'Rabi‘ al-Awwal', 'Rabi‘ al-Thani', 'Jumada al-Ula', 'Jumada al-Akhirah',
  'Rajab', 'Sha‘ban', 'Ramadan', 'Shawwal', 'Dhu al-Qa‘dah', 'Dhu al-Hijjah',
];

export type Hijri = { day: number; month: number; year: number }; // month is 1-12

export function toHijri(d: Date): Hijri {
  const parts = partsFmt.formatToParts(d);
  const get = (t: string) => parseInt(parts.find(p => p.type === t)?.value ?? '0', 10);
  return { day: get('day'), month: get('month'), year: get('year') };
}

export function formatHijri(d: Date) {
  const h = toHijri(d);
  return `${h.day} ${HIJRI_MONTHS[h.month - 1]} ${h.year} AH`;
}

export function formatGregorian(d: Date, opts: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) {
  return d.toLocaleDateString('en-GB', opts);
}

function noon(d: Date) { const x = new Date(d); x.setHours(12, 0, 0, 0); return x; }

/** Every Gregorian day of the Hijri month containing `d`. */
export function hijriMonthDays(d: Date) {
  const target = toHijri(d);
  const start = noon(d);
  start.setDate(start.getDate() - (target.day - 1));
  const days: { date: Date; hijri: Hijri }[] = [];
  for (let i = 0; i < 31; i++) {
    const date = new Date(start); date.setDate(start.getDate() + i);
    const hijri = toHijri(date);
    if (hijri.month !== target.month) break;
    days.push({ date, hijri });
  }
  return days;
}

export const OCCASIONS: { month: number; day: number; title: string; note: string }[] = [
  { month: 1, day: 1, title: 'Islamic New Year', note: 'The first day of Muharram begins the Hijri year.' },
  { month: 1, day: 10, title: 'Day of ‘Ashura', note: 'A recommended day of fasting in Muharram.' },
  { month: 9, day: 1, title: 'Ramadan begins', note: 'The month of fasting. Start depends on moon sighting.' },
  { month: 10, day: 1, title: 'Eid al-Fitr', note: 'Celebration marking the end of Ramadan.' },
  { month: 12, day: 9, title: 'Day of ‘Arafah', note: 'The greatest day of Hajj; fasting is recommended for those not on Hajj.' },
  { month: 12, day: 10, title: 'Eid al-Adha', note: 'The festival of sacrifice, during the days of Hajj.' },
];

/** Next occurrences of the occasions above, scanning forward day by day (max ~400 days). */
export function upcomingOccasions(from: Date, limit = OCCASIONS.length) {
  const out: { date: Date; hijri: Hijri; title: string; note: string }[] = [];
  const cursor = noon(from);
  for (let i = 0; i < 400 && out.length < limit; i++) {
    const hijri = toHijri(cursor);
    const hit = OCCASIONS.find(o => o.month === hijri.month && o.day === hijri.day);
    if (hit) out.push({ date: new Date(cursor), hijri, title: hit.title, note: hit.note });
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
}
