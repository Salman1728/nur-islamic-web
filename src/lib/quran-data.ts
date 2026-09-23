// Server only: uses node:fs, so importing this from a client component fails the build.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { Ayah, SurahMeta } from './quran';

// The whole Qur'an, read from the snapshot in src/data/quran/ (Tanzil Uthmani text,
// Saheeh International, transliteration — via api.alquran.cloud). Nothing here is typed by
// hand and nothing calls the network: every surah and juz page is prerendered at build time.

const DIR = path.join(process.cwd(), 'src', 'data', 'quran');
const read = <T,>(file: string): T => JSON.parse(readFileSync(path.join(DIR, file), 'utf8')) as T;

type Index = { list: SurahMeta[]; juz: Record<string, { surah: number; ayah: number }> };
let index: Index | null = null;
const getIndex = () => (index ??= read<Index>('index.json'));

export const getSurahList = async () => getIndex().list;

/** Where each of the 30 juz begins. */
export const getJuzStarts = () => Object.entries(getIndex().juz).map(([j, at]) => ({ juz: Number(j), ...at, name: getIndex().list[at.surah - 1].englishName }));

export const BISMILLAH = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'.normalize('NFC');

// Compare letters only: the source marks the basmala differently in a few surahs (e.g. 95 and 97
// carry an extra shadda), and hand-typed Arabic may order diacritics differently.
const letters = (t: string) => t.replace(/[ً-ٰٟۖ-ۭ]/g, '');
const BASMALA_LETTERS = letters(BISMILLAH);

function stripBasmala(text: string) {
  const words = text.split(' ');
  return letters(words.slice(0, 4).join(' ')) === BASMALA_LETTERS ? words.slice(4).join(' ') : text;
}

const cache = new Map<number, { meta: SurahMeta; ayahs: Ayah[] }>();

function loadSurah(n: number) {
  let s = cache.get(n);
  if (!s) {
    const raw = read<{ meta: SurahMeta; ayahs: Ayah[] }>(`${String(n).padStart(3, '0')}.json`);
    const ayahs = raw.ayahs.map((a, i) => {
      const text = a.ar.replace(/^﻿/, '');
      // The Uthmani edition prefixes the basmala to verse 1 of every surah except Al-Fatihah (where it
      // IS verse 1) and At-Tawbah (which has none). Show it once as a header instead.
      return { ...a, ar: n !== 1 && i === 0 ? stripBasmala(text) : text };
    });
    s = { meta: raw.meta, ayahs };
    cache.set(n, s);
  }
  return s;
}

export async function getSurah(n: number) {
  const { meta, ayahs } = loadSurah(n);
  return { meta, ayahs, showBismillah: n !== 1 && n !== 9, bismillah: BISMILLAH };
}

/** One juz as a run of surah sections (a juz can start and end mid-surah). */
export async function getJuz(j: number) {
  const sections: { meta: SurahMeta; ayahs: Ayah[]; showBismillah: boolean; startsSurah: boolean }[] = [];
  for (let n = 1; n <= 114; n++) {
    const { meta, ayahs } = loadSurah(n);
    const inJuz = ayahs.filter(a => a.juz === j);
    if (inJuz.length) sections.push({ meta, ayahs: inJuz, showBismillah: inJuz[0].n === 1 && n !== 1 && n !== 9, startsSurah: inJuz[0].n === 1 });
    else if (sections.length) break;
  }
  return sections;
}
