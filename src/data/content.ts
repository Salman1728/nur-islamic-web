/** Single source of truth for shared placeholder content (user, dates,
 *  daily verse/dhikr, learning journey, events). Swap for real data
 *  sources later without touching the pages that render it. */

export const USER = {
  name: 'Salman',
  initial: 'S',
  location: 'Nairobi, Kenya',
};

export const TODAY = {
  hijri: '25 Muharram 1448 AH',
  gregorian: 'Saturday, 11 July 2026',
};

export const DAILY_VERSE = {
  arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
  translation: '“Indeed, with hardship comes ease.”',
  reference: 'Surah Ash-Sharh (94:6)',
};

export const DAILY_DHIKR = {
  arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
  transliteration: 'SubhanAllahi wa bihamdihi',
  meaning: 'Glory be to Allah and praise be to Him.',
  count: '100 times',
};

export const LEARNING_JOURNEY = {
  progressPercent: 35,
  completedCount: 3,
  lessons: ['What is Islam?', 'The Shahadah', 'The Five Pillars', 'How to Make Wudu', 'How to Pray Salah'],
};

export interface UpcomingEvent {
  date: string;
  title: string;
  hijri: string;
}

export const UPCOMING_EVENTS: readonly UpcomingEvent[] = [
  { date: '28 JUL', title: 'First Day of Muharram', hijri: '1 Muharram 1448 AH' },
  { date: '05 SEP', title: 'Eid al-Fitr (Tentative)', hijri: '1 Shawwal 1448 AH' },
];
