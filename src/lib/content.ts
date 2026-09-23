// Religious content lives here, in one place, so it can be reviewed by someone qualified.
// Qur'an text is NOT stored here — it is fetched from api.alquran.cloud (Uthmani + Saheeh International).

export type Lesson = {
  slug: string;
  title: string;
  summary: string;
  minutes: number;
  sections: { heading: string; body: string[]; arabic?: { ar: string; tr: string; en: string } }[];
};

export const LESSONS: Lesson[] = [
  {
    slug: 'what-is-islam',
    title: 'What is Islam?',
    summary: 'The meaning of Islam and the core of what Muslims believe.',
    minutes: 4,
    sections: [
      { heading: 'The meaning of the word', body: ['“Islam” means submission — giving yourself willingly to the One God, Allah. A person who does so is called a Muslim.', 'The word shares its root with salām, peace: the peace that comes from living as your Creator intended.'] },
      { heading: 'One God', body: ['At the heart of Islam is tawḥīd — belief that Allah is One, without partner, parent or child, and that only He deserves worship.', 'Allah is the same God worshipped by Abraham, Moses and Jesus, peace be upon them.'] },
      { heading: 'The six articles of faith', body: ['Muslims believe in Allah; His angels; His revealed books; His messengers; the Last Day; and divine decree (qadar), the good of it and the bad of it.'] },
      { heading: 'The final messenger', body: ['Muslims believe Muhammad ﷺ is the last of the prophets, and that the Qur’an was revealed to him over twenty-three years as guidance for all people.'] },
    ],
  },
  {
    slug: 'shahadah',
    title: 'The Shahadah',
    summary: 'The testimony of faith — its words and what it means.',
    minutes: 3,
    sections: [
      {
        heading: 'The words',
        body: ['The Shahadah is the declaration that makes a person Muslim when said sincerely, understanding its meaning.'],
        arabic: {
          ar: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا ٱللَّٰهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ ٱللَّٰهِ',
          tr: 'Ashhadu an lā ilāha illā-Llāh, wa ashhadu anna Muḥammadan rasūlu-Llāh',
          en: 'I bear witness that there is no god but Allah, and I bear witness that Muhammad is the Messenger of Allah.',
        },
      },
      { heading: 'Two halves', body: ['The first half affirms that nothing deserves worship except Allah. The second affirms that Muhammad ﷺ is His messenger, whose example shows us how to live that belief.'] },
      { heading: 'A new beginning', body: ['For someone embracing Islam, the Shahadah is a fresh start. There is no ceremony required — only sincerity. Many choose to say it in front of witnesses at a local mosque so the community can welcome and support them.'] },
    ],
  },
  {
    slug: 'five-pillars',
    title: 'The Five Pillars',
    summary: 'The five acts of worship that give a Muslim’s life its shape.',
    minutes: 5,
    sections: [
      { heading: '1 · Shahadah — testimony', body: ['Believing in and declaring that there is no god but Allah and that Muhammad ﷺ is His messenger.'] },
      { heading: '2 · Salah — prayer', body: ['Praying five times a day — Fajr, Dhuhr, Asr, Maghrib and Isha — facing the Kaaba in Makkah.'] },
      { heading: '3 · Zakah — purifying charity', body: ['Giving a fixed portion (2.5%) of qualifying savings each year to those in need, once wealth reaches a minimum threshold (niṣāb).'] },
      { heading: '4 · Sawm — fasting', body: ['Fasting from dawn to sunset during the month of Ramadan, for those who are able. The sick, travellers and others with valid reasons are exempt.'] },
      { heading: '5 · Hajj — pilgrimage', body: ['Travelling to Makkah for the pilgrimage once in a lifetime, for those who are physically and financially able.'] },
    ],
  },
  {
    slug: 'wudu',
    title: 'How to Make Wudu',
    summary: 'The simple washing that prepares you for prayer.',
    minutes: 5,
    sections: [
      { heading: 'Why wudu', body: ['Wudu (ablution) is the ritual washing performed before salah and before touching the Qur’an. It is broken by using the toilet, passing wind, deep sleep and similar things.'] },
      { heading: 'Begin', body: ['Make the intention in your heart to perform wudu, then say “Bismillah” (in the name of Allah).'] },
      { heading: 'The steps', body: [
        'Wash both hands up to the wrists, three times.',
        'Rinse the mouth, three times.',
        'Rinse the nose by sniffing water in and blowing it out, three times.',
        'Wash the whole face, from hairline to chin and ear to ear, three times.',
        'Wash the right arm up to and including the elbow, then the left, three times each.',
        'Wipe over the head with wet hands, once.',
        'Wipe the inside and back of the ears, once.',
        'Wash the right foot up to and including the ankle, then the left, three times each.',
      ] },
      { heading: 'Good to know', body: ['Washing each part once is the minimum; three times follows the Prophet’s ﷺ usual practice. Try not to waste water.'] },
    ],
  },
  {
    slug: 'salah',
    title: 'How to Pray Salah',
    summary: 'An overview of the five daily prayers and how one is performed.',
    minutes: 6,
    sections: [
      { heading: 'Five prayers, five moments', body: ['Fajr (2 rak‘ahs) before sunrise, Dhuhr (4) after midday, Asr (4) in the afternoon, Maghrib (3) just after sunset, and Isha (4) at night.'] },
      { heading: 'Before you pray', body: ['Be in a state of wudu, wear clean clothes that cover you appropriately, pray in a clean place, and face the Qibla — the direction of the Kaaba.'] },
      { heading: 'One rak‘ah', body: ['A rak‘ah is one cycle: standing and reciting Al-Fatihah, bowing (rukū‘), rising, two prostrations (sujūd) with a short sitting between them.'] },
      { heading: 'Learn it step by step', body: ['The Learn Salah guide walks through every position with its words, translation and transliteration.'] },
    ],
  },
  {
    slug: 'manners',
    title: 'Daily Islamic Manners',
    summary: 'Small habits that bring remembrance into ordinary moments.',
    minutes: 4,
    sections: [
      { heading: 'Greeting', body: ['Muslims greet each other with “As-salāmu ‘alaykum” (peace be upon you) and reply “Wa ‘alaykumu s-salām” (and upon you be peace).'] },
      { heading: 'Beginning and ending', body: ['Say “Bismillah” before eating, drinking and starting tasks, and “Alhamdulillah” (all praise is for Allah) after finishing and when something good happens.'] },
      { heading: 'Right hand, clean hands', body: ['Eat and drink with the right hand, and keep yourself and your surroundings clean — cleanliness is part of faith.'] },
      { heading: 'Character', body: ['Honesty, keeping promises, kindness to parents and neighbours, and a smile are all acts of worship when done for Allah.'] },
    ],
  },
];

