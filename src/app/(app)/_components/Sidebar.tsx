'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, CalendarDays, CheckCircle2, Compass, GraduationCap, HandHeart, Home, MoonStar, Settings, Sparkles, type LucideIcon } from 'lucide-react';

type NavItem = { icon: LucideIcon; label: string; href: string };
const NAV: readonly NavItem[] = [
 { icon: Home, label: 'Dashboard', href: '/dashboard' },
 { icon: MoonStar, label: 'Prayer Times', href: '/prayer-times' },
 { icon: BookOpen, label: 'Qur’an', href: '/quran' },
 { icon: Sparkles, label: 'Learn Islam', href: '/learn-islam' },
 { icon: GraduationCap, label: 'Learn Salah', href: '/learn-salah' },
 { icon: HandHeart, label: 'Duas & Adhkar', href: '/duas' },
 { icon: Compass, label: 'Qibla Finder', href: '/qibla' },
 { icon: CalendarDays, label: 'Islamic Calendar', href: '/calendar' },
 { icon: CheckCircle2, label: 'Prayer Tracker', href: '/tracker' },
 { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar({ id, open, onNavigate }: { id?: string; open?: boolean; onNavigate?: () => void }) {
 const pathname = usePathname();
 return <aside id={id} className={open ? 'sidebar open' : 'sidebar'}>
  <Link href="/" className="side-brand" onClick={onNavigate}><span className="brand-mark light"><MoonStar aria-hidden="true"/></span><span><strong>Nur</strong><small>Your Islamic Companion</small></span></Link>
  <nav>{NAV.map(({ icon: Icon, label, href }) => {
   const active = pathname === href || pathname.startsWith(href + '/');
   return <Link key={href} href={href} onClick={onNavigate} className={active ? 'active' : undefined} aria-current={active ? 'page' : undefined}><Icon size={18} aria-hidden="true"/>{label}</Link>;
  })}</nav>
  <div className="side-support"><MoonStar size={18} aria-hidden="true"/><strong>Keep the light on</strong><small>Support our mission</small><button>Donate</button></div>
 </aside>;
}
