'use client';
import Link from 'next/link';

export default function SurahError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="content-page error-page">
      <h1>We couldn’t load this surah.</h1>
      <p>The Qur’an text service didn’t respond. Check your connection and try again.</p>
      <div className="inline-actions"><button className="primary-button small" onClick={reset}>Try again</button><Link href="/quran" className="text-link">Back to all surahs</Link></div>
    </main>
  );
}
