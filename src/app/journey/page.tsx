'use client';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { ContentPage } from '@/components/content-page';
import { WEEKS } from '@/lib/journey';
import { useJourney } from '@/lib/use-journey';

export default function JourneyPage() {
  const { steps, doneCount, current, toggleManual, ready } = useJourney();
  const pct = Math.round((doneCount / steps.length) * 100);

  return (
    <ContentPage eyebrow="For new Muslims" title="My first 30 days" description="One small step a day, at your own pace. Steps tick themselves off as you use Nur — there is no deadline and no pressure.">
      <section className="journey-hero">
        <div>
          {!ready ? <h2>&nbsp;</h2> : current ? (
            <>
              <span className="page-eyebrow">Your next step · day {current.day}</span>
              <h2>{current.title}</h2>
              <p>{current.note}</p>
              <div className="inline-actions">
                <Link href={current.href} className="primary-button small">{current.cta} <ArrowRight size={15} /></Link>
                {!current.auto && <button className="field-button" onClick={() => toggleManual(current.day)}><Check size={15} /> Mark as done</button>}
              </div>
            </>
          ) : (
            <>
              <span className="page-eyebrow">All 30 steps</span>
              <h2>MashaAllah — you did it.</h2>
              <p>Keep your prayers, keep learning, and come back to any step whenever you like.</p>
            </>
          )}
        </div>
        <div className="journey-ring" style={{ ['--pct' as string]: `${pct * 3.6}deg` }} aria-label={`${doneCount} of ${steps.length} steps done`}>
          <strong>{doneCount}</strong><span>of {steps.length}</span>
        </div>
      </section>

      {WEEKS.map((week, w) => {
        const days = steps.filter(s => Math.min(Math.floor((s.day - 1) / 7), 3) === w);
        return (
          <section key={week} className="journey-week">
            <h3><span>Week {w + 1}</span>{week}</h3>
            <ol className="journey-steps">
              {days.map(s => (
                <li key={s.day} className={`journey-step ${s.done ? 'done' : ''} ${current?.day === s.day ? 'current' : ''}`}>
                  <span className="journey-dot">{s.done ? <Check size={14} /> : s.day}</span>
                  <div>
                    <b>{s.title}</b>
                    <small>{s.note}</small>
                  </div>
                  <div className="journey-actions">
                    <Link href={s.href} className="text-link">{s.done ? 'Revisit' : s.cta}</Link>
                    {!s.auto && <button className="text-button" onClick={() => toggleManual(s.day)} aria-pressed={s.manual}>{s.manual ? 'Undo' : 'Mark done'}</button>}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        );
      })}
      <p className="fine-print">Everything here is saved only in this browser. Steps marked automatically come from your lessons, prayer tracker, saved duas, practice and the pages you have opened.</p>
    </ContentPage>
  );
}
