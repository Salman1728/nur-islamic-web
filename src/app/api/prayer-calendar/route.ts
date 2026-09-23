import { CalculationMethod } from 'adhan';
import { PRAYERS, addDays, dayTimes, placeToday } from '@/lib/prayer-core';
import type { Method, Settings } from '@/lib/settings';

// A calendar feed of prayer times that phones subscribe to (webcal/https). Stateless: the
// location and options arrive in the URL, the times are calculated, and nothing is stored.
// The phone's own calendar then shows the alerts — even when Nur is closed.
//   /api/prayer-calendar?lat=-1.29&lng=36.82&tz=Africa/Nairobi&method=MuslimWorldLeague&madhab=shafi&before=10&place=Nairobi

const DAYS = 60;

function bad(msg: string) {
  return new Response(`Invalid prayer calendar link: ${msg}\n`, { status: 400, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); // 20260924T021300Z
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

/** RFC 5545 line folding: lines longer than 75 octets continue with a leading space. */
function fold(line: string) {
  const bytes = Buffer.from(line, 'utf8');
  if (bytes.length <= 75) return line;
  const parts: string[] = [];
  let chunk = '';
  for (const ch of line) {
    if (Buffer.byteLength(chunk + ch, 'utf8') > (parts.length ? 74 : 75)) { parts.push(chunk); chunk = ''; }
    chunk += ch;
  }
  parts.push(chunk);
  return parts.join('\r\n ');
}

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams;
  const lat = Number(q.get('lat')), lng = Number(q.get('lng'));
  const tz = q.get('tz') ?? '';
  const method = (q.get('method') ?? 'MuslimWorldLeague') as Method;
  const madhab = q.get('madhab') === 'hanafi' ? 'hanafi' : 'shafi';
  const before = Math.round(Number(q.get('before') ?? 10));
  const place = (q.get('place') ?? 'your location').slice(0, 60);
  const download = q.get('download') === '1';

  if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lng) || lng < -180 || lng > 180) return bad('lat/lng');
  try { new Intl.DateTimeFormat('en', { timeZone: tz }); } catch { return bad('tz'); }
  if (!tz) return bad('tz');
  if (!(method in CalculationMethod) || typeof (CalculationMethod as Record<string, unknown>)[method] !== 'function') return bad('method');
  if (!Number.isFinite(before) || before < 0 || before > 60) return bad('before');

  const s: Settings = { name: '', place, lat, lng, tz, method, madhab, hour24: false };
  const now = new Date();
  const first = placeToday(now, s);
  // City only: some calendar apps show the escaped comma in "London\, United Kingdom" literally.
  const cal = `Prayer times — ${place.split(',')[0]}`;

  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Nur//Prayer times//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    `X-WR-CALNAME:${esc(cal)}`, `X-WR-TIMEZONE:${tz}`,
    'X-WR-CALDESC:Calculated prayer times from Nur. Follow your local mosque where it publishes a timetable.',
    'REFRESH-INTERVAL;VALUE=DURATION:P1D', 'X-PUBLISHED-TTL:P1D',
  ];

  for (let i = 0; i < DAYS; i++) {
    const day = addDays(first, i);
    const ymd = `${day.getFullYear()}${String(day.getMonth() + 1).padStart(2, '0')}${String(day.getDate()).padStart(2, '0')}`;
    for (const t of dayTimes(day, s)) {
      if (!(PRAYERS as readonly string[]).includes(t.name)) continue; // five prayers; no sunrise
      lines.push(
        'BEGIN:VEVENT',
        `UID:${ymd}-${t.name.toLowerCase()}-${lat.toFixed(3)}_${lng.toFixed(3)}@nur-islamic-web`,
        `DTSTAMP:${stamp(now)}`,
        `DTSTART:${stamp(t.time)}`,
        'DURATION:PT15M',
        `SUMMARY:${t.name}`,
        `DESCRIPTION:${esc(`${t.name} prayer time in ${place} (${method}${madhab === 'hanafi' ? ', Hanafi Asr' : ''}). From Nur.`)}`,
        'TRANSP:TRANSPARENT',
      );
      if (before > 0) lines.push('BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${esc(`${t.name} in ${before} minutes`)}`, `TRIGGER:-PT${before}M`, 'END:VALARM');
      lines.push('BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${esc(`It is time for ${t.name}`)}`, 'TRIGGER:PT0M', 'END:VALARM', 'END:VEVENT');
    }
  }
  lines.push('END:VCALENDAR');

  return new Response(lines.map(fold).join('\r\n') + '\r\n', {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="prayer-times.ics"`,
      // Same link → same calendar for a few hours; calendars refresh daily anyway.
      'Cache-Control': 'public, max-age=3600, s-maxage=21600',
    },
  });
}
