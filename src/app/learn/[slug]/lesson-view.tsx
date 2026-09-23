'use client';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, ChevronLeft } from 'lucide-react';
import AppShell from '@/components/app-shell';
import { LESSONS } from '@/lib/content';
import { useStored } from '@/lib/store';

export default function LessonView({ slug }: { slug: string }) {
  const i = LESSONS.findIndex(l => l.slug === slug);
  const lesson = LESSONS[i];
  const prev = LESSONS[i - 1], next = LESSONS[i + 1];
  const [done, setDone] = useStored<string[]>('nur.lessons', []);
  const complete = done.includes(slug);

  return (
    <AppShell>
      <main className="content-page lesson-page">
        <Link href="/learn" className="back-link"><ChevronLeft size={16} /> All lessons</Link>
        <header className="page-intro">
          <span className="page-eyebrow">Lesson {i + 1} of {LESSONS.length} · {lesson.minutes} min</span>
          <h1>{lesson.title}</h1>
          <p>{lesson.summary}</p>
        </header>
        <article className="lesson-body">
          {lesson.sections.map(s => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.body.length > 3 ? <ol>{s.body.map(b => <li key={b}>{b}</li>)}</ol> : s.body.map(b => <p key={b}>{b}</p>)}
              {s.arabic && (
                <figure className="arabic-block">
                  <p className="arabic" lang="ar" dir="rtl">{s.arabic.ar}</p>
                  <p className="translit">{s.arabic.tr}</p>
                  <figcaption>“{s.arabic.en}”</figcaption>
                </figure>
              )}
            </section>
          ))}
          {slug === 'salah' && <Link href="/learn-salah" className="primary-button small">Open the Learn Salah guide <ArrowRight size={15} /></Link>}
        </article>
        <div className="lesson-footer">
          <button className={`primary-button ${complete ? 'done' : ''}`} onClick={() => setDone(d => complete ? d.filter(x => x !== slug) : [...d, slug])} aria-pressed={complete}>
            <Check size={16} /> {complete ? 'Completed' : 'Mark as complete'}
          </button>
          <div className="lesson-nav">
            {prev && <Link href={`/learn/${prev.slug}`}><ArrowLeft size={15} /> {prev.title}</Link>}
            {next && <Link href={`/learn/${next.slug}`}>{next.title} <ArrowRight size={15} /></Link>}
          </div>
        </div>
      </main>
    </AppShell>
  );
}
