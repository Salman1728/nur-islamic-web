'use client';
import { PrayerMark } from './prayer-mark';
import AppShell from './app-shell';
import { useSettings } from '@/lib/settings';
import { prayerState, useNow } from '@/lib/prayer';

const PHASE_LABEL = {
  fajr: 'Fajr — the day begins',
  dhuhr: 'Dhuhr — the heart of the day',
  asr: 'Asr — time to grow',
  maghrib: 'Maghrib — a moment of stillness',
  isha: 'Isha — rest, the day is complete',
};

/** Sun marker that follows the real sun for the user's location. */
export function LiveMark() {
  const { settings } = useSettings();
  const now = useNow(60_000);
  if (!now) return <div className="prayer-mark placeholder" aria-hidden="true" />;
  const s = prayerState(now, settings);
  const night = s.sunT < 0 || s.sunT > 1;
  return <PrayerMark t={night ? 0.5 : s.sunT} moon={night} label={PHASE_LABEL[s.phase]} />;
}

export function ContentPage({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <AppShell>
      <main className="content-page">
        <div className="page-intro">
          <LiveMark />
          <span className="page-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {children}
      </main>
    </AppShell>
  );
}
