'use client';
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { Bell, BellOff, CalendarPlus, Check, Copy, Download, Smartphone } from 'lucide-react';
import { useSettings } from '@/lib/settings';
import { PRAYERS } from '@/lib/prayer';
import { BEFORE_OPTIONS, notificationsSupported, showNotification, useReminders } from '@/lib/reminders';

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

const noop = () => () => {};
function usePermission() {
  const [perm, setPerm] = useState<NotificationPermission | 'unsupported' | null>(null);
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const current = hydrated ? (notificationsSupported() ? Notification.permission : 'unsupported') : null;
  return [perm ?? current, setPerm] as const;
}

function useInstall() {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [installed, setInstalled] = useState(false);
  useEffect(() => {
    const onPrompt = (e: Event) => { e.preventDefault(); setPrompt(e as InstallPrompt); };
    const onInstalled = () => { setInstalled(true); setPrompt(null); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => { window.removeEventListener('beforeinstallprompt', onPrompt); window.removeEventListener('appinstalled', onInstalled); };
  }, []);
  const env = useSyncExternalStore(noop, () => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
    return standalone ? 'standalone' : ios ? 'ios' : 'other';
  }, () => 'other');
  return { prompt, installed: installed || env === 'standalone', ios: env === 'ios' };
}

export function ReminderPanel() {
  const { settings, ready } = useSettings();
  const [r, setR] = useReminders();
  const [perm, setPerm] = usePermission();
  const [copied, setCopied] = useState(false);
  const [tested, setTested] = useState<string | null>(null);
  const install = useInstall();

  const links = useMemo(() => {
    if (!ready) return null;
    const q = new URLSearchParams({
      lat: settings.lat.toFixed(4), lng: settings.lng.toFixed(4), tz: settings.tz, method: settings.method,
      madhab: settings.madhab, before: String(r.before), place: settings.place.split(' (')[0],
    });
    const https = `${window.location.origin}/api/prayer-calendar?${q}`;
    const webcal = https.replace(/^https?:/, 'webcal:');
    return {
      https, webcal,
      google: `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcal)}`,
      outlook: `https://outlook.live.com/calendar/0/addfromweb?url=${encodeURIComponent(https)}&name=${encodeURIComponent(`Prayer times — ${settings.place.split(' (')[0]}`)}`,
      download: `${https}&download=1`,
    };
  }, [ready, settings, r.before]);

  const enable = async () => {
    if (!notificationsSupported()) return;
    const p = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission();
    setPerm(p);
    if (p === 'granted') setR(x => ({ ...x, enabled: true }));
  };

  const test = async () => {
    const ok = await showNotification('Nur reminders are on', `You’ll be reminded ${r.before ? `${r.before} minutes before` : 'at'} each prayer while Nur is open.`, 'nur-test');
    setTested(ok ? 'Sent — check your notifications.' : 'Your browser blocked it. Check its notification settings for this site.');
  };

  const copy = async () => {
    if (!links) return;
    try { await navigator.clipboard.writeText(links.https); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* blocked */ }
  };

  return (
    <section className="card padded reminder-card" id="reminders">
      <div className="card-title"><h3><Bell size={17} /> Prayer reminders</h3></div>

      <div className="reminder-field">
        <label htmlFor="before">Remind me</label>
        <select id="before" className="field" value={r.before} onChange={e => setR(x => ({ ...x, before: Number(e.target.value) }))}>
          {BEFORE_OPTIONS.map(m => <option key={m} value={m}>{m === 0 ? 'Only at prayer time' : `${m} minutes before, and at prayer time`}</option>)}
        </select>
      </div>

      <div className="reminder-block">
        <h4><CalendarPlus size={16} /> Add to your phone’s calendar <span className="chip">Works when Nur is closed</span></h4>
        <p className="muted-text">Your calendar app subscribes to the next 60 days of prayer times for {settings.place.split(' (')[0]} and alerts you itself. It refreshes daily. If you move, add it again from the new place.</p>
        <div className="inline-actions">
          <a href={links?.webcal ?? '#'} aria-disabled={!links}>iPhone / Mac calendar</a>
          <a href={links?.google ?? '#'} target="_blank" rel="noreferrer" aria-disabled={!links}>Google Calendar (Android)</a>
          <a href={links?.outlook ?? '#'} target="_blank" rel="noreferrer" aria-disabled={!links}>Outlook</a>
          <a href={links?.download ?? '#'} aria-disabled={!links}><Download size={15} /> Download .ics</a>
          <button onClick={copy} disabled={!links}>{copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copied' : 'Copy link'}</button>
        </div>
        <p className="fine-print tight">Google Calendar: on Android, open the link once in a browser to subscribe; the phone app then shows the alerts. Only the location and options in the link reach Nur’s server to calculate the times — nothing is stored.</p>
      </div>

      <div className="reminder-block">
        <h4><Bell size={16} /> Notifications from Nur <span className="chip muted">While Nur is open</span></h4>
        {perm === 'unsupported' ? (
          <p className="muted-text">This browser can’t show notifications. Use the calendar option above.</p>
        ) : perm === 'denied' ? (
          <p className="muted-text"><BellOff size={14} /> Notifications are blocked for this site. Allow them in your browser’s site settings, then come back.</p>
        ) : (
          <>
            <label className="toggle-row">
              <input type="checkbox" className="switch" checked={r.enabled && perm === 'granted'} onChange={e => (e.target.checked ? void enable() : setR(x => ({ ...x, enabled: false })))} />
              <span>{r.enabled && perm === 'granted' ? 'On — reminders appear while a Nur tab or the Nur app is open.' : 'Turn on notifications'}</span>
            </label>
            {r.enabled && perm === 'granted' && (
              <>
                <div className="chip-toggles" role="group" aria-label="Which prayers">
                  {PRAYERS.map(p => {
                    const on = r.prayers.includes(p);
                    return <button key={p} className={on ? 'on' : ''} aria-pressed={on} onClick={() => setR(x => ({ ...x, prayers: on ? x.prayers.filter(y => y !== p) : [...x.prayers, p] }))}>{p}</button>;
                  })}
                </div>
                <button className="text-button" onClick={test}>Send a test notification</button>
                {tested && <p className="muted-text">{tested}</p>}
              </>
            )}
          </>
        )}
      </div>

      {!install.installed && (install.prompt || install.ios) && (
        <div className="reminder-block">
          <h4><Smartphone size={16} /> Install Nur as an app</h4>
          {install.prompt ? (
            <>
              <p className="muted-text">Opens from your home screen in its own window — the easiest way to keep Nur open for reminders.</p>
              <button className="field-button" onClick={async () => { await install.prompt!.prompt(); }}>Install Nur</button>
            </>
          ) : (
            <p className="muted-text">On iPhone or iPad: tap the Share button in Safari, then “Add to Home Screen”. Nur then opens like an app.</p>
          )}
        </div>
      )}
    </section>
  );
}
