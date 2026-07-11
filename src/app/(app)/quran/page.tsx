import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { SURAHS } from '@/data/quran';

export const metadata = { title: 'Qur’an — Nur' };

export default function QuranPage() {
 return <div className="dashboard-content">
  <header className="quran-head">
   <span className="eyebrow"><BookOpen size={14} aria-hidden="true"/> Beginner Qur’an</span>
   <h1>Short surahs to read and reflect</h1>
   <p>Start with the surahs most Muslims learn first — each with the Arabic, a gentle transliteration, and a translation. The full mushaf, audio recitation and tafsir are on the way.</p>
  </header>
  <div className="surah-grid">
   {SURAHS.map(s => <Link key={s.slug} href={`/quran/${s.slug}`} className="surah-card">
    <span className="surah-number" aria-hidden="true">{s.number}</span>
    <span className="surah-arabic" lang="ar" dir="rtl">{s.nameArabic}</span>
    <h2>{s.nameEnglish}</h2>
    <p>{s.meaning}</p>
    <small>{s.ayahs.length} ayahs · {s.revelation}</small>
   </Link>)}
  </div>
 </div>;
}
