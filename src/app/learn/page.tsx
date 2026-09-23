'use client';
import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle2, Clock } from 'lucide-react';
import { ContentPage } from '@/components/content-page';
import { LESSONS } from '@/lib/content';
import { useStored } from '@/lib/store';

export default function Learn() {
  const [done, setDone] = useStored<string[]>('nur.lessons', []);
  const next = LESSONS.find(l => !done.includes(l.slug));
  const pct = Math.round((done.length / LESSONS.length) * 100);

  return (
    <ContentPage eyebrow="My first steps" title="Learn Islam" description="Short lessons for anyone exploring Islam, including people who have recently embraced the faith. There is no need to rush.">
      <div className="learn-hero">
        <div>
          <h2>{next ? 'One lesson at a time.' : 'Every lesson complete — mashaAllah.'}</h2>
          <p>{next ? `Up next: ${next.title}. Learn, reflect, and return whenever you are ready.` : 'Revisit any lesson whenever you like, or continue with Learn Salah.'}</p>
          {next ? <Link href={`/learn/${next.slug}`} className="primary-button small">Continue <ArrowRight size={15} /></Link> : <Link href="/learn-salah" className="primary-button small">Learn Salah <ArrowRight size={15} /></Link>}
        </div>
        <div className="journey-stat">
          <strong>{pct}%</strong>
          <span>{done.length} of {LESSONS.length} lessons</span>
          {done.length > 0 && <button className="text-button" onClick={() => setDone([])}>Start over</button>}
        </div>
      </div>
      <div className="lesson-cards">
        {LESSONS.map((l, i) => {
          const complete = done.includes(l.slug);
          return (
            <Link href={`/learn/${l.slug}`} className={`card lesson-item ${complete ? 'done' : ''} ${next?.slug === l.slug ? 'current' : ''}`} key={l.slug}>
              <span className="arch-icon">{complete ? <CheckCircle2 size={20} /> : <BookOpen size={20} />}</span>
              <div>
                <span className="lesson-no">Lesson {i + 1}{complete ? ' · done' : ''}</span>
                <h3>{l.title}</h3>
                <p>{l.summary}</p>
                <small><Clock size={13} /> {l.minutes} min</small>
              </div>
              <ArrowRight size={18} />
            </Link>
          );
        })}
      </div>
    </ContentPage>
  );
}
