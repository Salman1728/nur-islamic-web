'use client';
import { useState } from 'react';
import { Bookmark, BookmarkCheck, Copy, Check } from 'lucide-react';
import { ContentPage } from '@/components/content-page';
import { DUAS, DUA_CATEGORIES } from '@/lib/content';
import { useStored } from '@/lib/store';

type Tab = (typeof DUA_CATEGORIES)[number] | 'Saved';

export default function Duas() {
  const [tab, setTab] = useState<Tab>('All');
  const [saved, setSaved] = useStored<string[]>('nur.duas.saved', []);
  const [copied, setCopied] = useState<string | null>(null);
  const list = DUAS.filter(d => tab === 'All' || (tab === 'Saved' ? saved.includes(d.id) : d.category === tab));

  const copy = async (id: string, text: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 1600); } catch { /* clipboard blocked */ }
  };

  return (
    <ContentPage eyebrow="Daily worship" title="Duas & Adhkar" description="A small collection of authentic daily supplications, each with its source. Save the ones you are learning.">
      <div className="segmented wrap" role="tablist">
        {[...DUA_CATEGORIES, 'Saved' as const].map(c => (
          <button key={c} role="tab" aria-selected={tab === c} className={tab === c ? 'on' : ''} onClick={() => setTab(c)}>
            {c}{c === 'Saved' && saved.length ? ` · ${saved.length}` : ''}
          </button>
        ))}
      </div>
      <div className="dua-list">
        {list.map(d => {
          const on = saved.includes(d.id);
          return (
            <article className="card dua-card" key={d.id} id={d.id}>
              <div className="dua-head">
                <div><h3>{d.title}</h3><small>{d.category}{d.count ? ` · ${d.count}` : ''}</small></div>
                <div className="dua-actions">
                  <button onClick={() => copy(d.id, `${d.ar}\n${d.tr}\n${d.en} (${d.source})`)} aria-label={`Copy ${d.title}`}>{copied === d.id ? <Check size={17} /> : <Copy size={17} />}</button>
                  <button onClick={() => setSaved(s => on ? s.filter(x => x !== d.id) : [...s, d.id])} aria-pressed={on} aria-label={on ? `Unsave ${d.title}` : `Save ${d.title}`}>{on ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}</button>
                </div>
              </div>
              <p className="arabic" lang="ar" dir="rtl">{d.ar}</p>
              <p className="translit">{d.tr}</p>
              <p className="dua-en">“{d.en}”</p>
              <span className="source">{d.source}</span>
            </article>
          );
        })}
        {list.length === 0 && <p className="empty">Nothing saved yet — tap the bookmark on any dua to keep it here.</p>}
      </div>
    </ContentPage>
  );
}
