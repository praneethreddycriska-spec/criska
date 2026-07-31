import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack workspace root is inferred correctly on Vercel (single lockfile).
  // The stray parent lockfile only exists on this local machine.
};

export default nextConfig;
