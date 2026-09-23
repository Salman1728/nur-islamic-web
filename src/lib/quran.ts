// Qur'an text comes from api.alquran.cloud (Tanzil Uthmani text, Saheeh International translation).
// Nothing here is typed by hand. Responses are cached indefinitely — the text does not change.
const API = 'https://api.alquran.cloud/v1';

export type SurahMeta = { number: number; name: string; englishName: string; englishNameTranslation: string; numberOfAyahs: number; revelationType: string };
export type Ayah = { n: number; global: number; ar: string; en: string; tr: string };

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { next: { revalidate: false } });
  if (!res.ok) throw new Error(`Qur'an API ${res.status} for ${path}`);
  const json = await res.json();
  if (json.code !== 200) throw new Error(`Qur'an API error for ${path}`);
  return json.data as T;
}

export const getSurahList = () => get<SurahMeta[]>('/surah');

const BISMILLAH = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'.normalize('NFC');

// Compare letters only: the API marks the basmala differently in a few surahs (e.g. 95 and 97
// carry an extra shadda), and hand-typed Arabic may order diacritics differently.
const letters = (t: string) => t.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
const BASMALA_LETTERS = letters(BISMILLAH);

function stripBasmala(text: string) {
  const words = text.split(' ');
  return letters(words.slice(0, 4).join(' ')) === BASMALA_LETTERS ? words.slice(4).join(' ') : text;
}

export async function getSurah(n: number) {
  type Edition = SurahMeta & { ayahs: { number: number; numberInSurah: number; text: string }[] };
  const [ar, en, tr] = await get<Edition[]>(`/surah/${n}/editions/quran-uthmani,en.sahih,en.transliteration`);
  const ayahs: Ayah[] = ar.ayahs.map((a, i) => {
    let text = a.text.replace(/^\uFEFF/, '');
    // The Uthmani edition prefixes the basmala to verse 1 of every surah except Al-Fatihah (where it IS verse 1)
    // and At-Tawbah (which has none). Show it once as a header instead.
    if (n !== 1 && i === 0) text = stripBasmala(text);
    return { n: a.numberInSurah, global: a.number, ar: text, en: en.ayahs[i].text, tr: tr.ayahs[i].text };
  });
  const { ayahs: _drop, ...meta } = ar;
  void _drop;
  return { meta: meta as SurahMeta, ayahs, showBismillah: n !== 1 && n !== 9, bismillah: BISMILLAH };
}

export const surahAudio = (n: number) => `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${n}.mp3`;
export const ayahAudio = (global: number) => `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${global}.mp3`;
