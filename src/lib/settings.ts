'use client';
import { useCallback, useMemo } from 'react';
import { useHydrated, useStored } from './store';

export type Method = 'MuslimWorldLeague' | 'Egyptian' | 'Karachi' | 'UmmAlQura' | 'NorthAmerica' | 'Dubai' | 'Qatar' | 'Singapore' | 'Turkey' | 'MoonsightingCommittee';
export type Madhab = 'shafi' | 'hanafi';

export type Settings = {
  name: string;
  place: string;
  lat: number;
  lng: number;
  tz: string; // IANA zone of the place — every time and "today" is shown in it
  method: Method;
  madhab: Madhab;
  hour24: boolean;
};

export const METHODS: [Method, string][] = [
  ['MuslimWorldLeague', 'Muslim World League'],
  ['Egyptian', 'Egyptian General Authority'],
  ['Karachi', 'University of Islamic Sciences, Karachi'],
  ['UmmAlQura', 'Umm al-Qura, Makkah'],
  ['NorthAmerica', 'ISNA (North America)'],
  ['Dubai', 'Dubai'],
  ['Qatar', 'Qatar'],
  ['Singapore', 'Singapore, Malaysia & Indonesia'],
  ['Turkey', 'Diyanet (Türkiye)'],
  ['MoonsightingCommittee', 'Moonsighting Committee'],
];

export type City = { place: string; region: string; lat: number; lng: number; tz: string; method: Method };

