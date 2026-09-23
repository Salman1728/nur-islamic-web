import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AppShell from '@/components/app-shell';
import { BISMILLAH, getJuz } from '@/lib/quran-data';
import Reader from '../../[n]/reader';

export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: 30 }, (_, i) => ({ j: String(i + 1) }));
}

const parse = (j: string) => { const n = Number(j); return Number.isInteger(n) && n >= 1 && n <= 30 ? n : null; };

export async function generateMetadata({ params }: { params: Promise<{ j: string }> }) {
  const j = parse((await params).j);
  return { title: j ? `Juz ${j} — Qur’an — Nur` : 'Juz not found — Nur' };
}

export default async function JuzPage({ params }: { params: Promise<{ j: string }> }) {
  const j = parse((await params).j);
  if (!j) notFound();
  const sections = await getJuz(j);
  const first = sections[0], last = sections[sections.length - 1];
  const range = `${first.meta.englishName} ${first.meta.number}:${first.ayahs[0].n} – ${last.meta.englishName} ${last.meta.number}:${last.ayahs[last.ayahs.length - 1].n}`;

  return (
    <AppShell>
      <main className="content-page reader-page">
        <Link href="/quran" className="back-link"><ChevronLeft size={16} /> Qur’an</Link>
        <header className="surah-head">
          <span className="page-eyebrow">Juz {j} of 30</span>
          <h1>Juz {j}</h1>
          <p>{range}</p>
        </header>
        <Reader
          key={j}
          idPrefix="s"
          sections={sections.map(s => ({
            surah: s.meta.number,
            name: s.meta.englishName,
            // Name every surah that begins inside this juz; a surah continuing from the previous juz just carries on.
            title: s.startsSurah ? s.meta.name : undefined,
            ayahs: s.ayahs,
            bismillah: s.showBismillah ? BISMILLAH : null,
          }))}
        />
        <nav className="surah-pager">
          {j > 1 ? <Link href={`/quran/juz/${j - 1}`}><ChevronLeft size={16} /> Juz {j - 1}</Link> : <span />}
          {j < 30 ? <Link href={`/quran/juz/${j + 1}`}>Juz {j + 1} <ChevronRight size={16} /></Link> : <span />}
        </nav>
        <p className="fine-print">Arabic: Tanzil Uthmani text. Translation: Saheeh International. Recitation: Mishary Rashid Alafasy. Text via alquran.cloud.</p>
      </main>
    </AppShell>
  );
}
