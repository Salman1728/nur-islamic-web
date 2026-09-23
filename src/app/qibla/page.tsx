'use client';
import { useEffect, useRef, useState } from 'react';
import { Compass, LocateFixed, Map } from 'lucide-react';
import { ContentPage } from '@/components/content-page';
import { useSettings } from '@/lib/settings';
import { qiblaBearing } from '@/lib/prayer';
import { useLocate } from '@/lib/locate';

const KAABA = { lat: 21.4225, lng: 39.8262 };

type OrientationEventIOS = DeviceOrientationEvent & { webkitCompassHeading?: number };
type OrientationCtor = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<'granted' | 'denied'> };

function distanceKm(lat: number, lng: number) {
  const r = (d: number) => (d * Math.PI) / 180;
  const a = Math.sin(r(KAABA.lat - lat) / 2) ** 2 + Math.cos(r(lat)) * Math.cos(r(KAABA.lat)) * Math.sin(r(KAABA.lng - lng) / 2) ** 2;
  return Math.round(6371 * 2 * Math.asin(Math.sqrt(a)));
}

const compassPoint = (deg: number) => ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(deg / 45) % 8];

export default function Qibla() {
  const { settings, ready } = useSettings();
  const { locate, busy, error } = useLocate();
  const [heading, setHeading] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const bearing = qiblaBearing(settings);

  const handler = useRef<((e: Event) => void) | null>(null);
  useEffect(() => () => {
    if (!handler.current) return;
    window.removeEventListener('deviceorientationabsolute', handler.current);
    window.removeEventListener('deviceorientation', handler.current);
  }, []);

  const enableCompass = async () => {
    const Ctor = (typeof DeviceOrientationEvent !== 'undefined' ? DeviceOrientationEvent : undefined) as OrientationCtor | undefined;
    if (!Ctor) { setStatus('This device has no compass. Use the bearing above, or the Google Qibla map.'); return; }
    try {
      if (typeof Ctor.requestPermission === 'function') {
        const res = await Ctor.requestPermission(); // iOS: must be called from this tap
        if (res !== 'granted') { setStatus('Compass permission was denied.'); return; }
      }
    } catch { setStatus('Compass permission could not be requested.'); return; }

    let got = false;
    const onTurn = (e: Event) => {
      const ev = e as OrientationEventIOS;
      const h = ev.webkitCompassHeading ?? (ev.absolute && ev.alpha !== null ? 360 - ev.alpha : null);
      if (h === null || h === undefined) return;
      got = true;
      setHeading(h);
    };
    if (handler.current) return;
    handler.current = onTurn;
    window.addEventListener('deviceorientationabsolute', onTurn);
    window.addEventListener('deviceorientation', onTurn);
    setStatus('Hold your device flat, away from metal and magnets.');
    setTimeout(() => { if (!got) setStatus('No compass readings arrived. On a laptop, use the bearing above or the map.'); }, 2500);
  };

  // The dial rotates so north points north; the needle then points to the Qibla.
  const dial = heading === null ? 0 : -heading;
  const facing = heading !== null && Math.abs(((bearing - heading + 540) % 360) - 180) < 5;

  return (
    <ContentPage eyebrow="Direction of prayer" title="Qibla Finder" description="The direction of the Kaaba in Makkah from where you are. Calculated in your browser — your location is never sent anywhere.">
      <div className="qibla-wrap card">
        <div className={`qibla-compass ${facing ? 'facing' : ''}`}>
          <div className="dial" style={{ transform: `rotate(${dial}deg)` }}>
            <span className="north">N</span><span className="east">E</span><span className="south">S</span><span className="west">W</span>
            <div className="needle" style={{ transform: `rotate(${bearing}deg)` }}><i /><b aria-hidden="true">🕋</b></div>
          </div>
          <div className="hub" />
        </div>
        <h2>{ready ? `${Math.round(bearing)}° ${compassPoint(bearing)}` : ' '}</h2>
        <p>{ready ? `From ${settings.place}, face ${Math.round(bearing)}° clockwise from true north · ${distanceKm(settings.lat, settings.lng).toLocaleString()} km to the Kaaba.` : ' '}</p>
        {facing && <p className="facing-note">You are facing the Qibla.</p>}
        <div className="inline-actions center">
          <button onClick={enableCompass}><Compass size={17} /> {heading === null ? 'Use device compass' : `Heading ${Math.round(heading)}°`}</button>
          <button onClick={locate} disabled={busy}><LocateFixed size={17} /> {busy ? 'Locating…' : 'Use my location'}</button>
          <a href="https://qiblafinder.withgoogle.com/" target="_blank" rel="noreferrer"><Map size={17} /> Google Qibla map</a>
        </div>
        {(status || error) && <p className="muted-text">{error ?? status}</p>}
      </div>
    </ContentPage>
  );
}
