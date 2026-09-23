'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Bookmark, Search } from 'lucide-react';
import { BEGINNER_SURAHS } from '@/lib/content';
import type { SurahMeta } from '@/lib/quran';
import { useStored } from '@/lib/store';

export type QuranBookmark = { surah: number; ayah: number; name: string } | null;

export default function SurahBrowser({ surahs }: { surahs: SurahMeta[] }) {
  const [tab, setTab] = useState<'beginner' | 'all'>('beginner');
  const [q, setQ] = useState('');
  const [bookmark] = useStored<QuranBookmark>('nur.quran.bookmark', null);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (needle) return surahs.filter(s => `${s.number} ${s.englishName} ${s.englishNameTranslation}`.toLowerCase().includes(needle));
    return tab === 'beginner' ? BEGINNER_SURAHS.map(n => surahs[n - 1]) : surahs;
  }, [q, tab, surahs]);

  return (
    <>
      {bookmark && (
        <Link href={`/quran/${bookmark.surah}#ayah-${bookmark.ayah}`} className="continue-card">
          <Bookmark size={18} />
          <span><small>Continue reading</small><b>{bookmark.name} · verse {bookmark.ayah}</b></span>
        </Link>
      )}
      <div className="toolbar">
        <div className="segmented" role="tablist">
          <button role="tab" aria-selected={tab === 'beginner' && !q} className={tab === 'beginner' && !q ? 'on' : ''} onClick={() => { setTab('beginner'); setQ(''); }}>For beginners</button>
          <button role="tab" aria-selected={tab === 'all' && !q} className={tab === 'all' && !q ? 'on' : ''} onClick={() => { setTab('all'); setQ(''); }}>All 114</button>
        </div>
        <label className="field-search"><Search size={16} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name or number" /></label>
      </div>
      <div className="surah-grid">
        {list.map(s => (
          <Link href={`/quran/${s.number}`} key={s.number} className="surah-item">
            <span className="surah-num">{s.number}</span>
            <span className="surah-names"><b>{s.englishName}</b><small>{s.englishNameTranslation} · {s.numberOfAyahs} verses</small></span>
            <span className="surah-ar" lang="ar" dir="rtl">{s.name.replace(/^سُورَةُ\s*/, '')}</span>
          </Link>
        ))}
        {list.length === 0 && <p className="empty">No surah matches “{q}”.</p>}
      </div>
    </>
  );
}
