'use client';
import { useEffect, useState } from 'react';
import { Bell, Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import SearchBox from './SearchBox';

export default function AppFrame({ children }: { children: React.ReactNode }) {
 const [navOpen, setNavOpen] = useState(false);
 useEffect(() => {
  if (!navOpen) return;
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setNavOpen(false); };
  window.addEventListener('keydown', onKey);
  return () => window.removeEventListener('keydown', onKey);
 }, [navOpen]);
 return <div className="app-shell">
  <Sidebar id="app-sidebar" open={navOpen} onNavigate={() => setNavOpen(false)}/>
  {navOpen && <button className="nav-backdrop" aria-label="Close navigation menu" onClick={() => setNavOpen(false)}/>}
  <div className="workspace">
   <header className="topbar">
    <button className="mobile-menu" aria-label={navOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={navOpen} aria-controls="app-sidebar" onClick={() => setNavOpen(o => !o)}><Menu aria-hidden="true"/></button>
    <SearchBox/>
    <div className="top-meta"><span><span aria-hidden="true">📍</span> Nairobi, Kenya</span><button aria-label="Notifications"><Bell size={19} aria-hidden="true"/></button><span className="avatar" aria-hidden="true">S</span><b>Salman</b></div>
   </header>
   <main className="app-main">{children}</main>
  </div>
 </div>;
}
