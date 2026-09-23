import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AppShell from '@/components/app-shell';
import { BEGINNER_SURAHS } from '@/lib/content';
import { getSurah, surahAudio } from '@/lib/quran';
import Reader from './reader';

export function generateStaticParams() {
  return [...BEGINNER_SURAHS, 94].map(n => ({ n: String(n) }));
}

function parse(n: string) {
  const num = Number(n);
  return Number.isInteger(num) && num >= 1 && num <= 114 ? num : null;
}

export async function generateMetadata({ params }: { params: Promise<{ n: string }> }) {
  const num = parse((await params).n);
  if (!num) return { title: 'Surah not found — Nur' };
  const { meta } = await getSurah(num);
  return { title: `${meta.englishName} (${num}) — Nur` };
}

export default async function SurahPage({ params }: { params: Promise<{ n: string }> }) {
  const num = parse((await params).n);
  if (!num) notFound();
  const { meta, ayahs, showBismillah, bismillah } = await getSurah(num);

  return (
    <AppShell>
      <main className="content-page reader-page">
        <Link href="/quran" className="back-link"><ChevronLeft size={16} /> All surahs</Link>
        <header className="surah-head">
          <span className="page-eyebrow">Surah {num} · {meta.revelationType === 'Meccan' ? 'Makkan' : 'Madinan'} · {meta.numberOfAyahs} verses</span>
          <h1>{meta.englishName}</h1>
          <p>{meta.englishNameTranslation}</p>
          <div className="surah-title-ar" lang="ar" dir="rtl">{meta.name}</div>
        </header>
        <Reader surah={num} name={meta.englishName} ayahs={ayahs} audio={surahAudio(num)} bismillah={showBismillah ? bismillah : null} />
        <nav className="surah-pager">
          {num > 1 ? <Link href={`/quran/${num - 1}`}><ChevronLeft size={16} /> Previous surah</Link> : <span />}
          {num < 114 ? <Link href={`/quran/${num + 1}`}>Next surah <ChevronRight size={16} /></Link> : <span />}
        </nav>
        <p className="fine-print">Arabic: Tanzil Uthmani text. Translation: Saheeh International. Recitation: Mishary Rashid Alafasy. Served by alquran.cloud.</p>
      </main>
    </AppShell>
  );
}
