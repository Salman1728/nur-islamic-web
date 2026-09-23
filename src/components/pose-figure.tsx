import type { Pose } from '@/lib/salah-sequence';

/** Minimal line figure for each prayer position — a guide, not a precise diagram. */
export function PoseFigure({ pose }: { pose: Pose }) {
  const turn = pose === 'turn-right' ? 1 : pose === 'turn-left' ? -1 : 0;
  const base = turn ? 'sit' : pose;
  return (
    <svg className="pose-figure" viewBox="0 0 120 120" role="img" aria-label={LABEL[pose]}>
      <line className="ground" x1="8" y1="113" x2="112" y2="113" />
      <g className="body">
        {base === 'stand' && <>
          <circle cx="60" cy="18" r="9" />
          <path d="M60 28 V74 M60 74 L52 112 M60 74 L68 112 M60 40 L52 52 L64 56 M60 40 L66 52 L56 56" />
        </>}
        {base === 'hands' && <>
          <circle cx="60" cy="22" r="9" />
          <path d="M60 32 V76 M60 76 L52 112 M60 76 L68 112 M60 42 L46 34 L44 18 M60 42 L74 34 L76 18" />
        </>}
        {base === 'bow' && <>
          <circle cx="98" cy="62" r="8" />
          <path d="M44 66 H89 M44 66 L44 112 M50 66 L50 112 M82 67 L62 84 L48 90" />
        </>}
        {base === 'prostrate' && <>
          <circle cx="92" cy="104" r="7" />
          <path d="M22 110 H42 L48 84 L84 100 M78 98 L86 112" />
        </>}
        {base === 'sit' && <>
          <circle cx={60 + turn * 6} cy="40" r="9" />
          <path d="M56 50 V92 M56 92 L86 108 M56 92 L44 110 H80 M56 60 L78 90" />
        </>}
      </g>
      {turn !== 0 && <path className="turn-arrow" d={turn > 0 ? 'M72 26 q12 4 14 16 m0 0 l-5 -3 m5 3 l2 -6' : 'M48 26 q-12 4 -14 16 m0 0 l5 -3 m-5 3 l-2 -6'} />}
    </svg>
  );
}

const LABEL: Record<Pose, string> = {
  stand: 'Standing', hands: 'Standing with hands raised', bow: 'Bowing', prostrate: 'Prostrating',
  sit: 'Sitting', 'turn-right': 'Sitting, turning the head right', 'turn-left': 'Sitting, turning the head left',
};
