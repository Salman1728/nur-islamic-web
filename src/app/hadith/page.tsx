'use client';
import { useState } from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { ContentPage } from '@/components/content-page';
import { HADITHS, sunnahUrl } from '@/lib/hadith';

const THEMES = ['All', ...new Set(HADITHS.map(h => h.theme))];

export default function HadithPage() {
  const [theme, setTheme] = useState('All');
  const [copied, setCopied] = useState<number | null>(null);
  const list = HADITHS.filter(h => theme === 'All' || h.theme === theme);

  const copy = async (n: number, text: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(n); setTimeout(() => setCopied(null), 1600); } catch { /* clipboard blocked */ }
  };

  return (
    <ContentPage eyebrow="Words of the Prophet ﷺ" title="Hadith" description="Short sayings from Sahih al-Bukhari, the most trusted collection of hadith — chosen for everyday life and for anyone new to Islam.">
      <div className="segmented wrap" role="tablist">
        {THEMES.map(t => <button key={t} role="tab" aria-selected={theme === t} className={theme === t ? 'on' : ''} onClick={() => setTheme(t)}>{t}</button>)}
      </div>
      <div className="hadith-list">
        {list.map(h => (
          <article className="card hadith-item" key={h.number} id={`bukhari-${h.number}`}>
            <span className="chip">{h.theme}</span>
            <blockquote>{h.text}</blockquote>
            <div className="hadith-foot">
              <p className="hadith-ref">Narrated by {h.narrator} · Sahih al-Bukhari {h.number}</p>
              <div className="dua-actions">
                <button onClick={() => copy(h.number, `${h.text}\n— Narrated by ${h.narrator}, Sahih al-Bukhari ${h.number}`)} aria-label="Copy hadith">{copied === h.number ? <Check size={16} /> : <Copy size={16} />}</button>
                <a href={sunnahUrl(h.number)} target="_blank" rel="noreferrer" aria-label={`Read Bukhari ${h.number} in Arabic on sunnah.com`}><ExternalLink size={16} /></a>
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="fine-print">English translation by Dr. Muhammad Muhsin Khan, via the open fawazahmed0/hadith-api dataset; numbering follows sunnah.com, where each hadith can be read in Arabic with its full chain of narration.</p>
    </ContentPage>
  );
}
