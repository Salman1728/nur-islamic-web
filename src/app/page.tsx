import Link from 'next/link';
import { BookOpen, Check, HandHeart, MoonStar, Sparkles } from 'lucide-react';
import { FIVE_PRAYERS, NEXT_PRAYER } from '@/data/prayer';
import { LEARNING_JOURNEY } from '@/data/content';

const features = [
  { icon: MoonStar, title: 'Prayer times', text: 'Accurate daily prayer times with a clear next-prayer countdown.' },
  { icon: BookOpen, title: 'Beginner Qur’an', text: 'Read short surahs with translation, transliteration and audio.' },
  { icon: Sparkles, title: 'Learn Salah', text: 'A calm, visual, step-by-step guide made for first-time learners.' },
  { icon: HandHeart, title: 'Essential duas', text: 'Simple daily duas for eating, sleeping, travel and protection.' },
];

/** Sun-position marker: an arc of the day with a dot where the sun sits at this prayer. */
function PrayerMark({ t, label, moon = false, light = false }: { t: number; label: string; moon?: boolean; light?: boolean }) {
  const x = 60 - 52 * Math.cos(Math.PI * t);
  const y = 42 - 34 * Math.sin(Math.PI * t);
  return (
    <div className={`prayer-mark${light ? ' light' : ''}`}>
      <svg viewBox="0 0 120 48" aria-hidden="true">
        <line className="horizon" x1="0" y1="42" x2="120" y2="42" />
        <path className="arc" d="M 8 42 A 52 34 0 0 1 112 42" fill="none" />
        {moon
          ? <text className="moon" x={x} y={y + 4} textAnchor="middle">☾</text>
          : <circle className="sun" cx={x} cy={y} r="4.5" />}
      </svg>
      <span>{label}</span>
    </div>
  );
}

function Skyline() {
  return (
    <svg className="skyline" viewBox="0 0 1440 190" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <g className="silhouette">
        {/* finial + crescent above the dome */}
        <path d="M719 70 h3 v-26 h-3 Z" />
        <circle cx="720.5" cy="38" r="4" />
        {/* skyline: wall, two minarets, central dome */}
        <path d="M0 190 V156 H468 V100 H476 L491 34 L506 100 H514 V156 H602 A118 100 0 0 1 838 156 H926 V100 H934 L949 34 L964 100 H972 V156 H1440 V190 Z" />
      </g>
    </svg>
  );
}

