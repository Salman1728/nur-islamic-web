/** Sun-position marker: an arc of the day with a dot where the sun sits at this prayer. */
export function PrayerMark({ t, label, moon = false, light = false }: { t: number; label: string; moon?: boolean; light?: boolean }) {
  const c = Math.min(1, Math.max(0, t));
  const x = 60 - 52 * Math.cos(Math.PI * c);
  const y = 42 - 34 * Math.sin(Math.PI * c);
  return (
    <div className={`prayer-mark${light ? ' light' : ''}`}>
      <svg viewBox="0 0 120 48" aria-hidden="true">
        <line className="horizon" x1="0" y1="42" x2="120" y2="42" />
        <path className="arc" d="M 8 42 A 52 34 0 0 1 112 42" fill="none" />
        {moon
          ? <text className="moon" x={x} y={y + 4} textAnchor="middle">☾</text>
          : <circle className="sun" cx={x} cy={y} r="4.5" />}
      </svg>
      <span>{label}</span>
    </div>
  );
}
