import path from "node:path";
import type { NextConfig } from "next";

// Old placeholder URLs (July 2026) → the real pages, so shared links keep working.
const QURAN_SLUGS: Record<string, number> = {
  "al-fatiha": 1, "ash-sharh": 94, "al-asr": 103, "al-ikhlas": 112, "al-falaq": 113, "an-nas": 114,
};

const nextConfig: NextConfig = {
  // A stray package-lock.json in the home folder makes Next guess the wrong workspace root.
  turbopack: { root: path.join(__dirname) },
  async redirects() {
    return [
      { source: "/prayer-times", destination: "/prayer", permanent: true },
      { source: "/learn-islam", destination: "/learn", permanent: true },
      ...Object.entries(QURAN_SLUGS).map(([slug, n]) => ({ source: `/quran/${slug}`, destination: `/quran/${n}`, permanent: true })),
    ];
  },
};

export default nextConfig;
