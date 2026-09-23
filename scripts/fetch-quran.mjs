// Snapshots the WHOLE Qur'an into src/data/quran/ — one file per surah plus index.json
// (surah list + where each juz starts). Source: api.alquran.cloud — Tanzil Uthmani text,
// Saheeh International translation, English transliteration. 3 requests in total.
// Builds read these files and never call the API (CI was rate-limited, HTTP 429, when it did).
// Run: node scripts/fetch-quran.mjs — the text is never edited by hand.
import { mkdirSync, writeFileSync } from 'node:fs';

const API = 'https://api.alquran.cloud/v1';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function edition(id) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`${API}/quran/${id}`);
    if (res.ok) { const j = await res.json(); if (j.code === 200) return j.data.surahs; }
    if (attempt === 5) throw new Error(`${id}: HTTP ${res.status}`);
    await sleep(2000 * attempt);
  }
}

const ar = await edition('quran-uthmani');
const en = await edition('en.sahih');
const tr = await edition('en.transliteration');

const total = ar.reduce((n, s) => n + s.ayahs.length, 0);
if (ar.length !== 114 || total !== 6236) throw new Error(`unexpected shape: ${ar.length} surahs, ${total} ayahs`);

const dir = new URL('../src/data/quran/', import.meta.url);
mkdirSync(dir, { recursive: true });

const list = [];
const juz = {};
for (let i = 0; i < 114; i++) {
  const s = ar[i];
  if (en[i].ayahs.length !== s.ayahs.length || tr[i].ayahs.length !== s.ayahs.length) throw new Error(`surah ${s.number}: editions disagree`);
  const meta = { number: s.number, name: s.name, englishName: s.englishName, englishNameTranslation: s.englishNameTranslation, numberOfAyahs: s.ayahs.length, revelationType: s.revelationType };
  list.push(meta);
  const ayahs = s.ayahs.map((a, k) => {
    if (!(a.juz in juz)) juz[a.juz] = { surah: s.number, ayah: a.numberInSurah };
    return { n: a.numberInSurah, global: a.number, juz: a.juz, page: a.page, sajda: Boolean(a.sajda), ar: a.text, en: en[i].ayahs[k].text, tr: tr[i].ayahs[k].text };
  });
  writeFileSync(new URL(`${String(s.number).padStart(3, '0')}.json`, dir), JSON.stringify({ meta, ayahs }) + '\n');
}
writeFileSync(new URL('index.json', dir), JSON.stringify({ source: 'api.alquran.cloud (quran-uthmani, en.sahih, en.transliteration)', list, juz }) + '\n');
console.log(`wrote 114 surahs, ${total} ayahs, ${Object.keys(juz).length} juz starts`);