export type SalahStep = { id: string; title: string; position: string; how: string; ar?: string; tr?: string; en?: string; repeat?: string; link?: { href: string; label: string } };

export const SALAH_STEPS: SalahStep[] = [
  { id: 'niyyah', title: 'Intention & Qibla', position: 'Standing', how: 'Stand facing the Qibla. Make the intention in your heart for the prayer you are about to pray — it does not need to be spoken.' },
  { id: 'takbir', title: 'Opening Takbir', position: 'Standing', how: 'Raise your hands to your ears or shoulders and say the takbir. You are now in prayer.', ar: 'اللَّهُ أَكْبَرُ', tr: 'Allāhu akbar', en: 'Allah is the Greatest.' },
  { id: 'qiyam', title: 'Recite Al-Fatihah', position: 'Standing', how: 'Place your right hand over your left on your chest and recite Surah Al-Fatihah. In the first two rak‘ahs, follow it with another short surah such as Al-Ikhlas.', link: { href: '/quran/1', label: 'Read Al-Fatihah' } },
  { id: 'ruku', title: 'Rukū‘ — bowing', position: 'Bowing', how: 'Say “Allāhu akbar” and bow, hands on knees, back level.', ar: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ', tr: 'Subḥāna rabbiya l-‘aẓīm', en: 'Glory be to my Lord, the Most Great.', repeat: '3 times' },
  { id: 'itidal', title: 'Rising from bowing', position: 'Standing', how: 'Rise up straight while saying the first phrase, then say the second once standing.', ar: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ · رَبَّنَا وَلَكَ الْحَمْدُ', tr: 'Sami‘a-Llāhu liman ḥamidah · Rabbanā wa laka l-ḥamd', en: 'Allah hears the one who praises Him · Our Lord, to You belongs all praise.' },
  { id: 'sujud', title: 'Sujūd — prostration', position: 'Prostrating', how: 'Say “Allāhu akbar” and prostrate: forehead, nose, both palms, knees and toes on the ground. Sit briefly, then prostrate a second time.', ar: 'سُبْحَانَ رَبِّيَ الْأَعْلَى', tr: 'Subḥāna rabbiya l-a‘lā', en: 'Glory be to my Lord, the Most High.', repeat: '3 times, in each prostration' },
  { id: 'tashahhud', title: 'Tashahhud — sitting', position: 'Sitting', how: 'After the second rak‘ah, and again at the end of the prayer, sit and recite the tashahhud. In the final sitting, follow it with salawat upon the Prophet ﷺ.', ar: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ', tr: 'At-taḥiyyātu lillāhi waṣ-ṣalawātu waṭ-ṭayyibāt…', en: 'All greetings, prayers and good things are for Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is no god but Allah, and I bear witness that Muhammad is His servant and messenger.' },
  { id: 'taslim', title: 'Taslīm — closing', position: 'Sitting', how: 'Turn your head to the right and say the salam, then to the left and say it again. The prayer is complete.', ar: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ', tr: 'As-salāmu ‘alaykum wa raḥmatu-Llāh', en: 'Peace be upon you and the mercy of Allah.' },
];

export const RAKAHS: Record<string, number> = { Fajr: 2, Dhuhr: 4, Asr: 4, Maghrib: 3, Isha: 4 };

export type Dua = { id: string; title: string; category: string; ar: string; tr: string; en: string; source: string; count?: string };

export const DUA_CATEGORIES = ['All', 'Food', 'Sleep', 'Home', 'Mosque', 'Remembrance'] as const;

export const DUAS: Dua[] = [
  { id: 'before-eating', title: 'Before eating', category: 'Food', ar: 'بِسْمِ اللَّهِ', tr: 'Bismillāh', en: 'In the name of Allah.', source: 'Abu Dawud 3767' },
  { id: 'after-eating', title: 'After eating', category: 'Food', ar: 'الْحَمْدُ لِلَّهِ', tr: 'Al-ḥamdu lillāh', en: 'All praise is for Allah.', source: 'Sahih Muslim 2734' },
  { id: 'before-sleeping', title: 'Before sleeping', category: 'Sleep', ar: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', tr: 'Bismika-Llāhumma amūtu wa aḥyā', en: 'In Your name, O Allah, I die and I live.', source: 'Sahih al-Bukhari 6324' },
  { id: 'waking-up', title: 'On waking up', category: 'Sleep', ar: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', tr: 'Al-ḥamdu lillāhi lladhī aḥyānā ba‘da mā amātanā wa ilayhi n-nushūr', en: 'All praise is for Allah who gave us life after causing us to die, and to Him is the return.', source: 'Sahih al-Bukhari 6324' },
  { id: 'leaving-home', title: 'Leaving the house', category: 'Home', ar: 'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', tr: 'Bismillāh, tawakkaltu ‘ala-Llāh, wa lā ḥawla wa lā quwwata illā bi-Llāh', en: 'In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.', source: 'Abu Dawud 5095' },
  { id: 'entering-mosque', title: 'Entering the mosque', category: 'Mosque', ar: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ', tr: 'Allāhumma-ftaḥ lī abwāba raḥmatik', en: 'O Allah, open for me the doors of Your mercy.', source: 'Sahih Muslim 713' },
  { id: 'leaving-mosque', title: 'Leaving the mosque', category: 'Mosque', ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ', tr: 'Allāhumma innī asʾaluka min faḍlik', en: 'O Allah, I ask You of Your bounty.', source: 'Sahih Muslim 713' },
  { id: 'subhanallah-wa-bihamdihi', title: 'Glorifying Allah', category: 'Remembrance', ar: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', tr: 'Subḥāna-Llāhi wa bi-ḥamdih', en: 'Glory be to Allah and praise be to Him.', source: 'Sahih al-Bukhari 6405', count: '100 times a day' },
  { id: 'after-prayer', title: 'After every prayer', category: 'Remembrance', ar: 'سُبْحَانَ اللَّهِ · الْحَمْدُ لِلَّهِ · اللَّهُ أَكْبَرُ', tr: 'Subḥāna-Llāh · Al-ḥamdu lillāh · Allāhu akbar', en: 'Glory be to Allah · All praise is for Allah · Allah is the Greatest.', source: 'Sahih Muslim 597', count: '33 times each' },
];

export const TERMS: [string, string][] = [
  ['Adhan', 'The call to prayer, announcing that a prayer’s time has begun.'],
  ['Alhamdulillah', '“All praise is for Allah” — said in gratitude, and after finishing something.'],
  ['Ayah', 'A verse of the Qur’an. Literally “sign”.'],
  ['Dhikr', 'Remembrance of Allah, often through short repeated phrases.'],
  ['Dua', 'Supplication — speaking to Allah and asking of Him, in any language.'],
  ['Ghusl', 'A full-body ritual bath, required in certain situations before prayer.'],
  ['Hadith', 'A report of the words, actions or approvals of the Prophet Muhammad ﷺ.'],
  ['Hajj', 'The pilgrimage to Makkah, required once in a lifetime for those able.'],
  ['Halal', 'Permitted in Islam.'],
  ['Haram', 'Forbidden in Islam.'],
  ['Imam', 'The person who leads the prayer; also a title for a religious leader.'],
  ['Iqamah', 'The second call, made just before the congregational prayer starts.'],
  ['Insha’Allah', '“If Allah wills” — said when speaking about the future.'],
  ['Jumu‘ah', 'The Friday congregational prayer, held in place of Dhuhr.'],
  ['Juz', 'One of thirty roughly equal parts of the Qur’an.'],
  ['Masjid', 'A mosque — literally “place of prostration”.'],
  ['Qibla', 'The direction of the Kaaba in Makkah, which Muslims face in prayer.'],
  ['Rak‘ah', 'One complete unit or cycle of the prayer.'],
  ['Ramadan', 'The ninth Hijri month, in which Muslims fast from dawn to sunset.'],
  ['Salah', 'The five daily prayers performed by Muslims.'],
  ['Sawm', 'Fasting — abstaining from food, drink and marital relations from dawn to sunset.'],
  ['Shahadah', 'The testimony of faith that there is no god but Allah and Muhammad is His messenger.'],
  ['SubhanAllah', '“Glory be to Allah” — said in awe and remembrance.'],
  ['Sujood', 'Prostration during prayer, with the forehead on the ground.'],
  ['Sunnah', 'The way and example of the Prophet Muhammad ﷺ.'],
  ['Surah', 'A chapter of the Qur’an. There are 114.'],
  ['Tawhid', 'The oneness of Allah — the foundation of Islamic belief.'],
  ['Ummah', 'The worldwide community of Muslims.'],
  ['Wudu', 'Ritual washing performed before prayer.'],
  ['Zakah', 'Obligatory annual charity on qualifying wealth.'],
];

// Short surahs suggested for beginners (by number).
export const BEGINNER_SURAHS = [1, 112, 113, 114, 108, 103, 110, 111, 109, 107];
