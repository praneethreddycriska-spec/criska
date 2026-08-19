import type { MetadataRoute } from "next";
import { site } from "@/content/site";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://criska.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routeConfig: { path: string; priority: number; changeFreq: "daily" | "weekly" | "monthly" }[] = [
    { path: "", priority: 1.0, changeFreq: "daily" },
    { path: "/services", priority: 0.9, changeFreq: "weekly" },
    { path: "/careers", priority: 0.9, changeFreq: "daily" },
    { path: "/industries", priority: 0.8, changeFreq: "weekly" },
    { path: "/contact", priority: 0.8, changeFreq: "monthly" },
    { path: "/leadership", priority: 0.7, changeFreq: "monthly" },
    { path: "/events", priority: 0.7, changeFreq: "weekly" },
    { path: "/case-studies", priority: 0.7, changeFreq: "monthly" },
    { path: "/blog", priority: 0.7, changeFreq: "weekly" },
    { path: "/quality", priority: 0.6, changeFreq: "monthly" },
    { path: "/faq", priority: 0.6, changeFreq: "monthly" },
  ];

  const staticEntries: MetadataRoute.Sitemap = routeConfig.map((item) => ({
    url: `${BASE}${item.path}`,
    lastModified: now,
    changeFrequency: item.changeFreq,
    priority: item.priority,
  }));

  const blogEntries: MetadataRoute.Sitemap = (site.blog?.featured ?? []).map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...blogEntries];
}
