import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { BISMILLAH, SURAHS } from '@/data/quran';

export function generateStaticParams() {
 return SURAHS.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
 const { slug } = await params;
 const surah = SURAHS.find(s => s.slug === slug);
 return { title: surah ? `${surah.nameEnglish} — Nur` : 'Qur’an — Nur' };
}

const arabicNumerals = (n: number) => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);

export default async function SurahPage({ params }: { params: Promise<{ slug: string }> }) {
 const { slug } = await params;
 const index = SURAHS.findIndex(s => s.slug === slug);
 if (index === -1) notFound();
 const surah = SURAHS[index];
 const prev = SURAHS[index - 1];
 const next = SURAHS[index + 1];
 return <div className="dashboard-content surah-reader">
  <nav className="surah-crumb"><Link href="/quran"><ArrowLeft size={15} aria-hidden="true"/> All surahs</Link></nav>
  <header className="surah-head card">
   <span className="surah-number" aria-hidden="true">{surah.number}</span>
   <div className="surah-arabic" lang="ar" dir="rtl">{surah.nameArabic}</div>
   <h1>{surah.nameEnglish} <span>· {surah.meaning}</span></h1>
   <p>{surah.intro}</p>
   <small>{surah.ayahs.length} ayahs · {surah.revelation}</small>
  </header>
  {surah.number !== 1 && <p className="bismillah" lang="ar" dir="rtl">{BISMILLAH}</p>}
  <ol className="ayah-list">
   {surah.ayahs.map(a => <li key={a.number} className="ayah card">
    <p className="ayah-arabic" lang="ar" dir="rtl">{a.arabic} <span className="ayah-mark">{arabicNumerals(a.number)}</span></p>
    <p className="ayah-translit">{a.transliteration}</p>
    <p className="ayah-translation">{a.number}. {a.translation}</p>
   </li>)}
  </ol>
  <nav className="surah-pager" aria-label="Surah navigation">
   {prev ? <Link href={`/quran/${prev.slug}`}><ArrowLeft size={15} aria-hidden="true"/> {prev.nameEnglish}</Link> : <span/>}
   {next ? <Link href={`/quran/${next.slug}`}>{next.nameEnglish} <ArrowRight size={15} aria-hidden="true"/></Link> : <span/>}
  </nav>
  <p className="surah-source">Arabic: Uthmani script · Translation: Pickthall</p>
 </div>;
}
