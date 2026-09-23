'use client';
import { useCallback, useRef, useSyncExternalStore } from 'react';

// localStorage as an external store. The server snapshot is always the default, so the first
// client render matches the server HTML; React then re-renders with the stored value.

const EVENT = 'nur:store';
const cache = new Map<string, { raw: string | null; value: unknown }>();

function readKey<T>(key: string, fallback: T): T {
  let raw: string | null = null;
  try { raw = localStorage.getItem(key); } catch { /* storage blocked */ }
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value as T;
  let value: T = fallback;
  if (raw !== null) { try { value = JSON.parse(raw) as T; } catch { /* corrupt: use fallback */ } }
  cache.set(key, { raw, value });
  return value;
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener('storage', cb);
  return () => { window.removeEventListener(EVENT, cb); window.removeEventListener('storage', cb); };
}

const noop = () => () => {};

/** True once running in the browser (after hydration). */
export function useHydrated() {
  return useSyncExternalStore(noop, () => true, () => false);
}

export function useStored<T>(key: string, initial: T) {
  const fallback = useRef(initial).current;
  const value = useSyncExternalStore(subscribe, () => readKey(key, fallback), () => fallback);
  const ready = useHydrated();

  const save = useCallback((next: T | ((prev: T) => T)) => {
    const prev = readKey(key, fallback);
    const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
    try { localStorage.setItem(key, JSON.stringify(resolved)); } catch { /* private mode */ }
    cache.set(key, { raw: JSON.stringify(resolved), value: resolved });
    window.dispatchEvent(new Event(EVENT));
  }, [key, fallback]);

  return [value, save, ready] as const;
}

export type TrackerLog = Record<string, string[]>; // 'YYYY-MM-DD' -> prayers marked prayed

export function dayKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Consecutive days (ending today, or yesterday if today isn't complete yet) with all five prayers logged. */
export function streak(log: TrackerLog, today: Date) {
  const d = new Date(today);
  if ((log[dayKey(d)]?.length ?? 0) < 5) d.setDate(d.getDate() - 1);
  let n = 0;
  while ((log[dayKey(d)]?.length ?? 0) >= 5) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
