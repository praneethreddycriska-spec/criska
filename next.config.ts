import path from "path";
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Content-Security-Policy — allowlists exactly the third parties this site uses:
// Google Sign-In (accounts.google.com / gstatic), the Google Maps embed on the
// contact page, Fontshare fonts, Supabase (data API) and Upstash. Everything
// else is blocked. `unsafe-eval` is dev-only (needed for HMR).
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://accounts.google.com https://apis.google.com https://www.gstatic.com https://maps.google.com https://www.google.com`,
  "style-src 'self' 'unsafe-inline' https://api.fontshare.com https://fonts.googleapis.com https://accounts.google.com",
  "font-src 'self' https://cdn.fontshare.com https://api.fontshare.com data:",
  "img-src 'self' data: blob: https:",
  `connect-src 'self' https://*.supabase.co https://accounts.google.com https://*.upstash.io${isDev ? " ws: http://localhost:*" : ""}`,
  "frame-src https://accounts.google.com https://maps.google.com https://www.google.com",
].join("; ");

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // 301-redirect the OLD criska.in site's .html URLs (still in Google's index)
  // to their matching pages on the new site, so their SEO value transfers and
  // Google replaces the stale results. Specific mappings first; any other
  // legacy .html page falls back to the home page.
  async redirects() {
    return [
      { source: "/about.html", destination: "/", permanent: true },
      { source: "/company.html", destination: "/", permanent: true },
      { source: "/careers.html", destination: "/careers", permanent: true },
      { source: "/services.html", destination: "/services", permanent: true },
      { source: "/contact.html", destination: "/contact", permanent: true },
      { source: "/soft-pro-dev.html", destination: "/services", permanent: true },
      { source: "/mobile-learning.html", destination: "/services", permanent: true },
      { source: "/cotract_staffing_sol.html", destination: "/services", permanent: true },
      { source: "/contract_staffing_sol.html", destination: "/services", permanent: true },
      { source: "/permanent_hiring_sol.html", destination: "/services", permanent: true },
      { source: "/pro-man.html", destination: "/services", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: csp,
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            // "allow-popups" keeps cross-origin isolation while permitting the
            // Google Sign-In popup to communicate back to the opener.
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
      {
        // Never index or cache the admin surface or its APIs.
        source: "/(admin|api/admin)/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },
};

export default nextConfig;

