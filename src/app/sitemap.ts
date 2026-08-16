import type { MetadataRoute } from "next";
import { site } from "@/content/site";

const BASE = "https://criska.in";

/** Public, indexable routes. Admin, share and API surfaces are excluded (see robots.ts). */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    "",
    "/services",
    "/industries",
    "/case-studies",
    "/blog",
    "/careers",
    "/leadership",
    "/events",
    "/faq",
    "/quality",
    "/contact",
  ];

  const staticEntries: MetadataRoute.Sitemap = routes.map((r) => ({
    url: `${BASE}${r}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: r === "" ? 1 : 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = (site.blog?.featured ?? []).map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...blogEntries];
}
