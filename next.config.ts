import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16 uses Turbopack by default.
  // pdfjs-dist is only used client-side, so no canvas alias needed.
  turbopack: {},
};

export default nextConfig;
