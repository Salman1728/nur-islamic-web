'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBox() {
 const [q, setQ] = useState('');
 return <form role="search" className="searchbox" onSubmit={e => e.preventDefault()}>
  <Search size={18} aria-hidden="true"/>
  <input aria-label="Search" placeholder="Search anything..." value={q} onChange={e => setQ(e.target.value)}/>
 </form>;
}
