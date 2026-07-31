import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the workspace root to this project (a stray lockfile lives higher up).
    root: path.join(__dirname),
  },
};

export default nextConfig;
