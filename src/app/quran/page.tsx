import { ContentPage } from '@/components/content-page';
import { getSurahList } from '@/lib/quran';
import SurahBrowser from './surah-browser';

export const metadata = { title: 'Qur’an — Nur' };

export default async function QuranPage() {
  const surahs = await getSurahList();
  return (
    <ContentPage eyebrow="Read & listen" title="Qur’an" description="All 114 surahs with Arabic, translation, transliteration and recitation. Start small and build a habit at your own pace.">
      <SurahBrowser surahs={surahs} />
    </ContentPage>
  );
}
