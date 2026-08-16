import type { MetadataRoute } from "next";

const BASE = "https://criska.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep the admin/ATS portal, candidate share links and API out of search.
        disallow: ["/admin", "/api", "/share"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
