import Link from 'next/link';
import { BookOpen, CalendarDays, ChevronRight, Compass, GraduationCap, HandHeart, type LucideIcon } from 'lucide-react';
import { CALCULATION_METHOD, NEXT_PRAYER, PRAYER_TIMES } from '@/data/prayer';
import { DAILY_DHIKR, DAILY_VERSE, LEARNING_JOURNEY, TODAY, UPCOMING_EVENTS, USER } from '@/data/content';

const quick: [LucideIcon, string, string, string][] = [[GraduationCap,'Learn Salah','Step-by-step prayer guide','/learn-salah'],[BookOpen,'Read Qur’an','Read, listen and reflect','/quran'],[Compass,'Qibla Finder','Find direction to the Kaaba','/qibla'],[HandHeart,'Daily Duas','Essential duas for your day','/duas'],[CalendarDays,'Islamic Calendar','Important Islamic dates','/calendar']];

export default function Dashboard(){
 return <div className="dashboard-content">
      <div className="welcome-row"><div><h1>Assalamu Alaikum, {USER.name} <span aria-hidden="true">🌿</span></h1><p>May Allah bless your day and guide your steps.</p></div><div className="date-card"><b>{TODAY.hijri}</b><small>{TODAY.gregorian}</small></div></div>
      <div className="dashboard-grid">
       <div className="main-column">
        <div className="top-cards">
          <article className="next-prayer"><small>NEXT PRAYER</small><h2>{NEXT_PRAYER.name}</h2><strong>{NEXT_PRAYER.time} <span>{NEXT_PRAYER.meridiem}</span></strong><p>{NEXT_PRAYER.remaining} remaining</p><div className="time-progress"><i/></div><Link href="/prayer-times" className="cta">View All Prayer Times</Link></article>
          <article className="prayer-list card"><h3>Today’s Prayer Times</h3>{PRAYER_TIMES.map(p=><div key={p.name} className={p.name===NEXT_PRAYER.name?'current':''}><span>{p.name}</span><b>{p.time}</b></div>)}<small>Calculation: {CALCULATION_METHOD}</small></article>
          <article className="verse-card card"><h3>Daily Qur’an Verse</h3><div className="arabic" lang="ar" dir="rtl">{DAILY_VERSE.arabic}</div><p>{DAILY_VERSE.translation}</p><small>{DAILY_VERSE.reference}</small><Link href="/quran" className="cta"><BookOpen size={16} aria-hidden="true"/> Read in Qur’an</Link></article>
        </div>
        <div className="quick-grid">{quick.map(([Icon,title,desc,href])=><Link key={title} href={href} className="quick-card"><span><Icon aria-hidden="true"/></span><h4>{title}</h4><p>{desc}</p><ChevronRight size={17} aria-hidden="true"/></Link>)}</div>
        <div className="lower-grid">
          <article className="card lesson-card"><div className="card-title"><h3>Today’s Lesson</h3><small>5 min read</small></div><div><h4>The Five Pillars of Islam</h4><p>Learn how these five acts shape a Muslim’s life.</p><button>Continue <ChevronRight size={15} aria-hidden="true"/></button></div></article>
          <article className="card progress-card"><div className="card-title"><h3>My Learning Journey</h3><span>{LEARNING_JOURNEY.progressPercent}%</span></div><div className="progress-bar"><i style={{width:`${LEARNING_JOURNEY.progressPercent}%`}}/></div>{LEARNING_JOURNEY.lessons.map((x,i)=><p key={x} className={i<LEARNING_JOURNEY.completedCount?'done':''}><span>{i<LEARNING_JOURNEY.completedCount?'✓':i+1}</span>{x}</p>)}</article>
        </div>
       </div>
       <aside className="right-column">
        <article className="card dhikr"><h3>Daily Dhikr</h3><div className="arabic small" lang="ar" dir="rtl">{DAILY_DHIKR.arabic}</div><b>{DAILY_DHIKR.transliteration}</b><p>{DAILY_DHIKR.meaning}</p><span>{DAILY_DHIKR.count}</span></article>
        <article className="card events"><div className="card-title"><h3>Upcoming Events</h3><small>View all</small></div>{UPCOMING_EVENTS.map(e=><div key={e.title}><b>{e.date}</b><span><strong>{e.title}</strong><small>{e.hijri}</small></span></div>)}</article>
        <article className="card beginner"><span className="eyebrow">New to Islam?</span><h3>Start your journey here.</h3><p>Short, gentle lessons created for reverts and new learners.</p><button>Start Learning <ChevronRight size={15} aria-hidden="true"/></button></article>
       </aside>
      </div>
    </div>
}
