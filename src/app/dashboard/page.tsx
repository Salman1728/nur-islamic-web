import Link from 'next/link';
import { Bell, BookOpen, CalendarDays, CheckCircle2, ChevronRight, Compass, GraduationCap, HandHeart, Home, Menu, MoonStar, Search, Settings, Sparkles, type LucideIcon } from 'lucide-react';

const prayers = [['Fajr','5:06 AM'],['Sunrise','6:28 AM'],['Dhuhr','12:20 PM'],['Asr','3:47 PM'],['Maghrib','6:42 PM'],['Isha','8:03 PM']];
const quick: [LucideIcon, string, string][] = [[GraduationCap,'Learn Salah','Step-by-step prayer guide'],[BookOpen,'Read Qur’an','Read, listen and reflect'],[Compass,'Qibla Finder','Find direction to the Kaaba'],[HandHeart,'Daily Duas','Essential duas for your day'],[CalendarDays,'Islamic Calendar','Important Islamic dates']];
const nav: [LucideIcon, string, boolean?][] = [[Home,'Dashboard',true],[MoonStar,'Prayer Times'],[BookOpen,'Qur’an'],[Sparkles,'Learn Islam'],[GraduationCap,'Learn Salah'],[HandHeart,'Duas & Adhkar'],[Compass,'Qibla Finder'],[CalendarDays,'Islamic Calendar'],[CheckCircle2,'Prayer Tracker'],[Settings,'Settings']];

export default function Dashboard(){
 return <main className="app-shell">
   <aside className="sidebar">
    <Link href="/" className="side-brand"><span className="brand-mark light"><MoonStar/></span><span><strong>Nur</strong><small>Your Islamic Companion</small></span></Link>
    <nav>{nav.map(([Icon,label,active])=><a key={label} className={active?'active':''}><Icon size={18}/>{label}</a>)}</nav>
    <div className="side-support"><MoonStar size={18}/><strong>Keep the light on</strong><small>Support our mission</small><button>Donate</button></div>
   </aside>
   <section className="workspace">
    <header className="topbar"><button className="mobile-menu"><Menu/></button><div className="searchbox"><Search size={18}/><span>Search anything...</span></div><div className="top-meta"><span>📍 Nairobi, Kenya</span><Bell size={19}/><span className="avatar">S</span><b>Salman</b></div></header>
    <div className="dashboard-content">
      <div className="welcome-row"><div><h1>Assalamu Alaikum, Salman 🌿</h1><p>May Allah bless your day and guide your steps.</p></div><div className="date-card"><b>25 Muharram 1448 AH</b><small>Saturday, 11 July 2026</small></div></div>
      <div className="dashboard-grid">
       <div className="main-column">
        <div className="top-cards">
          <article className="next-prayer"><small>NEXT PRAYER</small><h2>Asr</h2><strong>3:47 <span>PM</span></strong><p>1h 24m remaining</p><div className="time-progress"><i/></div><button>View All Prayer Times</button></article>
          <article className="prayer-list card"><h3>Today’s Prayer Times</h3>{prayers.map(([n,t])=><div key={n} className={n==='Asr'?'current':''}><span>{n}</span><b>{t}</b></div>)}<small>Calculation: Muslim World League</small></article>
          <article className="verse-card card"><h3>Daily Qur’an Verse</h3><div className="arabic">إِنَّ مَعَ الْعُسْرِ يُسْرًا</div><p>“Indeed, with hardship comes ease.”</p><small>Surah Ash-Sharh (94:6)</small><button><BookOpen size={16}/> Read in Qur’an</button></article>
        </div>
        <div className="quick-grid">{quick.map(([Icon,title,desc])=><article key={title} className="quick-card"><span><Icon/></span><h4>{title}</h4><p>{desc}</p><ChevronRight size={17}/></article>)}</div>
        <div className="lower-grid">
          <article className="card lesson-card"><div className="card-title"><h3>Today’s Lesson</h3><small>5 min read</small></div><div><h4>The Five Pillars of Islam</h4><p>Learn how these five acts shape a Muslim’s life.</p><button>Continue <ChevronRight size={15}/></button></div></article>
          <article className="card progress-card"><div className="card-title"><h3>My Learning Journey</h3><span>35%</span></div><div className="progress-bar"><i/></div>{['What is Islam?','Shahadah','Five Pillars','How to Make Wudu','How to Pray'].map((x,i)=><p key={x} className={i<3?'done':''}><span>{i<3?'✓':i+1}</span>{x}</p>)}</article>
        </div>
       </div>
       <aside className="right-column">
        <article className="card dhikr"><h3>Daily Dhikr</h3><div className="arabic small">سُبْحَانَ اللَّهِ وَبِحَمْدِهِ</div><b>SubhanAllahi wa bihamdihi</b><p>Glory be to Allah and praise be to Him.</p><span>100 times</span></article>
        <article className="card events"><div className="card-title"><h3>Upcoming Events</h3><small>View all</small></div><div><b>28 JUL</b><span><strong>First Day of Muharram</strong><small>1 Muharram 1448 AH</small></span></div><div><b>05 SEP</b><span><strong>Eid al-Fitr (Tentative)</strong><small>1 Shawwal 1448 AH</small></span></div></article>
        <article className="card beginner"><span className="eyebrow">New to Islam?</span><h3>Start your journey here.</h3><p>Short, gentle lessons created for reverts and new learners.</p><button>Start Learning <ChevronRight size={15}/></button></article>
       </aside>
      </div>
    </div>
   </section>
 </main>
}
