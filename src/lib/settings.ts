'use client';
import { useCallback, useMemo } from 'react';
import { useStored } from './store';

export type Method = 'MuslimWorldLeague' | 'Egyptian' | 'Karachi' | 'UmmAlQura' | 'NorthAmerica' | 'Dubai' | 'Qatar' | 'Singapore' | 'Turkey' | 'MoonsightingCommittee';
export type Madhab = 'shafi' | 'hanafi';

export type Settings = {
  name: string;
  place: string;
  lat: number;
  lng: number;
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
  ['Singapore', 'Singapore'],
  ['Turkey', 'Diyanet (Turkey)'],
  ['MoonsightingCommittee', 'Moonsighting Committee'],
];

export const CITIES: { place: string; lat: number; lng: number }[] = [
  { place: 'Nairobi, Kenya', lat: -1.2921, lng: 36.8219 },
  { place: 'Mombasa, Kenya', lat: -4.0435, lng: 39.6682 },
  { place: 'Mogadishu, Somalia', lat: 2.0469, lng: 45.3182 },
  { place: 'Dar es Salaam, Tanzania', lat: -6.7924, lng: 39.2083 },
  { place: 'Kampala, Uganda', lat: 0.3476, lng: 32.5825 },
  { place: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357 },
  { place: 'Makkah, Saudi Arabia', lat: 21.3891, lng: 39.8579 },
  { place: 'Dubai, UAE', lat: 25.2048, lng: 55.2708 },
  { place: 'Istanbul, Türkiye', lat: 41.0082, lng: 28.9784 },
  { place: 'London, United Kingdom', lat: 51.5072, lng: -0.1276 },
  { place: 'New York, USA', lat: 40.7128, lng: -74.006 },
  { place: 'Kuala Lumpur, Malaysia', lat: 3.139, lng: 101.6869 },
  { place: 'Jakarta, Indonesia', lat: -6.2088, lng: 106.8456 },
];

export const DEFAULT_SETTINGS: Settings = {
  name: '',
  place: CITIES[0].place,
  lat: CITIES[0].lat,
  lng: CITIES[0].lng,
  method: 'MuslimWorldLeague',
  madhab: 'shafi',
  hour24: false,
};

/** Settings live in this browser only. ready is false until the browser has been read,
 *  so the first render matches the server and nothing flashes a wrong value. */
export function useSettings() {
  const [stored, save, ready] = useStored<Partial<Settings>>('nur.settings', {});
  const settings = useMemo(() => ({ ...DEFAULT_SETTINGS, ...stored }), [stored]);
  const update = useCallback((patch: Partial<Settings>) => save(prev => ({ ...prev, ...patch })), [save]);
  return { settings, update, ready };
}
