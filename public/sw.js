// Nur service worker. Deliberately tiny: it lets Nur be installed as an app and shows
// prayer reminders (Android only allows notifications through a service worker).
// No offline caching — pages always come fresh from the network.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

// Tapping a reminder opens (or focuses) Nur on the prayer times page.
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = new URL('/prayer', self.location.origin).href;
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const w of windows) {
      if ('focus' in w) {
        if ('navigate' in w && !w.url.startsWith(url)) await w.navigate(url);
        return w.focus();
      }
    }
    return self.clients.openWindow(url);
  })());
});