export default function LandingPage() {
  return (
    <main className="landing-shell">
      {/* ——— Fajr: the day begins ——— */}
      <section className="hero-section">
        <header className="landing-nav">
          <Link href="/" className="brand-lockup"><span className="brand-mark"><MoonStar size={22} /></span><span><strong>Nur</strong><small>Your Islamic Companion</small></span></Link>
          <nav className="desktop-links"><a href="#features">Features</a><a href="#learn">Learn</a><a href="#quran">Qur’an</a><a href="#about">About</a></nav>
          <Link href="/dashboard" className="primary-button dawn small">Get started</Link>
        </header>

        <div className="hero-inner">
          <div className="hero-copy">
            <PrayerMark t={0.05} label="Fajr — the day begins" light />
            <h1>Light for every hour of your day.</h1>
            <p>Prayer times, Qur’an, and gentle lessons — one calm companion for Muslims at every stage, and a welcoming first step for reverts.</p>
            <div className="hero-actions">
              <Link href="/dashboard" className="primary-button dawn">Start your journey</Link>
              <a href="#features" className="ghost-button">Explore features</a>
            </div>
            <div className="hero-points">
              {['Prayer times', 'Qur’an', 'Learn Salah', 'Duas', 'Qibla', 'Beginner lessons'].map(item => <span key={item}><Check size={15} />{item}</span>)}
            </div>
          </div>

          <aside className="prayer-card" aria-label="Today’s prayer times">
            <small>Next prayer · in {NEXT_PRAYER.remaining}</small>
            <strong>{NEXT_PRAYER.name}</strong>
            <em>{NEXT_PRAYER.time} {NEXT_PRAYER.meridiem}</em>
            <div className="prayer-rows">
              {FIVE_PRAYERS.map(p => (
                <div key={p.name} className={p.name === NEXT_PRAYER.name ? 'now' : ''}><span>{p.name}</span><b>{p.time}</b></div>
              ))}
            </div>
          </aside>
        </div>

        <div className="hero-sun" aria-hidden="true" />
        <Skyline />
      </section>

      {/* ——— Daylight: Dhuhr + Asr share one warming sky ——— */}
      <div className="daylight">

      {/* ——— Dhuhr: the heart of the day ——— */}
      <section id="features" className="feature-section">
        <div className="section-heading">
          <PrayerMark t={0.5} label="Dhuhr — the heart of the day" />
          <h2>Your daily Islamic companion</h2>
          <p>Start with the essentials, then grow at your own pace. Clear explanations, gentle progress and no clutter.</p>
        </div>
        <div className="feature-grid">
          {features.map(({ icon: Icon, title, text }) => (
            <article key={title} className="feature-card">
              <span className="feature-icon"><Icon /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ——— Asr: time to grow ——— */}
      <section id="learn" className="journey-section">
        <div className="journey-copy">
          <PrayerMark t={0.72} label="Asr — time to grow" />
          <h2>Your first steps, made clear.</h2>
          <p>Move through short lessons covering Shahadah, Wudu, Salah, the Five Pillars and everyday Islamic manners.</p>
          <Link href="/dashboard" className="primary-button">Open learning journey</Link>
        </div>
        <div className="journey-card">
          <div className="progress-head"><strong>My Learning Journey</strong><span>{LEARNING_JOURNEY.progressPercent}%</span></div>
          <div className="progress-bar"><i style={{ width: `${LEARNING_JOURNEY.progressPercent}%` }} /></div>
          {LEARNING_JOURNEY.lessons.map((lesson, index) => (
            <div className={`journey-row ${index < LEARNING_JOURNEY.completedCount ? 'complete' : ''}`} key={lesson}>
              <span>{index < LEARNING_JOURNEY.completedCount ? '✓' : index + 1}</span><b>{lesson}</b><small>{index < LEARNING_JOURNEY.completedCount ? 'Completed' : 'Next lesson'}</small>
            </div>
          ))}
        </div>
      </section>

      </div>

      {/* ——— Maghrib: a moment of stillness ——— */}
      <section id="quran" className="verse-section">
        <PrayerMark t={0.95} label="Maghrib — a moment of stillness" light />
        <p className="arabic-verse" lang="ar" dir="rtl">اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ</p>
        <p className="verse-en">“Allah is the Light of the heavens and the earth.”</p>
        <span className="verse-ref">Surah An-Nur · 24:35</span>
        <Link href="/dashboard" className="ghost-button">Read with translation &amp; audio</Link>
      </section>

      {/* ——— Isha: rest, the day is complete ——— */}
      <footer id="about" className="night-footer">
        <PrayerMark t={0.5} label="Isha — rest, the day is complete" moon light />
        <h2>Begin tonight. Wake with Fajr.</h2>
        <Link href="/dashboard" className="primary-button dawn">Start your journey</Link>
        <div className="footer-base">
          <div className="brand-lockup"><span className="brand-mark"><MoonStar size={20} /></span><span><strong>Nur</strong><small>Your Islamic Companion</small></span></div>
          <nav className="footer-links" aria-label="Footer">
            <a href="#features">Features</a><a href="#learn">Learn</a><a href="#quran">Qur’an</a><a href="#about">About</a><Link href="/dashboard">Dashboard</Link>
          </nav>
          <p>Built with care for Muslims at every stage of their journey.</p>
        </div>
      </footer>
    </main>
  );
}
