/** Curated short surahs for the Beginner Qur’an reader.
 *  Text sourced verbatim from the AlQuran Cloud API (api.alquran.cloud):
 *  Arabic: quran-uthmani · Translation: Pickthall (public domain) · Transliteration: en.transliteration.
 *  Do not hand-edit the ayah text — regenerate from the API instead. */

export interface Ayah {
  number: number;
  arabic: string;
  transliteration: string;
  translation: string;
}

export interface Surah {
  number: number;
  slug: string;
  nameArabic: string;
  nameEnglish: string;
  meaning: string;
  revelation: string;
  intro: string;
  ayahs: Ayah[];
}

export const BISMILLAH = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

export const SURAHS: readonly Surah[] = [
 {
  number: 1,
  slug: "al-fatiha",
  nameArabic: "سُورَةُ ٱلْفَاتِحَةِ",
  nameEnglish: "Al-Faatiha",
  meaning: "The Opening",
  revelation: "Meccan",
  intro: "The seven verses recited in every unit of salah — the heart of the prayer.",
  ayahs: [
   {
    number: 1,
    arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    transliteration: "Bismillaahir Rahmaanir Raheem",
    translation: "In the name of Allah, the Beneficent, the Merciful."
   },
   {
    number: 2,
    arabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
    transliteration: "Alhamdu lillaahi Rabbil 'aalameen",
    translation: "Praise be to Allah, Lord of the Worlds,"
   },
   {
    number: 3,
    arabic: "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    transliteration: "Ar-Rahmaanir-Raheem",
    translation: "The Beneficent, the Merciful."
   },
   {
    number: 4,
    arabic: "مَٰلِكِ يَوْمِ ٱلدِّينِ",
    transliteration: "Maaliki Yawmid-Deen",
    translation: "Master of the Day of Judgment,"
   },
   {
    number: 5,
    arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    transliteration: "Iyyaaka na'budu wa lyyaaka nasta'een",
    translation: "Thee (alone) we worship; Thee (alone) we ask for help."
   },
   {
    number: 6,
    arabic: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
    transliteration: "Ihdinas-Siraatal-Mustaqeem",
    translation: "Show us the straight path,"
   },
   {
    number: 7,
    arabic: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",
    transliteration: "Siraatal-lazeena an'amta 'alaihim ghayril-maghdoobi 'alaihim wa lad-daaalleen",
    translation: "The path of those whom Thou hast favoured; Not the (path) of those who earn Thine anger nor of those who go astray."
   }
  ]
 },
 {
  number: 94,
  slug: "ash-sharh",
  nameArabic: "سُورَةُ الشَّرۡحِ",
  nameEnglish: "Ash-Sharh",
  meaning: "The Relief",
  revelation: "Meccan",
  intro: "A gentle reassurance: with every hardship comes ease.",
  ayahs: [
   {
    number: 1,
    arabic: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ",
    transliteration: "Alam nashrah laka sadrak",
    translation: "Have We not caused thy bosom to dilate,"
   },
   {
    number: 2,
    arabic: "وَوَضَعْنَا عَنكَ وِزْرَكَ",
    transliteration: "Wa wa d'ana 'anka wizrak",
    translation: "And eased thee of the burden"
   },
   {
    number: 3,
    arabic: "ٱلَّذِىٓ أَنقَضَ ظَهْرَكَ",
    transliteration: "Allazee anqada zahrak",
    translation: "Which weighed down thy back;"
   },
   {
    number: 4,
    arabic: "وَرَفَعْنَا لَكَ ذِكْرَكَ",
    transliteration: "Wa raf 'ana laka zikrak",
    translation: "And exalted thy fame?"
   },
   {
    number: 5,
    arabic: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
    transliteration: "Fa inna ma'al usri yusra",
    translation: "But lo! with hardship goeth ease,"
   },
   {
    number: 6,
    arabic: "إِنَّ مَعَ ٱلْعُسْرِ يُسْرًۭا",
    transliteration: "Inna ma'al 'usri yusra",
    translation: "Lo! with hardship goeth ease;"
   },
   {
    number: 7,
    arabic: "فَإِذَا فَرَغْتَ فَٱنصَبْ",
    transliteration: "Fa iza faragh ta fansab",
    translation: "So when thou art relieved, still toil"
   },
   {
    number: 8,
    arabic: "وَإِلَىٰ رَبِّكَ فَٱرْغَب",
    transliteration: "Wa ilaa rabbika far ghab",
    translation: "And strive to please thy Lord."
   }
  ]
 },
 {
  number: 103,
  slug: "al-asr",
  nameArabic: "سُورَةُ العَصۡرِ",
  nameEnglish: "Al-Asr",
  meaning: "The Declining Day",
  revelation: "Meccan",
  intro: "Three short verses that Imam ash-Shafi‘i said would suffice humanity if they reflected on them.",
  ayahs: [
   {
    number: 1,
    arabic: "وَٱلْعَصْرِ",
    transliteration: "Wal' asr",
    translation: "By the declining day,"
   },
   {
    number: 2,
    arabic: "إِنَّ ٱلْإِنسَٰنَ لَفِى خُسْرٍ",
    transliteration: "Innal insaana lafee khusr",
    translation: "Lo! man is a state of loss,"
   },
   {
    number: 3,
    arabic: "إِلَّا ٱلَّذِينَ ءَامَنُوا۟ وَعَمِلُوا۟ ٱلصَّٰلِحَٰتِ وَتَوَاصَوْا۟ بِٱلْحَقِّ وَتَوَاصَوْا۟ بِٱلصَّبْرِ",
    transliteration: "Il lal lazeena aamanu wa 'amilus saali haati wa tawa saw bil haqqi wa tawa saw bis sabr",
    translation: "Save those who believe and do good works, and exhort one another to truth and exhort one another to endurance."
   }
  ]
 },
 {
  number: 112,
  slug: "al-ikhlas",
  nameArabic: "سُورَةُ الإِخۡلَاصِ",
  nameEnglish: "Al-Ikhlaas",
  meaning: "The Sincerity",
  revelation: "Meccan",
  intro: "The essence of tawhid — said to be equal to a third of the Qur’an.",
  ayahs: [
   {
    number: 1,
    arabic: "قُلْ هُوَ ٱللَّهُ أَحَدٌ",
    transliteration: "Qul huwal laahu ahad",
    translation: "Say: He is Allah, the One!"
   },
   {
    number: 2,
    arabic: "ٱللَّهُ ٱلصَّمَدُ",
    transliteration: "Allah hus-samad",
    translation: "Allah, the eternally Besought of all!"
   },
   {
    number: 3,
    arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
    transliteration: "Lam yalid wa lam yoolad",
    translation: "He begetteth not nor was begotten."
   },
   {
    number: 4,
    arabic: "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ",
    transliteration: "Wa lam yakul-lahu kufuwan ahad",
    translation: "And there is none comparable unto Him."
   }
  ]
 },
 {
  number: 113,
  slug: "al-falaq",
  nameArabic: "سُورَةُ الفَلَقِ",
  nameEnglish: "Al-Falaq",
  meaning: "The Daybreak",
  revelation: "Meccan",
  intro: "One of the two protecting surahs, seeking refuge with the Lord of the dawn.",
  ayahs: [
   {
    number: 1,
    arabic: "قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ",
    transliteration: "Qul a'uzoo bi rabbil-falaq",
    translation: "Say: I seek refuge in the Lord of the Daybreak"
   },
   {
    number: 2,
    arabic: "مِن شَرِّ مَا خَلَقَ",
    transliteration: "Min sharri ma khalaq",
    translation: "From the evil of that which He created;"
   },
   {
    number: 3,
    arabic: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
    transliteration: "Wa min sharri ghasiqin iza waqab",
    translation: "From the evil of the darkness when it is intense,"
   },
   {
    number: 4,
    arabic: "وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِى ٱلْعُقَدِ",
    transliteration: "Wa min sharrin-naffaa-thaati fil 'uqad",
    translation: "And from the evil of malignant witchcraft,"
   },
   {
    number: 5,
    arabic: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    transliteration: "Wa min shar ri haasidin iza hasad",
    translation: "And from the evil of the envier when he envieth."
   }
  ]
 },
 {
  number: 114,
  slug: "an-nas",
  nameArabic: "سُورَةُ النَّاسِ",
  nameEnglish: "An-Naas",
  meaning: "Mankind",
  revelation: "Meccan",
  intro: "The Qur’an’s closing surah — refuge with the Lord of mankind.",
  ayahs: [
   {
    number: 1,
    arabic: "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ",
    transliteration: "Qul a'uzu birabbin naas",
    translation: "Say: I seek refuge in the Lord of mankind,"
   },
   {
    number: 2,
    arabic: "مَلِكِ ٱلنَّاسِ",
    transliteration: "Malikin naas",
    translation: "The King of mankind,"
   },
   {
    number: 3,
    arabic: "إِلَٰهِ ٱلنَّاسِ",
    transliteration: "Ilaahin naas",
    translation: "The god of mankind,"
   },
   {
    number: 4,
    arabic: "مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ",
    transliteration: "Min sharril was waasil khannaas",
    translation: "From the evil of the sneaking whisperer,"
   },
   {
    number: 5,
    arabic: "ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ",
    transliteration: "Al lazee yuwas wisu fee sudoorin naas",
    translation: "Who whispereth in the hearts of mankind,"
   },
   {
    number: 6,
    arabic: "مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ",
    transliteration: "Minal jinnati wan naas",
    translation: "Of the jinn and of mankind."
   }
  ]
 }
] as const;
