'use client';
import { useCallback, useMemo } from 'react';
import { JOURNEY, isDone, type JourneyCtx } from './journey';
import { useSettings } from './settings';
import { useStored, type TrackerLog } from './store';

const NO_PRACTICE = { count: 0, prayers: [] as string[] };

export function useJourney() {
  const [lessons] = useStored<string[]>('nur.lessons', []);
  const [tracker] = useStored<TrackerLog>('nur.tracker', {});
  const [savedDuas] = useStored<string[]>('nur.duas.saved', []);
  const [visited] = useStored<string[]>('nur.visited', []);
  const [practice] = useStored('nur.practice', NO_PRACTICE);
  const [manual, setManual, ready] = useStored<number[]>('nur.journey.manual', []);
  const { guessed } = useSettings();

  const ctx: JourneyCtx = useMemo(
    () => ({ lessons, tracker, savedDuas, visited, practice, located: !guessed }),
    [lessons, tracker, savedDuas, visited, practice, guessed],
  );
  const steps = useMemo(() => JOURNEY.map(s => ({ ...s, done: isDone(s, ctx, manual), manual: manual.includes(s.day) })), [ctx, manual]);
  const doneCount = steps.filter(s => s.done).length;
  const current = steps.find(s => !s.done) ?? null;

  const toggleManual = useCallback((day: number) => setManual(m => (m.includes(day) ? m.filter(d => d !== day) : [...m, day])), [setManual]);

  return { steps, doneCount, current, toggleManual, ready };
}
