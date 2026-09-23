// The Nur app icon, drawn for next/og's ImageResponse (Satori): a dawn-gold crescent on the Isha sky.
// Used by the manifest icons, the Apple touch icon and notification icons.
// The crescent is a single SVG path (outer arc r=42, inner arc r=50), so nothing has to match the sky;
// it spans x 18–60, so the viewBox is shifted by 11 to centre it.
export function AppIconArt({ size, maskable = false }: { size: number; maskable?: boolean }) {
  const moon = Math.round(size * (maskable ? 0.5 : 0.64)); // maskable icons keep the art inside the safe zone
  return (
    <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #05130f 0%, #081d18 55%, #123c30 100%)' }}>
      <svg width={moon} height={moon} viewBox="-11 0 100 100">
        <path d="M60 8 A42 42 0 1 0 60 92 A50 50 0 0 1 60 8 Z" fill="#f0bd72" />
      </svg>
    </div>
  );
}
