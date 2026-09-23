'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ContentPage } from '@/components/content-page';
import { placeToday, useNow } from '@/lib/prayer';
import { useSettings } from '@/lib/settings';
import { HIJRI_MONTHS, OCCASIONS, formatGregorian, formatHijri, hijriMonthDays, upcomingOccasions } from '@/lib/hijri';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function CalendarPage() {
  const now = useNow(60_000);
  const { settings } = useSettings();
  const [offset, setOffset] = useState(0); // Hijri months from the current one

  if (!now) return <ContentPage eyebrow="Dates & occasions" title="Islamic Calendar" description="Hijri dates and the important days of the Islamic year."><div className="calendar-skeleton card" /></ContentPage>;

  const today = placeToday(now, settings); // today at the chosen place

  // Step ~29.5 days per month from today's Hijri month, landing mid-month to stay inside it.
  const anchor = new Date(today);
  const todayDays = hijriMonthDays(today);
  anchor.setTime(todayDays[14]?.date.getTime() ?? today.getTime());
  anchor.setDate(anchor.getDate() + Math.round(offset * 29.53));
  const days = hijriMonthDays(anchor);
  const { month, year } = days[0].hijri;
  const lead = (days[0].date.getDay() + 6) % 7; // Monday-first grid
  const todayKey = today.toDateString();
  const events = upcomingOccasions(today);

  return (
    <ContentPage eyebrow="Dates & occasions" title="Islamic Calendar" description="Hijri dates follow the Umm al-Qura calculation. Local moon sighting can shift a date by a day — confirm with your mosque.">
      <div className="calendar-hero">
        <div>
          <span className="page-eyebrow">Today</span>
          <h2>{formatHijri(today)}</h2>
          <p>{formatGregorian(today)}</p>
        </div>
      </div>

      <div className="calendar-layout">
        <section className="card padded month-card">
          <div className="card-title">
            <button className="icon-btn" onClick={() => setOffset(o => o - 1)} aria-label="Previous month"><ChevronLeft size={18} /></button>
            <h3>{HIJRI_MONTHS[month - 1]} {year} AH<small>{formatGregorian(days[0].date, { month: 'short', year: 'numeric' })} – {formatGregorian(days[days.length - 1].date, { month: 'short', year: 'numeric' })}</small></h3>
            <button className="icon-btn" onClick={() => setOffset(o => o + 1)} aria-label="Next month"><ChevronRight size={18} /></button>
          </div>
          <div className="month-grid">
            {WEEKDAYS.map(w => <span key={w} className="wd">{w}</span>)}
            {Array.from({ length: lead }, (_, i) => <span key={`b${i}`} />)}
            {days.map(({ date, hijri }) => {
              const occ = OCCASIONS.find(o => o.month === hijri.month && o.day === hijri.day);
              return (
                <div key={date.toISOString()} className={`day ${date.toDateString() === todayKey ? 'today' : ''} ${occ ? 'occasion' : ''} ${date.getDay() === 5 ? 'friday' : ''}`} title={occ?.title}>
                  <b>{hijri.day}</b>
                  <small>{date.getDate()}{date.getDate() === 1 || hijri.day === 1 ? ` ${date.toLocaleDateString('en-GB', { month: 'short' })}` : ''}</small>
                </div>
              );
            })}
          </div>
          {offset !== 0 && <button className="text-button" onClick={() => setOffset(0)}>Back to this month</button>}
        </section>

        <section className="event-list">
          <h3>Coming up</h3>
          {events.map(e => {
            const daysAway = Math.round((e.date.getTime() - today.getTime()) / 86_400_000);
            return (
              <article className="card event-item" key={e.title}>
                <strong>{e.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}<small>{e.date.getFullYear()}</small></strong>
                <div>
                  <h4>{e.title}</h4>
                  <p>{e.hijri.day} {HIJRI_MONTHS[e.hijri.month - 1]} {e.hijri.year} · {daysAway <= 0 ? 'today' : `in ${daysAway} day${daysAway === 1 ? '' : 's'}`} · expected</p>
                  <p>{e.note}</p>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </ContentPage>
  );
}
