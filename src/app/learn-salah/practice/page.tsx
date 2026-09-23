import AppShell from '@/components/app-shell';
import { getSurah } from '@/lib/quran';
import PrayAlong from './pray-along';

export const metadata = { title: 'Pray-along practice — Nur' };

export default async function PracticePage() {
  // Qur'an text for the recitation steps comes from the same source as the reader.
  const [fatihah, ikhlas] = await Promise.all([getSurah(1), getSurah(112)]);
  return (
    <AppShell>
      <PrayAlong fatihah={fatihah.ayahs} surah={{ name: ikhlas.meta.englishName, ayahs: ikhlas.ayahs, bismillah: ikhlas.bismillah }} />
    </AppShell>
  );
}