// The method is the one most widely used locally; users can change it in Settings.
export const CITIES: City[] = [
  { region: 'East Africa', place: 'Nairobi, Kenya', lat: -1.2921, lng: 36.8219, tz: 'Africa/Nairobi', method: 'MuslimWorldLeague' },
  { region: 'East Africa', place: 'Mombasa, Kenya', lat: -4.0435, lng: 39.6682, tz: 'Africa/Nairobi', method: 'MuslimWorldLeague' },
  { region: 'East Africa', place: 'Mogadishu, Somalia', lat: 2.0469, lng: 45.3182, tz: 'Africa/Mogadishu', method: 'MuslimWorldLeague' },
  { region: 'East Africa', place: 'Hargeisa, Somaliland', lat: 9.56, lng: 44.065, tz: 'Africa/Mogadishu', method: 'MuslimWorldLeague' },
  { region: 'East Africa', place: 'Dar es Salaam, Tanzania', lat: -6.7924, lng: 39.2083, tz: 'Africa/Dar_es_Salaam', method: 'MuslimWorldLeague' },
  { region: 'East Africa', place: 'Kampala, Uganda', lat: 0.3476, lng: 32.5825, tz: 'Africa/Kampala', method: 'MuslimWorldLeague' },
  { region: 'East Africa', place: 'Addis Ababa, Ethiopia', lat: 9.03, lng: 38.74, tz: 'Africa/Addis_Ababa', method: 'MuslimWorldLeague' },
  { region: 'East Africa', place: 'Djibouti', lat: 11.588, lng: 43.145, tz: 'Africa/Djibouti', method: 'MuslimWorldLeague' },
  { region: 'Africa', place: 'Khartoum, Sudan', lat: 15.5007, lng: 32.5599, tz: 'Africa/Khartoum', method: 'Egyptian' },
  { region: 'Africa', place: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357, tz: 'Africa/Cairo', method: 'Egyptian' },
  { region: 'Africa', place: 'Lagos, Nigeria', lat: 6.5244, lng: 3.3792, tz: 'Africa/Lagos', method: 'MuslimWorldLeague' },
  { region: 'Africa', place: 'Kano, Nigeria', lat: 12.0022, lng: 8.592, tz: 'Africa/Lagos', method: 'MuslimWorldLeague' },
  { region: 'Africa', place: 'Dakar, Senegal', lat: 14.7167, lng: -17.4677, tz: 'Africa/Dakar', method: 'MuslimWorldLeague' },
  { region: 'Africa', place: 'Casablanca, Morocco', lat: 33.5731, lng: -7.5898, tz: 'Africa/Casablanca', method: 'MuslimWorldLeague' },
  { region: 'Africa', place: 'Algiers, Algeria', lat: 36.7538, lng: 3.0588, tz: 'Africa/Algiers', method: 'MuslimWorldLeague' },
  { region: 'Africa', place: 'Tunis, Tunisia', lat: 36.8065, lng: 10.1815, tz: 'Africa/Tunis', method: 'MuslimWorldLeague' },
  { region: 'Africa', place: 'Johannesburg, South Africa', lat: -26.2041, lng: 28.0473, tz: 'Africa/Johannesburg', method: 'MuslimWorldLeague' },
  { region: 'Africa', place: 'Cape Town, South Africa', lat: -33.9249, lng: 18.4241, tz: 'Africa/Johannesburg', method: 'MuslimWorldLeague' },
  { region: 'Middle East', place: 'Makkah, Saudi Arabia', lat: 21.3891, lng: 39.8579, tz: 'Asia/Riyadh', method: 'UmmAlQura' },
  { region: 'Middle East', place: 'Madinah, Saudi Arabia', lat: 24.5247, lng: 39.5692, tz: 'Asia/Riyadh', method: 'UmmAlQura' },
  { region: 'Middle East', place: 'Riyadh, Saudi Arabia', lat: 24.7136, lng: 46.6753, tz: 'Asia/Riyadh', method: 'UmmAlQura' },
  { region: 'Middle East', place: 'Dubai, UAE', lat: 25.2048, lng: 55.2708, tz: 'Asia/Dubai', method: 'Dubai' },
  { region: 'Middle East', place: 'Doha, Qatar', lat: 25.2854, lng: 51.531, tz: 'Asia/Qatar', method: 'Qatar' },
  { region: 'Middle East', place: 'Kuwait City, Kuwait', lat: 29.3759, lng: 47.9774, tz: 'Asia/Kuwait', method: 'MuslimWorldLeague' },
  { region: 'Middle East', place: 'Amman, Jordan', lat: 31.9454, lng: 35.9284, tz: 'Asia/Amman', method: 'MuslimWorldLeague' },
  { region: 'Middle East', place: 'Baghdad, Iraq', lat: 33.3152, lng: 44.3661, tz: 'Asia/Baghdad', method: 'MuslimWorldLeague' },
  { region: 'Middle East', place: 'Istanbul, Türkiye', lat: 41.0082, lng: 28.9784, tz: 'Europe/Istanbul', method: 'Turkey' },
  { region: 'Asia', place: 'Karachi, Pakistan', lat: 24.8607, lng: 67.0011, tz: 'Asia/Karachi', method: 'Karachi' },
  { region: 'Asia', place: 'Lahore, Pakistan', lat: 31.5204, lng: 74.3587, tz: 'Asia/Karachi', method: 'Karachi' },
  { region: 'Asia', place: 'Delhi, India', lat: 28.6139, lng: 77.209, tz: 'Asia/Kolkata', method: 'Karachi' },
  { region: 'Asia', place: 'Dhaka, Bangladesh', lat: 23.8103, lng: 90.4125, tz: 'Asia/Dhaka', method: 'Karachi' },
  { region: 'Asia', place: 'Kuala Lumpur, Malaysia', lat: 3.139, lng: 101.6869, tz: 'Asia/Kuala_Lumpur', method: 'Singapore' },
  { region: 'Asia', place: 'Singapore', lat: 1.3521, lng: 103.8198, tz: 'Asia/Singapore', method: 'Singapore' },
  { region: 'Asia', place: 'Jakarta, Indonesia', lat: -6.2088, lng: 106.8456, tz: 'Asia/Jakarta', method: 'Singapore' },
  { region: 'Europe', place: 'London, United Kingdom', lat: 51.5072, lng: -0.1276, tz: 'Europe/London', method: 'MoonsightingCommittee' },
  { region: 'Europe', place: 'Birmingham, United Kingdom', lat: 52.4862, lng: -1.8904, tz: 'Europe/London', method: 'MoonsightingCommittee' },
  { region: 'Europe', place: 'Paris, France', lat: 48.8566, lng: 2.3522, tz: 'Europe/Paris', method: 'MuslimWorldLeague' },
  { region: 'Europe', place: 'Berlin, Germany', lat: 52.52, lng: 13.405, tz: 'Europe/Berlin', method: 'MuslimWorldLeague' },
  { region: 'Europe', place: 'Amsterdam, Netherlands', lat: 52.3676, lng: 4.9041, tz: 'Europe/Amsterdam', method: 'MuslimWorldLeague' },
  { region: 'Europe', place: 'Brussels, Belgium', lat: 50.8503, lng: 4.3517, tz: 'Europe/Brussels', method: 'MuslimWorldLeague' },
  { region: 'Europe', place: 'Stockholm, Sweden', lat: 59.3293, lng: 18.0686, tz: 'Europe/Stockholm', method: 'MuslimWorldLeague' },
  { region: 'Europe', place: 'Oslo, Norway', lat: 59.9139, lng: 10.7522, tz: 'Europe/Oslo', method: 'MuslimWorldLeague' },
  { region: 'Europe', place: 'Madrid, Spain', lat: 40.4168, lng: -3.7038, tz: 'Europe/Madrid', method: 'MuslimWorldLeague' },
  { region: 'Americas', place: 'New York, USA', lat: 40.7128, lng: -74.006, tz: 'America/New_York', method: 'NorthAmerica' },
  { region: 'Americas', place: 'Minneapolis, USA', lat: 44.9778, lng: -93.265, tz: 'America/Chicago', method: 'NorthAmerica' },
  { region: 'Americas', place: 'Chicago, USA', lat: 41.8781, lng: -87.6298, tz: 'America/Chicago', method: 'NorthAmerica' },
  { region: 'Americas', place: 'Houston, USA', lat: 29.7604, lng: -95.3698, tz: 'America/Chicago', method: 'NorthAmerica' },
  { region: 'Americas', place: 'Los Angeles, USA', lat: 34.0522, lng: -118.2437, tz: 'America/Los_Angeles', method: 'NorthAmerica' },
  { region: 'Americas', place: 'Toronto, Canada', lat: 43.6532, lng: -79.3832, tz: 'America/Toronto', method: 'NorthAmerica' },
  { region: 'Americas', place: 'São Paulo, Brazil', lat: -23.5505, lng: -46.6333, tz: 'America/Sao_Paulo', method: 'MuslimWorldLeague' },
  { region: 'Oceania', place: 'Sydney, Australia', lat: -33.8688, lng: 151.2093, tz: 'Australia/Sydney', method: 'MuslimWorldLeague' },
  { region: 'Oceania', place: 'Melbourne, Australia', lat: -37.8136, lng: 144.9631, tz: 'Australia/Melbourne', method: 'MuslimWorldLeague' },
];

