'use client';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { TERMS } from '@/lib/content';

// Keyed on ?q= so a search from the top bar resets the field even when already on this page.
export default function Glossary() {
  const initial = useSearchParams().get('q') ?? '';
  return <GlossaryList key={initial} initial={initial} />;
}

function GlossaryList({ initial }: { initial: string }) {
  const [q, setQ] = useState(initial);

  const needle = q.trim().toLowerCase();
  const list = TERMS.filter(([t, d]) => !needle || t.toLowerCase().includes(needle) || d.toLowerCase().includes(needle));

  return (
    <>
      <label className="field-search wide"><Search size={17} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search a term…" aria-label="Search the glossary" /></label>
      <div className="term-grid">
        {list.map(([t, d]) => <article className="card term" key={t}><h3>{t}</h3><p>{d}</p></article>)}
        {list.length === 0 && <p className="empty">No term matches “{q}”.</p>}
      </div>
    </>
  );
}
