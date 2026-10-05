import type { MetadataRoute } from "next";
import { getStore } from "@/lib/catalog";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/store`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/rules`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  try {
    const store = await getStore();
    for (const p of store.categories.flatMap((c) => c.packages)) {
      pages.push({
        url: `${SITE_URL}/store/${p.id}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : now,
        changeFrequency: "weekly",
        priority: 0.8,
        ...(p.art ? { images: [p.art.startsWith("/") ? `${SITE_URL}${p.art}` : p.art] } : {}),
      });
    }
  } catch {
    // Store unreachable: still serve the static pages.
  }
  return pages;
}
