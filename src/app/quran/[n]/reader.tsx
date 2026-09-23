'use client';
import { useEffect, useRef, useState } from 'react';
import { Bookmark, BookmarkCheck, Pause, Play } from 'lucide-react';
import { ayahAudio, type Ayah } from '@/lib/quran';
import { useStored } from '@/lib/store';
import type { QuranBookmark } from '../surah-browser';

export default function Reader({ surah, name, ayahs, audio, bismillah }: { surah: number; name: string; ayahs: Ayah[]; audio: string; bismillah: string | null }) {
  const player = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState<'surah' | number | null>(null);
  const [showTr, setShowTr] = useStored('nur.quran.translit', true);
  const [showEn, setShowEn] = useStored('nur.quran.english', true);
  const [bookmark, setBookmark] = useStored<QuranBookmark>('nur.quran.bookmark', null);

  useEffect(() => {
    const el = player.current;
    if (!el) return;
    const stop = () => setPlaying(null);
    el.addEventListener('ended', stop);
    el.addEventListener('pause', stop);
    return () => { el.removeEventListener('ended', stop); el.removeEventListener('pause', stop); };
  }, []);

  const play = (what: 'surah' | number) => {
    const el = player.current;
    if (!el) return;
    if (playing === what) { el.pause(); return; }
    el.src = what === 'surah' ? audio : ayahAudio(ayahs.find(a => a.n === what)!.global);
    el.play().then(() => setPlaying(what)).catch(() => setPlaying(null));
  };

  const marked = (n: number) => bookmark?.surah === surah && bookmark.ayah === n;

  return (
    <>
      <div className="reader-toolbar">
        <button className="primary-button small" onClick={() => play('surah')}>
          {playing === 'surah' ? <><Pause size={16} /> Pause recitation</> : <><Play size={16} /> Play full surah</>}
        </button>
        <label className="toggle"><input type="checkbox" checked={showTr} onChange={e => setShowTr(e.target.checked)} /> Transliteration</label>
        <label className="toggle"><input type="checkbox" checked={showEn} onChange={e => setShowEn(e.target.checked)} /> Translation</label>
        <audio ref={player} preload="none" />
      </div>

      {bismillah && <p className="bismillah" lang="ar" dir="rtl">{bismillah}</p>}

      <ol className="ayah-list">
        {ayahs.map(a => (
          <li key={a.n} id={`ayah-${a.n}`} className={`ayah ${playing === a.n ? 'playing' : ''}`}>
            <div className="ayah-tools">
              <span className="ayah-num" aria-label={`Verse ${a.n}`}>{a.n}</span>
              <button onClick={() => play(a.n)} aria-label={playing === a.n ? `Pause verse ${a.n}` : `Play verse ${a.n}`}>{playing === a.n ? <Pause size={15} /> : <Play size={15} />}</button>
              <button onClick={() => setBookmark(marked(a.n) ? null : { surah, ayah: a.n, name })} aria-pressed={marked(a.n)} aria-label={marked(a.n) ? 'Remove bookmark' : `Bookmark verse ${a.n}`}>
                {marked(a.n) ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
              </button>
            </div>
            <p className="ayah-ar" lang="ar" dir="rtl">{a.ar}</p>
            {showTr && <p className="ayah-tr">{a.tr}</p>}
            {showEn && <p className="ayah-en">{a.en}</p>}
          </li>
        ))}
      </ol>
    </>
  );
}
