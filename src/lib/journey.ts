// "My first 30 days": a gentle path through what the app already teaches.
// Steps are actions that point at existing content — no new religious claims live here.
// Most complete themselves from what the person has done in the app; the rest are ticked by hand.
import type { TrackerLog } from './store';

export type JourneyCtx = {
  lessons: string[];
  tracker: TrackerLog;
  savedDuas: string[];
  visited: string[];
  practice: { count: number; prayers: string[] };
  located: boolean; // the person confirmed their own place
};

export type JourneyStep = {
  day: number;
  title: string;
  note: string;
  href: string;
  cta: string;
  auto?: (c: JourneyCtx) => boolean; // absent = the person ticks it themselves
};

const prayedOnce = (t: TrackerLog, p: string) => Object.values(t).some(d => d.includes(p));
const fullDays = (t: TrackerLog) => Object.values(t).filter(d => d.length >= 5).length;
const saw = (c: JourneyCtx, path: string) => c.visited.includes(path);

export const WEEKS = ['Foundations', 'Your daily prayers', 'Remembrance', 'Growing steadily'];

export const JOURNEY: JourneyStep[] = [
  { day: 1, title: 'What is Islam?', note: 'Begin with the meaning of Islam and what Muslims believe.', href: '/learn/what-is-islam', cta: 'Read the lesson', auto: c => c.lessons.includes('what-is-islam') },
  { day: 2, title: 'The Shahadah', note: 'The testimony of faith — its words and what they mean.', href: '/learn/shahadah', cta: 'Read the lesson', auto: c => c.lessons.includes('shahadah') },
  { day: 3, title: 'The Five Pillars', note: 'The five acts of worship that shape a Muslim’s life.', href: '/learn/five-pillars', cta: 'Read the lesson', auto: c => c.lessons.includes('five-pillars') },
  { day: 4, title: 'Learn wudu', note: 'The washing that prepares you for prayer.', href: '/learn/wudu', cta: 'Read the lesson', auto: c => c.lessons.includes('wudu') },
  { day: 5, title: 'How the prayer works', note: 'The five daily prayers and what one rak‘ah is.', href: '/learn/salah', cta: 'Read the lesson', auto: c => c.lessons.includes('salah') },
  { day: 6, title: 'Walk through the positions', note: 'Go step by step through each position and its words.', href: '/learn-salah', cta: 'Open Learn Salah', auto: c => saw(c, '/learn-salah') || c.practice.count >= 1 },
  { day: 7, title: 'Listen to Al-Fatihah', note: 'The opening chapter, recited in every rak‘ah. Listen and read the meaning.', href: '/quran/1', cta: 'Open Al-Fatihah', auto: c => saw(c, '/quran/1') },

  { day: 8, title: 'Set your prayer times', note: 'Confirm your location so the times are right for you.', href: '/prayer', cta: 'Check prayer times', auto: c => c.located },
  { day: 9, title: 'Practise a whole prayer', note: 'Pray along with Fajr, the shortest prayer, one position at a time.', href: '/learn-salah/practice', cta: 'Start practice', auto: c => c.practice.count >= 1 },
  { day: 10, title: 'Pray Fajr', note: 'The dawn prayer. Mark it in your tracker when you have prayed.', href: '/tracker', cta: 'Open tracker', auto: c => prayedOnce(c.tracker, 'Fajr') },
  { day: 11, title: 'Pray Maghrib', note: 'The sunset prayer — three rak‘ahs.', href: '/tracker', cta: 'Open tracker', auto: c => prayedOnce(c.tracker, 'Maghrib') },
  { day: 12, title: 'Listen to Al-Ikhlas', note: 'A short surah you can recite after Al-Fatihah.', href: '/quran/112', cta: 'Open Al-Ikhlas', auto: c => saw(c, '/quran/112') },
  { day: 13, title: 'Practise a four-rak‘ah prayer', note: 'Dhuhr, Asr or Isha — including the middle sitting.', href: '/learn-salah/practice', cta: 'Start practice', auto: c => c.practice.prayers.some(p => p === 'Dhuhr' || p === 'Asr' || p === 'Isha') },
  { day: 14, title: 'All five in one day', note: 'Pray all five prayers in a single day. Take your time getting here.', href: '/tracker', cta: 'Open tracker', auto: c => fullDays(c.tracker) >= 1 },

  { day: 15, title: 'Daily manners', note: 'Small habits that bring remembrance into ordinary moments.', href: '/learn/manners', cta: 'Read the lesson', auto: c => c.lessons.includes('manners') },
  { day: 16, title: 'A dua before eating', note: 'Save it and say it at your next meal.', href: '/duas#before-eating', cta: 'Open duas', auto: c => c.savedDuas.includes('before-eating') },
  { day: 17, title: 'A dua before sleeping', note: 'Save it and say it tonight.', href: '/duas#before-sleeping', cta: 'Open duas', auto: c => c.savedDuas.includes('before-sleeping') },
  { day: 18, title: 'The hadith on intention', note: 'Read the first hadith of Sahih al-Bukhari and reflect on it.', href: '/hadith#bukhari-1', cta: 'Read the hadith', auto: c => saw(c, '/hadith') },
  { day: 19, title: 'Listen to Al-Falaq', note: 'A short surah seeking protection.', href: '/quran/113', cta: 'Open Al-Falaq', auto: c => saw(c, '/quran/113') },
  { day: 20, title: 'Listen to An-Nas', note: 'The last surah of the Qur’an.', href: '/quran/114', cta: 'Open An-Nas', auto: c => saw(c, '/quran/114') },
  { day: 21, title: 'Find the Qibla', note: 'Learn which way to face from where you live.', href: '/qibla', cta: 'Open Qibla finder', auto: c => saw(c, '/qibla') },

  { day: 22, title: 'Words you will hear', note: 'Browse the glossary — Sunnah, Jumu‘ah, Insha’Allah and more.', href: '/terms', cta: 'Open glossary', auto: c => saw(c, '/terms') },
  { day: 23, title: 'The Islamic calendar', note: 'See today’s Hijri date and the occasions ahead.', href: '/calendar', cta: 'Open calendar', auto: c => saw(c, '/calendar') },
  { day: 24, title: 'Listen to Al-Asr', note: 'Three verses about time and what truly matters.', href: '/quran/103', cta: 'Open Al-Asr', auto: c => saw(c, '/quran/103') },
  { day: 25, title: 'Remember Allah', note: 'Save the dhikr “SubhanAllahi wa bihamdihi” and say it through the day.', href: '/duas#subhanallah-wa-bihamdihi', cta: 'Open duas', auto: c => c.savedDuas.includes('subhanallah-wa-bihamdihi') },
  { day: 26, title: 'Three full days', note: 'Pray all five prayers on three different days.', href: '/tracker', cta: 'Open tracker', auto: c => fullDays(c.tracker) >= 3 },
  { day: 27, title: 'Visit a mosque', note: 'Go to a local mosque — introduce yourself; people are glad to help new Muslims.', href: '/qibla', cta: 'Mark when done' },
  { day: 28, title: 'Every lesson', note: 'Finish any lessons you have not read yet.', href: '/learn', cta: 'Open lessons', auto: c => c.lessons.length >= 6 },
  { day: 29, title: 'Seven full days', note: 'All five prayers on seven different days. Missing one is not failure — keep going.', href: '/tracker', cta: 'Open tracker', auto: c => fullDays(c.tracker) >= 7 },
  { day: 30, title: 'Look back', note: 'Revisit the first lesson and notice how far you have come.', href: '/learn/what-is-islam', cta: 'Mark when done' },
];

export function isDone(s: JourneyStep, ctx: JourneyCtx, manual: number[]) {
  return manual.includes(s.day) || (s.auto?.(ctx) ?? false);
}
