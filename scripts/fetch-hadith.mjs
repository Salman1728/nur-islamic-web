// Fetches the curated Sahih al-Bukhari hadiths into src/data/hadith.json.
// Source: fawazahmed0/hadith-api (Muhsin Khan translation, sunnah.com numbering).
// Run: node scripts/fetch-hadith.mjs — the wording is never edited by hand.
// Only cleanup: translator cross-reference notes "(See …)" are dropped, and the closing
// quotation mark / full stop the dataset truncates is restored, and the backtick the dataset
// uses for the letter ayn is shown as ‘.
import { writeFileSync } from 'node:fs';

const PICKS = [
  [1, 'Intention'], [10, 'Character'], [13, 'Brotherhood'], [39, 'Ease'], [2442, 'Brotherhood'],
  [5027, 'Qur’an'], [5376, 'Manners'], [6011, 'Brotherhood'], [6035, 'Character'], [6114, 'Anger'],
  [6116, 'Anger'], [6136, 'Neighbours'], [6412, 'Time'], [6464, 'Consistency'],
];

// Endings the quote-balancing rule gets wrong, checked by eye against the source.
const CLOSE = { 5376: '', 6035: `'"` };

const API = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-bukhari';

function clean(n, text) {
  let t = text.replace(/`/g, '‘').replace(/\s+/g, ' ').replace(/\s*\(See [^)]*\)?\s*$/i, '').trim();
  const m = t.match(/^Narrated ([^:]+):\s*/);
  const narrator = m ? m[1].trim() : '';
  if (m) t = t.slice(m[0].length);
  if (!/[.!?]["']?$/.test(t)) t += '.';
  if (n in CLOSE) t = t.replace(/\.$/, '') + '.' + CLOSE[n];
  else if ((t.match(/"/g) || []).length % 2 === 1) t += '"';
  return { narrator, text: t };
}

const out = [];
for (const [n, theme] of PICKS) {
  const res = await fetch(`${API}/${n}.json`);
  if (!res.ok) throw new Error(`hadith ${n}: HTTP ${res.status}`);
  const h = (await res.json()).hadiths[0];
  if (h.hadithnumber !== n) throw new Error(`hadith ${n}: got ${h.hadithnumber}`);
  out.push({ number: n, theme, ...clean(n, h.text) });
}
writeFileSync(new URL('../src/data/hadith.json', import.meta.url), JSON.stringify(out, null, 2) + '\n');
console.log(`wrote ${out.length} hadiths`);
