// Builds the full, ordered sequence of positions for a whole prayer (every rak‘ah),
// reusing the vetted wording in content.ts. Used by the pray-along practice mode.
import { RAKAHS, SALAH_STEPS } from './content';
import type { PrayerName } from './prayer';

export type Pose = 'stand' | 'hands' | 'bow' | 'prostrate' | 'sit' | 'turn-right' | 'turn-left';

export type PracticeStep = {
  key: string;
  rakah: number; // 0 = before/after the rak‘ahs
  title: string;
  pose: Pose;
  how: string;
  ar?: string;
  tr?: string;
  en?: string;
  repeat?: string;
  recite?: 'fatihah' | 'surah'; // Qur'an recitation: real audio + fetched text
};

const step = (id: string) => SALAH_STEPS.find(s => s.id === id)!;

export function buildSequence(prayer: PrayerName): PracticeStep[] {
  const n = RAKAHS[prayer];
  const out: PracticeStep[] = [];
  const takbir = step('takbir'), ruku = step('ruku'), rise = step('itidal'), sujud = step('sujud'), tash = step('tashahhud'), salam = step('taslim');

  out.push({ key: 'niyyah', rakah: 0, title: 'Intention', pose: 'stand', how: `Stand facing the Qibla. Intend in your heart to pray ${prayer} — ${n} rak‘ahs.` });
  out.push({ key: 'takbir', rakah: 1, title: 'Opening takbir', pose: 'hands', how: 'Raise your hands to your ears or shoulders.', ar: takbir.ar, tr: takbir.tr, en: takbir.en });

  for (let r = 1; r <= n; r++) {
    if (r > 1) out.push({ key: `stand-${r}`, rakah: r, title: `Stand for rak‘ah ${r}`, pose: 'stand', how: 'Rise to standing while saying “Allāhu akbar”.', ar: takbir.ar, tr: takbir.tr, en: takbir.en });
    out.push({ key: `fatihah-${r}`, rakah: r, title: 'Recite Al-Fatihah', pose: 'stand', how: 'Hands folded on your chest. Recite Al-Fatihah — listen and follow along.', recite: 'fatihah' });
    if (r <= 2) out.push({ key: `surah-${r}`, rakah: r, title: 'Recite a short surah', pose: 'stand', how: 'In the first two rak‘ahs, recite a short surah after Al-Fatihah — here, Al-Ikhlas.', recite: 'surah' });
    out.push({ key: `ruku-${r}`, rakah: r, title: 'Rukū‘ — bow', pose: 'bow', how: 'Say “Allāhu akbar” and bow, hands on knees, back level.', ar: ruku.ar, tr: ruku.tr, en: ruku.en, repeat: ruku.repeat });
    out.push({ key: `rise-${r}`, rakah: r, title: 'Rise from bowing', pose: 'stand', how: 'Stand up straight.', ar: rise.ar, tr: rise.tr, en: rise.en });
    out.push({ key: `sujud1-${r}`, rakah: r, title: 'First sujūd', pose: 'prostrate', how: 'Say “Allāhu akbar” and prostrate: forehead, nose, palms, knees and toes on the ground.', ar: sujud.ar, tr: sujud.tr, en: sujud.en, repeat: '3 times' });
    out.push({ key: `sit-${r}`, rakah: r, title: 'Sit briefly', pose: 'sit', how: 'Say “Allāhu akbar” and sit up for a moment, calm and still.' });
    out.push({ key: `sujud2-${r}`, rakah: r, title: 'Second sujūd', pose: 'prostrate', how: 'Say “Allāhu akbar” and prostrate again.', ar: sujud.ar, tr: sujud.tr, en: sujud.en, repeat: '3 times' });
    if (r === 2 && n > 2) out.push({ key: `tash-mid`, rakah: r, title: 'Middle tashahhud', pose: 'sit', how: 'Sit and recite the tashahhud, then stand for the next rak‘ah.', ar: tash.ar, tr: tash.tr, en: tash.en });
  }

  out.push({ key: 'tash-final', rakah: n, title: 'Final tashahhud', pose: 'sit', how: 'Sit and recite the tashahhud, then send salawat upon the Prophet ﷺ.', ar: tash.ar, tr: tash.tr, en: tash.en });
  out.push({ key: 'salam-right', rakah: 0, title: 'Taslīm — right', pose: 'turn-right', how: 'Turn your head to the right.', ar: salam.ar, tr: salam.tr, en: salam.en });
  out.push({ key: 'salam-left', rakah: 0, title: 'Taslīm — left', pose: 'turn-left', how: 'Turn your head to the left. Your prayer is complete.', ar: salam.ar, tr: salam.tr, en: salam.en });
  return out;
}
