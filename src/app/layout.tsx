import type { Metadata } from 'next';
import { Marcellus, Mulish, Amiri } from 'next/font/google';
import './globals.css';

const marcellus = Marcellus({ weight: '400', subsets: ['latin'], variable: '--font-display' });
const mulish = Mulish({ subsets: ['latin'], variable: '--font-body' });
const amiri = Amiri({ weight: ['400', '700'], subsets: ['arabic', 'latin'], variable: '--font-arabic' });

export const metadata: Metadata = {
  title: 'Nur — Your Islamic Companion',
  description: 'A simple Islamic web companion for prayer, learning, Qur’an, duas and new Muslims.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${marcellus.variable} ${mulish.variable} ${amiri.variable}`}>
      <body>{children}</body>
    </html>
  );
}