const MAKKAH = CITIES.find(c => c.place.startsWith('Makkah'))!;

const fromCity = (c: City) => ({ place: c.place, lat: c.lat, lng: c.lng, tz: c.tz, method: c.method });

/** Server render and first paint: a neutral default. */
export const DEFAULT_SETTINGS: Settings = { name: '', ...fromCity(MAKKAH), madhab: 'shafi', hour24: false };

export function browserTz() {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch { return 'UTC'; }
}

export function validTz(tz: string) {
  try { new Intl.DateTimeFormat('en', { timeZone: tz }); return true; } catch { return false; }
}

/** First visit: guess the place from the device's time zone. */
function guess(): { settings: Settings; matched: boolean } {
  const tz = browserTz();
  const city = CITIES.find(c => c.tz === tz);
  return city ? { settings: { ...DEFAULT_SETTINGS, ...fromCity(city) }, matched: true } : { settings: DEFAULT_SETTINGS, matched: false };
}

/** Settings live in this browser only. Until the user picks a place, it is guessed from
 *  the device time zone and `guessed` is true so the UI can ask them to confirm. */
export function useSettings() {
  const [stored, save, ready] = useStored<Partial<Settings>>('nur.settings', {});
  const hydrated = useHydrated();

  const { settings, guessed } = useMemo(() => {
    if (!hydrated) return { settings: DEFAULT_SETTINGS, guessed: false };
    const g = guess();
    if (stored.place === undefined) return { settings: { ...g.settings, ...stored }, guessed: true };
    const merged = { ...DEFAULT_SETTINGS, ...stored };
    // Settings saved before time zones existed: recover the zone from the city, else the device.
    if (!stored.tz || !validTz(stored.tz)) merged.tz = CITIES.find(c => c.place === stored.place)?.tz ?? browserTz();
    return { settings: merged, guessed: false };
  }, [stored, hydrated]);

  const update = useCallback((patch: Partial<Settings>) => save(prev => ({ ...prev, ...patch })), [save]);
  const chooseCity = useCallback((c: City) => save(prev => ({ ...prev, ...fromCity(c) })), [save]);
  return { settings, update, chooseCity, ready, guessed };
}
