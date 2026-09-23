'use client';
import { useState } from 'react';
import { browserTz, useSettings } from './settings';

/** Browser geolocation → settings. Coordinates stay in this browser. */
export function useLocate() {
  const { update } = useSettings();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locate = () => {
    if (!('geolocation' in navigator)) { setError('Your browser does not support location. Choose a city in Settings.'); return; }
    setBusy(true); setError(null);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = +pos.coords.latitude.toFixed(4), lng = +pos.coords.longitude.toFixed(4);
        // The device is where the person is, so its time zone is the place's time zone.
        update({ lat, lng, tz: browserTz(), place: `My location (${lat.toFixed(2)}, ${lng.toFixed(2)})` });
        setBusy(false);
      },
      err => {
        setError(err.code === err.PERMISSION_DENIED ? 'Location permission was denied. Choose a city in Settings instead.' : 'Could not get your location. Try again, or choose a city in Settings.');
        setBusy(false);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 600000 },
    );
  };

  return { locate, busy, error };
}
