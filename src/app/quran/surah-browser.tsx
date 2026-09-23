'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Bookmark, BookOpen, Search } from 'lucide-react';
import { BEGINNER_SURAHS } from '@/lib/content';
import type { SurahMeta } from '@/lib/quran';
import { useStored } from '@/lib/store';
import type { LastRead } from './[n]/reader';

export type QuranBookmark = { surah: number; ayah: number; name: string } | null;
export type JuzStart = { juz: number; surah: number; ayah: number; name: string };

type Tab = 'beginner' | 'all' | 'juz';

/** "Continue reading" (automatic) and "Bookmark" (chosen) — shown side by side when they differ. */
export function ContinueCards() {
  const [last] = useStored<LastRead>('nur.quran.last', null);
  const [bookmark] = useStored<QuranBookmark>('nur.quran.bookmark', null);
  const sameSpot = last && bookmark && last.surah === bookmark.surah && last.ayah === bookmark.ayah;
  if (!last && !bookmark) return null;
  return (
    <div className="continue-row">
      {last && (
        <Link href={`/quran/${last.surah}#ayah-${last.ayah}`} className="continue-card">
          <BookOpen size={18} />
          <span><small>Continue reading</small><b>{last.name} · verse {last.ayah}</b></span>
        </Link>
      )}
      {bookmark && !sameSpot && (
        <Link href={`/quran/${bookmark.surah}#ayah-${bookmark.ayah}`} className="continue-card alt">
          <Bookmark size={18} />
          <span><small>Your bookmark</small><b>{bookmark.name} · verse {bookmark.ayah}</b></span>
        </Link>
      )}
    </div>
  );
}

export default function SurahBrowser({ surahs, juz }: { surahs: SurahMeta[]; juz: JuzStart[] }) {
  const [tab, setTab] = useStored<Tab>('nur.quran.tab', 'beginner');
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (needle) return surahs.filter(s => `${s.number} ${s.englishName} ${s.englishNameTranslation}`.toLowerCase().includes(needle));
    return tab === 'beginner' ? BEGINNER_SURAHS.map(n => surahs[n - 1]) : surahs;
  }, [q, tab, surahs]);

  const tabBtn = (t: Tab, label: string) => (
    <button role="tab" aria-selected={tab === t && !q} className={tab === t && !q ? 'on' : ''} onClick={() => { setTab(t); setQ(''); }}>{label}</button>
  );

  return (
    <>
      <ContinueCards />
      <div className="toolbar">
        <div className="segmented" role="tablist">
          {tabBtn('beginner', 'For beginners')}
          {tabBtn('all', 'All 114 surahs')}
          {tabBtn('juz', '30 juz')}
        </div>
        <label className="field-search"><Search size={16} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search surah by name or number" /></label>
      </div>

      {tab === 'juz' && !q.trim() ? (
        <div className="juz-grid">
          {juz.map(j => (
            <Link href={`/quran/juz/${j.juz}`} key={j.juz} className="juz-item">
              <span className="surah-num">{j.juz}</span>
              <span className="surah-names"><b>Juz {j.juz}</b><small>Starts at {j.name} {j.surah}:{j.ayah}</small></span>
            </Link>
          ))}
        </div>
      ) : (
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
      )}
    </>
  );
}
