'use client';
import Link from 'next/link';
import { LocateFixed, MapPin } from 'lucide-react';
import { useSettings } from '@/lib/settings';
import { useLocate } from '@/lib/locate';

/** Shown until the visitor confirms a place — prayer times are only as right as the location. */
export function LocationBanner() {
  const { settings, guessed, update } = useSettings();
  const { locate, busy, error } = useLocate();
  if (!guessed) return null;

  return (
    <div className="location-banner" role="status">
      <MapPin size={18} />
      <p>
        <b>Showing times for {settings.place}.</b> We guessed this from your device’s time zone — confirm your location for accurate prayer times.
        {error && <span className="form-error">{error}</span>}
      </p>
      <div className="inline-actions">
        <button onClick={locate} disabled={busy}><LocateFixed size={16} /> {busy ? 'Locating…' : 'Use my location'}</button>
        <Link href="/settings">Choose a city</Link>
        <button onClick={() => update({ place: settings.place, lat: settings.lat, lng: settings.lng, tz: settings.tz, method: settings.method })}>That’s right</button>
      </div>
    </div>
  );
}
