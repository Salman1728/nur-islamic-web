'use client';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Bookmark, BookmarkCheck, Minus, Pause, Play, Plus, X } from 'lucide-react';
import { arabicNumber, ayahAudio, type Ayah } from '@/lib/quran';
import { useStored } from '@/lib/store';
import type { QuranBookmark } from '../surah-browser';

export type ReaderSection = { surah: number; name: string; title?: string; ayahs: Ayah[]; bismillah: string | null };
export type LastRead = { surah: number; ayah: number; name: string; at: number } | null;

type Mode = 'read' | 'study';
const SIZES = [24, 28, 32, 36, 42];

/** Keeps the last verse that scrolled past the top of the screen as "continue reading". */
function useLastRead(root: React.RefObject<HTMLDivElement | null>, key: string) {
  const [, setLast] = useStored<LastRead>('nur.quran.last', null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    // Several verses share the reading band (in Read mode they are inline text), so track all
    // that are visible and save the first in reading order — not whichever the browser reported last.
    const nodes = [...el.querySelectorAll<HTMLElement>('[data-ayah]')];
    const order = new Map(nodes.map((n, i) => [n, i]));
    const visible = new Set<HTMLElement>();
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        const t = e.target as HTMLElement;
        if (e.isIntersecting) visible.add(t); else visible.delete(t);
      }
      const first = [...visible].sort((a, b) => order.get(a)! - order.get(b)!)[0];
      if (!first) return;
      clearTimeout(timer);
      timer = setTimeout(() => setLast({ surah: Number(first.dataset.surah), ayah: Number(first.dataset.ayah), name: first.dataset.name ?? '', at: Date.now() }), 800);
    }, { rootMargin: '-120px 0px -60% 0px' });
    nodes.forEach(n => io.observe(n));
    return () => { io.disconnect(); clearTimeout(timer); };
  }, [root, key, setLast]);
}

