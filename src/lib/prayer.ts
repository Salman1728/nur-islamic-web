'use client';
import { useCallback, useSyncExternalStore } from 'react';

export * from './prayer-core';

// One shared clock per interval. Server snapshot is null so server and first client render match.
type Clock = { now: Date | null; subs: Set<() => void>; id?: ReturnType<typeof setInterval> };
const clocks = new Map<number, Clock>();

function clock(ms: number): Clock {
  let c = clocks.get(ms);
  if (!c) { c = { now: null, subs: new Set() }; clocks.set(ms, c); }
  return c;
}

function subscribeClock(ms: number, cb: () => void) {
  const c = clock(ms);
  c.subs.add(cb);
  if (!c.id) {
    c.now = new Date();
    c.id = setInterval(() => { c.now = new Date(); c.subs.forEach(f => f()); }, ms);
  }
  return () => {
    c.subs.delete(cb);
    if (!c.subs.size && c.id) { clearInterval(c.id); c.id = undefined; }
  };
}

function readClock(ms: number) {
  const c = clock(ms);
  if (!c.now) c.now = new Date();
  return c.now;
}

/** Current time, ticking every `ms`. Null during server render and hydration. */
export function useNow(ms = 1000) {
  const subscribe = useCallback((cb: () => void) => subscribeClock(ms, cb), [ms]);
  return useSyncExternalStore(subscribe, () => readClock(ms), () => null);
}
