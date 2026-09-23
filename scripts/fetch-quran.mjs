// Snapshots the Qur'an data the BUILD needs into src/data/quran-snapshot.json:
// the surah list plus every surah that is prerendered (beginner surahs, 94, practice).
// Source: api.alquran.cloud (Tanzil Uthmani text, Saheeh International, transliteration).
// Builds then never call the API — CI was rate-limited (HTTP 429) when they did.
// Run: node scripts/fetch-quran.mjs — the text is never edited by hand.
import { writeFileSync } from 'node:fs';

const API = 'https://api.alquran.cloud/v1';
// Keep in sync with PRERENDERED in src/lib/quran.ts.
const SURAHS = [1, 112, 113, 114, 108, 103, 110, 111, 109, 107, 94];

const sleep = ms => new Promise(r => setTimeout(r, ms));
async function get(path) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(API + path);
    if (res.ok) { const j = await res.json(); if (j.code === 200) return j.data; }
    if (attempt === 5) throw new Error(`${path}: HTTP ${res.status}`);
    await sleep(1500 * attempt);
  }
}

const list = await get('/surah');
const surahs = {};
for (const n of SURAHS) {
  surahs[n] = await get(`/surah/${n}/editions/quran-uthmani,en.sahih,en.transliteration`);
  await sleep(300);
}
writeFileSync(new URL('../src/data/quran-snapshot.json', import.meta.url), JSON.stringify({ source: 'api.alquran.cloud', list, surahs }) + '\n');
console.log(`list: ${list.length} surahs; snapshotted: ${Object.keys(surahs).join(', ')}`);