export default function Reader({ sections, audio, idPrefix = '' }: { sections: ReaderSection[]; audio?: string; idPrefix?: string }) {
  const player = useRef<HTMLAudioElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState<'surah' | string | null>(null);
  const [mode, setMode] = useStored<Mode>('nur.quran.mode', 'study');
  const [size, setSize] = useStored('nur.quran.size', 1);
  const [showTr, setShowTr] = useStored('nur.quran.translit', true);
  const [showEn, setShowEn] = useStored('nur.quran.english', true);
  const [bookmark, setBookmark] = useStored<QuranBookmark>('nur.quran.bookmark', null);
  const [picked, setPicked] = useState<{ surah: number; name: string; ayah: Ayah } | null>(null);
  useLastRead(root, `${mode}-${sections[0]?.surah}`);

  useEffect(() => {
    const el = player.current;
    if (!el) return;
    const stop = () => setPlaying(null);
    el.addEventListener('ended', stop);
    el.addEventListener('pause', stop);
    return () => { el.removeEventListener('ended', stop); el.removeEventListener('pause', stop); };
  }, []);

  const play = (what: 'surah' | string, src: string) => {
    const el = player.current;
    if (!el) return;
    if (playing === what) { el.pause(); return; }
    el.src = src;
    el.play().then(() => setPlaying(what)).catch(() => setPlaying(null));
  };

  const marked = (surah: number, n: number) => bookmark?.surah === surah && bookmark.ayah === n;
  const toggleMark = (surah: number, n: number, name: string) => setBookmark(marked(surah, n) ? null : { surah, ayah: n, name });
  const id = (surah: number, n: number) => `${idPrefix ? `${idPrefix}${surah}-` : ''}ayah-${n}`;
  const juzMark = (a: Ayah, prev?: Ayah) => prev && a.juz !== prev.juz;

  return (
    <>
      <div className="reader-toolbar">
        <div className="segmented" role="tablist" aria-label="Reading mode">
          <button role="tab" aria-selected={mode === 'read'} className={mode === 'read' ? 'on' : ''} onClick={() => setMode('read')}>Read</button>
          <button role="tab" aria-selected={mode === 'study'} className={mode === 'study' ? 'on' : ''} onClick={() => setMode('study')}>Study</button>
        </div>
        {mode === 'study' ? (
          <>
            <label className="toggle"><input type="checkbox" checked={showTr} onChange={e => setShowTr(e.target.checked)} /> Transliteration</label>
            <label className="toggle"><input type="checkbox" checked={showEn} onChange={e => setShowEn(e.target.checked)} /> Translation</label>
          </>
        ) : (
          <div className="size-controls" aria-label="Text size">
            <button className="icon-btn" onClick={() => setSize(s => Math.max(0, s - 1))} disabled={size === 0} aria-label="Smaller text"><Minus size={16} /></button>
            <button className="icon-btn" onClick={() => setSize(s => Math.min(SIZES.length - 1, s + 1))} disabled={size === SIZES.length - 1} aria-label="Larger text"><Plus size={16} /></button>
            <span className="muted-text">Tap a verse for its meaning</span>
          </div>
        )}
        {audio && (
          <button className="primary-button small" onClick={() => play('surah', audio)}>
            {playing === 'surah' ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Play surah</>}
          </button>
        )}
        <audio ref={player} preload="none" />
      </div>

      <div ref={root}>
        {sections.map(sec => (
          <section key={sec.surah} className="reader-section">
            {sec.title && <h2 className="section-title"><span lang="ar" dir="rtl">{sec.title}</span>{sec.name}</h2>}
            {sec.bismillah && <p className="bismillah" lang="ar" dir="rtl">{sec.bismillah}</p>}

            {mode === 'read' ? (
              <p className="mushaf" lang="ar" dir="rtl" style={{ fontSize: SIZES[size] }}>
                {sec.ayahs.map((a, i) => (
                  <Fragment key={a.n}>
                    {juzMark(a, sec.ayahs[i - 1]) && <span className="juz-inline" dir="ltr">Juz {a.juz}</span>}
                    <span
                      id={id(sec.surah, a.n)} data-surah={sec.surah} data-ayah={a.n} data-name={sec.name}
                      className={`m-ayah ${picked?.ayah.global === a.global ? 'picked' : ''} ${marked(sec.surah, a.n) ? 'marked' : ''} ${playing === String(a.global) ? 'playing' : ''}`}
                      role="button" tabIndex={0}
                      onClick={() => setPicked(p => (p?.ayah.global === a.global ? null : { surah: sec.surah, name: sec.name, ayah: a }))}
                      onKeyDown={e => { if (e.key === 'Enter') setPicked({ surah: sec.surah, name: sec.name, ayah: a }); }}
                    >
                      {a.ar}{a.sajda && <span className="sajda" title="Verse of prostration"> ۩</span>}
                      <span className="ayah-end" aria-label={`verse ${a.n}`}>{arabicNumber(a.n)}</span>{' '}
                    </span>
                  </Fragment>
                ))}
              </p>
            ) : (
              <ol className="ayah-list">
                {sec.ayahs.map((a, i) => (
                  <li key={a.n} id={id(sec.surah, a.n)} data-surah={sec.surah} data-ayah={a.n} data-name={sec.name} className={`ayah ${playing === String(a.global) ? 'playing' : ''}`}>
                    {juzMark(a, sec.ayahs[i - 1]) && <p className="juz-divider">Juz {a.juz}</p>}
                    <div className="ayah-tools">
                      <span className="ayah-num" aria-label={`Verse ${a.n}`}>{a.n}</span>
                      <button onClick={() => play(String(a.global), ayahAudio(a.global))} aria-label={playing === String(a.global) ? `Pause verse ${a.n}` : `Play verse ${a.n}`}>{playing === String(a.global) ? <Pause size={15} /> : <Play size={15} />}</button>
                      <button onClick={() => toggleMark(sec.surah, a.n, sec.name)} aria-pressed={marked(sec.surah, a.n)} aria-label={marked(sec.surah, a.n) ? 'Remove bookmark' : `Bookmark verse ${a.n}`}>
                        {marked(sec.surah, a.n) ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                      </button>
                      {a.sajda && <span className="chip" title="Verse of prostration">۩ Sajdah</span>}
                    </div>
                    <p className="ayah-ar" lang="ar" dir="rtl">{a.ar}</p>
                    {showTr && <p className="ayah-tr">{a.tr}</p>}
                    {showEn && <p className="ayah-en">{a.en}</p>}
                  </li>
                ))}
              </ol>
            )}
          </section>
        ))}
      </div>

      {mode === 'read' && picked && (
        <div className="verse-sheet" role="dialog" aria-label={`${picked.name} ${picked.ayah.n}`}>
          <div className="verse-sheet-head">
            <b>{picked.name} · {picked.ayah.n}</b>
            <div className="dua-actions">
              <button onClick={() => play(String(picked.ayah.global), ayahAudio(picked.ayah.global))} aria-label="Play verse">{playing === String(picked.ayah.global) ? <Pause size={16} /> : <Play size={16} />}</button>
              <button onClick={() => toggleMark(picked.surah, picked.ayah.n, picked.name)} aria-pressed={marked(picked.surah, picked.ayah.n)} aria-label="Bookmark verse">{marked(picked.surah, picked.ayah.n) ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}</button>
              <button onClick={() => setPicked(null)} aria-label="Close"><X size={16} /></button>
            </div>
          </div>
          <p className="ayah-tr">{picked.ayah.tr}</p>
          <p className="ayah-en">{picked.ayah.en}</p>
        </div>
      )}
    </>
  );
}
