import { ContentPage } from '@/components/content-page';
import { getJuzStarts, getSurahList } from '@/lib/quran-data';
import SurahBrowser from './surah-browser';

export const metadata = { title: 'Qur’an — Nur' };

export default async function QuranPage() {
  const surahs = await getSurahList();
  return (
    <ContentPage eyebrow="Read & listen" title="Qur’an" description="The whole Qur’an — read it cover to cover by surah or by juz, or study it verse by verse with translation, transliteration and recitation.">
      <SurahBrowser surahs={surahs} juz={getJuzStarts()} />
    </ContentPage>
  );
}
