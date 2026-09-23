// Client-safe Qur'an types and audio links. The text itself is read on the server by
// quran-data.ts from src/data/quran/ (a snapshot made by scripts/fetch-quran.mjs).

export type SurahMeta = { number: number; name: string; englishName: string; englishNameTranslation: string; numberOfAyahs: number; revelationType: string };
export type Ayah = { n: number; global: number; juz: number; page: number; sajda: boolean; ar: string; en: string; tr: string };

export const surahAudio = (n: number) => `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${n}.mp3`;
export const ayahAudio = (global: number) => `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${global}.mp3`;

/** Verse-end marker digits, as printed in a mushaf: ١٢٣ */
export const arabicNumber = (n: number) => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
