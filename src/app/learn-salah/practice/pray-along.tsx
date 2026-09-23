'use client';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';
import { PoseFigure } from '@/components/pose-figure';
import { RAKAHS } from '@/lib/content';
import { PRAYERS, type PrayerName } from '@/lib/prayer';
import { ayahAudio, type Ayah } from '@/lib/quran';
import { buildSequence } from '@/lib/salah-sequence';
import { useStored } from '@/lib/store';

export type PracticeLog = { count: number; prayers: string[] };

/** Plays a list of verses one after another, highlighting the current one. */
function Recitation({ ayahs, bismillah }: { ayahs: Ayah[]; bismillah?: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const playing = useRef<number | null>(null); // verse index being played, read by the 'ended' handler
  const [at, setAt] = useState<number | null>(null);

  const playFrom = useCallback((i: number) => {
    const el = audio.current;
    if (!el || i >= ayahs.length) { playing.current = null; setAt(null); return; }
    playing.current = i;
    el.src = ayahAudio(ayahs[i].global);
    el.play().then(() => setAt(i)).catch(() => { playing.current = null; setAt(null); });
  }, [ayahs]);

  const stop = () => { playing.current = null; audio.current?.pause(); setAt(null); };

  useEffect(() => {
    const el = audio.current;
    if (!el) return;
    const next = () => { if (playing.current !== null) playFrom(playing.current + 1); };
    el.addEventListener('ended', next);
    return () => { el.removeEventListener('ended', next); el.pause(); };
  }, [playFrom]);

  return (
    <div className="recitation">
      <button className="primary-button small" onClick={() => (at === null ? playFrom(0) : stop())}>
        {at === null ? <><Play size={15} /> Listen</> : <><Pause size={15} /> Stop</>}
      </button>
      {bismillah && <p className="recite-line bism" lang="ar" dir="rtl">{bismillah}</p>}
      <ol>
        {ayahs.map((a, i) => (
          <li key={a.n} className={at === i ? 'on' : ''}>
            <p className="recite-line" lang="ar" dir="rtl">{a.ar}</p>
            <p className="translit">{a.tr}</p>
          </li>
        ))}
      </ol>
      <audio ref={audio} preload="none" />
    </div>
  );
}

export default function PrayAlong({ fatihah, surah }: { fatihah: Ayah[]; surah: { name: string; ayahs: Ayah[]; bismillah: string } }) {
  const [prayer, setPrayer] = useState<PrayerName | null>(null);
  const [i, setI] = useState(0);
  const [finished, setFinished] = useState(false);
  const [, setLog] = useStored<PracticeLog>('nur.practice', { count: 0, prayers: [] });
  const seq = useMemo(() => (prayer ? buildSequence(prayer) : []), [prayer]);
  const step = seq[i];
  const last = i === seq.length - 1;

  const finish = useCallback(() => {
    if (!prayer) return;
    setLog(l => ({ count: l.count + 1, prayers: [...new Set([...l.prayers, prayer])] }));
    setFinished(true);
  }, [prayer, setLog]);

  useEffect(() => {
    if (!prayer || finished) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); if (last) finish(); else setI(x => x + 1); }
      if (e.key === 'ArrowLeft') setI(x => Math.max(0, x - 1));
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [prayer, finished, last, finish]);

  if (!prayer) {
    return (
      <main className="content-page practice-page">
        <Link href="/learn-salah" className="back-link"><ChevronLeft size={16} /> Learn Salah</Link>
        <div className="page-intro">
          <span className="page-eyebrow">Pray-along practice</span>
          <h1>Practise a whole prayer.</h1>
          <p>Choose a prayer and move through it one position at a time, with every rak‘ah in order. Practise as many times as you like — this is for learning, not a prayer in itself.</p>
        </div>
        <div className="practice-choose">
          {PRAYERS.map(p => (
            <button key={p} className="card practice-option" onClick={() => { setPrayer(p); setI(0); setFinished(false); }}>
              <b>{p}</b><span>{RAKAHS[p]} rak‘ahs</span><small>{buildSequence(p).length} steps</small>
            </button>
          ))}
        </div>
      </main>
    );
  }

  if (finished) {
    return (
      <main className="content-page practice-page practice-done">
        <PoseFigure pose="sit" />
        <h1>You completed {prayer}.</h1>
        <p>May Allah accept it from you. Practise again whenever you like — each time it will feel more natural.</p>
        <div className="inline-actions center">
          <button onClick={() => { setI(0); setFinished(false); }}><RotateCcw size={16} /> Practise {prayer} again</button>
          <button onClick={() => setPrayer(null)}>Choose another prayer</button>
          <Link href="/journey">My first 30 days</Link>
        </div>
      </main>
    );
  }

  const rakahs = RAKAHS[prayer];
  return (
    <main className="content-page practice-page">
      <div className="practice-top">
        <button className="back-link" onClick={() => setPrayer(null)}><ChevronLeft size={16} /> Choose prayer</button>
        <span className="page-eyebrow">{prayer} · {step.rakah ? `Rak‘ah ${step.rakah} of ${rakahs}` : step.key === 'niyyah' ? 'Before you begin' : 'Closing'}</span>
        <span className="muted-text">Step {i + 1} of {seq.length}</span>
      </div>
      <div className="practice-progress" aria-hidden="true"><i style={{ width: `${((i + 1) / seq.length) * 100}%` }} /></div>

      <section className="card practice-stage" aria-live="polite">
        <PoseFigure pose={step.pose} />
        <div className="practice-text">
          <h2>{step.title}</h2>
          <p className="step-how">{step.how}</p>
          {step.ar && (
            <figure className="arabic-block">
              <p className={`arabic ${step.ar.length > 80 ? 'small' : ''}`} lang="ar" dir="rtl">{step.ar}</p>
              <p className="translit">{step.tr}</p>
              <figcaption>“{step.en}”{step.repeat && <span className="chip">{step.repeat}</span>}</figcaption>
            </figure>
          )}
          {step.recite === 'fatihah' && <Recitation key={step.key} ayahs={fatihah} />}
          {step.recite === 'surah' && <Recitation key={step.key} ayahs={surah.ayahs} bismillah={surah.bismillah} />}
        </div>
      </section>

      <div className="lesson-controls practice-controls">
        <button onClick={() => setI(x => x - 1)} disabled={i === 0}><ChevronLeft size={17} /> Back</button>
        {last
          ? <button className="go" onClick={finish}>Finish</button>
          : <button className="go" onClick={() => setI(x => x + 1)}>Next <ChevronRight size={17} /></button>}
      </div>
      <p className="fine-print">Recitation: Mishary Rashid Alafasy. Other phrases are shown without audio. Tip: use the arrow keys or space bar to move on.</p>
    </main>
  );
}
