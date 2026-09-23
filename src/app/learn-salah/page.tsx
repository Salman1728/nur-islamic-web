'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ContentPage } from '@/components/content-page';
import { RAKAHS, SALAH_STEPS } from '@/lib/content';
import { PRAYERS, type PrayerName } from '@/lib/prayer';

const ALOUD: Record<PrayerName, string> = {
  Fajr: 'Recited aloud in both rak‘ahs.',
  Dhuhr: 'All recitation is silent.',
  Asr: 'All recitation is silent.',
  Maghrib: 'Recited aloud in the first two rak‘ahs; the third is silent.',
  Isha: 'Recited aloud in the first two rak‘ahs; the last two are silent.',
};

function RakahMap({ prayer }: { prayer: PrayerName }) {
  const n = RAKAHS[prayer];
  return (
    <div className="rakah-map">
      {Array.from({ length: n }, (_, i) => {
        const r = i + 1;
        const sits = r === 2 || r === n;
        return (
          <div key={r} className="rakah">
            <b>Rak‘ah {r}</b>
            <small>Al-Fatihah{r <= 2 ? ' + a surah' : ''}</small>
            <small>Rukū‘ · 2 × sujūd</small>
            {sits && <em>{r === n ? 'Final tashahhud → taslīm' : 'Sit for tashahhud'}</em>}
          </div>
        );
      })}
    </div>
  );
}

export default function LearnSalah() {
  const [prayer, setPrayer] = useState<PrayerName>('Fajr');
  const [i, setI] = useState(0);
  const step = SALAH_STEPS[i];

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, textarea')) return;
      if (e.key === 'ArrowRight') setI(x => Math.min(x + 1, SALAH_STEPS.length - 1));
      if (e.key === 'ArrowLeft') setI(x => Math.max(x - 1, 0));
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);

  return (
    <ContentPage eyebrow="Beginner guide" title="Learn Salah" description="A calm, step-by-step guide to the movements and words of prayer. Use the arrow keys or buttons to move through each step.">
      <Link href="/learn-salah/practice" className="practice-cta">
        <span><b>Pray-along practice</b><small>Go through a whole prayer — every rak‘ah, in order — with recitation audio for Al-Fatihah.</small></span>
        <ChevronRight size={20} />
      </Link>
      <div className="lesson-layout">
        <section className="card lesson-view" aria-live="polite">
          <div className="step-number">Step {i + 1} of {SALAH_STEPS.length} · {step.position}</div>
          <h2>{step.title}</h2>
          <p className="step-how">{step.how}</p>
          {step.ar && (
            <figure className="arabic-block">
              <p className={`arabic ${step.ar.length > 80 ? 'small' : ''}`} lang="ar" dir="rtl">{step.ar}</p>
              <p className="translit">{step.tr}</p>
              <figcaption>“{step.en}”{step.repeat && <span className="chip">{step.repeat}</span>}</figcaption>
            </figure>
          )}
          {step.link && <Link href={step.link.href} className="text-link">{step.link.label} →</Link>}
          <div className="lesson-controls">
            <button onClick={() => setI(x => x - 1)} disabled={i === 0}><ChevronLeft size={17} /> Previous</button>
            {i < SALAH_STEPS.length - 1
              ? <button className="go" onClick={() => setI(x => x + 1)}>Next step <ChevronRight size={17} /></button>
              : <button className="go" onClick={() => setI(0)}>Start again</button>}
          </div>
        </section>
        <aside className="card step-list" aria-label="All steps">
          {SALAH_STEPS.map((s, n) => (
            <button key={s.id} className={n === i ? 'selected' : ''} onClick={() => setI(n)} aria-current={n === i ? 'step' : undefined}>
              <span>{n < i ? <CheckCircle2 size={18} /> : n + 1}</span>
              <div><b>{s.title}</b><small>{s.position}</small></div>
            </button>
          ))}
        </aside>
      </div>

      <section className="card padded rakah-card">
        <div className="card-title">
          <h3>How many rak‘ahs?</h3>
          <div className="segmented" role="tablist">
            {PRAYERS.map(p => <button key={p} role="tab" aria-selected={p === prayer} className={p === prayer ? 'on' : ''} onClick={() => setPrayer(p)}>{p} · {RAKAHS[p]}</button>)}
          </div>
        </div>
        <RakahMap prayer={prayer} />
        <p className="muted-text">{ALOUD[prayer]}</p>
      </section>
      <p className="fine-print">This guide follows the common practice shared across schools of thought. Small details differ between madhhabs — a teacher at your local mosque can guide you further.</p>
    </ContentPage>
  );
}
