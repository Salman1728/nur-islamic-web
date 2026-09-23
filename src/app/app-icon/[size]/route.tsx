import { ImageResponse } from 'next/og';
import { AppIconArt } from '@/components/app-icon-art';

// PNG app icons for the web manifest and notifications, generated once at build time.
// /app-icon/192, /app-icon/512, /app-icon/maskable-512
const SIZES: Record<string, { px: number; maskable: boolean }> = {
  '192': { px: 192, maskable: false },
  '512': { px: 512, maskable: false },
  'maskable-512': { px: 512, maskable: true },
};

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(SIZES).map(size => ({ size }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ size: string }> }) {
  const spec = SIZES[(await params).size];
  if (!spec) return new Response('Not found', { status: 404 });
  return new ImageResponse(<AppIconArt size={spec.px} maskable={spec.maskable} />, { width: spec.px, height: spec.px });
}
