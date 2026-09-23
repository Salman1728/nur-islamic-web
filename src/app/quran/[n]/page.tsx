import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AppShell from '@/components/app-shell';
import { surahAudio } from '@/lib/quran';
import { getSurah, getSurahList } from '@/lib/quran-data';
import Reader from './reader';

// All 114 surahs are prerendered from the snapshot; nothing else exists.
export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: 114 }, (_, i) => ({ n: String(i + 1) }));
}

function parse(n: string) {
  const num = Number(n);
  return Number.isInteger(num) && num >= 1 && num <= 114 ? num : null;
}

export async function generateMetadata({ params }: { params: Promise<{ n: string }> }) {
  const num = parse((await params).n);
  if (!num) return { title: 'Surah not found — Nur' };
  const { meta } = await getSurah(num);
  return { title: `${meta.englishName} (${num}) — Nur`, description: `Surah ${meta.englishName} (${meta.englishNameTranslation}) — Arabic, translation, transliteration and recitation.` };
}

export default async function SurahPage({ params }: { params: Promise<{ n: string }> }) {
  const num = parse((await params).n);
  if (!num) notFound();
  const { meta, ayahs, showBismillah, bismillah } = await getSurah(num);
  const list = await getSurahList();
  const prev = list[num - 2], next = list[num];
  const juzSpan = [...new Set([ayahs[0].juz, ayahs[ayahs.length - 1].juz])].join('–');

  return (
    <AppShell>
      <main className="content-page reader-page">
        <Link href="/quran" className="back-link"><ChevronLeft size={16} /> All surahs</Link>
        <header className="surah-head">
          <span className="page-eyebrow">Surah {num} · {meta.revelationType === 'Meccan' ? 'Makkan' : 'Madinan'} · {meta.numberOfAyahs} verses · Juz {juzSpan}</span>
          <h1>{meta.englishName}</h1>
          <p>{meta.englishNameTranslation}</p>
          <div className="surah-title-ar" lang="ar" dir="rtl">{meta.name}</div>
        </header>
        <Reader key={num} sections={[{ surah: num, name: meta.englishName, ayahs, bismillah: showBismillah ? bismillah : null }]} audio={surahAudio(num)} />
        <nav className="surah-pager">
          {prev ? <Link href={`/quran/${prev.number}`}><ChevronLeft size={16} /> {prev.englishName}</Link> : <span />}
          {next ? <Link href={`/quran/${next.number}`}>{next.englishName} <ChevronRight size={16} /></Link> : <span />}
        </nav>
        <p className="fine-print">Arabic: Tanzil Uthmani text. Translation: Saheeh International. Recitation: Mishary Rashid Alafasy. Text via alquran.cloud.</p>
      </main>
    </AppShell>
  );
}
