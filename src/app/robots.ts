import type { MetadataRoute } from "next";

const BASE = "https://criska.org";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Exclude admin dashboard, internal API endpoints, and private share tokens from search indexing.
        disallow: ["/admin", "/api", "/share"],
      },
      {
        // Generative Engine Optimization (GEO) — Explicitly allow AI search crawlers to index public pages.
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "Google-Extended",
          "Applebot-Extended",
          "ByteSpider",
        ],
        allow: "/",
        disallow: ["/admin", "/api", "/share"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
