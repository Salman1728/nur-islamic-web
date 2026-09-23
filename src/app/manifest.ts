import type { MetadataRoute } from 'next';

// Makes Nur installable ("Add to Home Screen" / "Install app"), opening straight to the dashboard.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nur — Your Islamic Companion',
    short_name: 'Nur',
    description: 'Prayer times, Qur’an, duas and gentle lessons — for Muslims at every stage.',
    start_url: '/dashboard',
    scope: '/',
    display: 'standalone',
    background_color: '#fbf7ee',
    theme_color: '#081d18',
    icons: [
      { src: '/app-icon/192', sizes: '192x192', type: 'image/png' },
      { src: '/app-icon/512', sizes: '512x512', type: 'image/png' },
      { src: '/app-icon/maskable-512', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
