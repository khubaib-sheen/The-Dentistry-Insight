import type { MetadataRoute } from "next";
import { SECTIONS, getPublishedList, isThinContent } from "@/lib/sections";

const SITE_URL = "https://www.thedentistryinsight.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/about/`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact/`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/privacy-policy/`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms/`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const sectionEntries = await Promise.all(
    Object.values(SECTIONS).map(async (section) => {
      const items = await getPublishedList(section);

      const hubEntry: MetadataRoute.Sitemap[number] = {
        url: `${SITE_URL}/${section.folder}/`,
        changeFrequency: "daily",
        priority: 0.8,
      };

      // Excludes thin-content pages from the sitemap (they stay reachable
      // to visitors via the hub grid, just not submitted for indexing) —
      // mirrors the noindex threshold in scripts/prerender.js.
      const detailEntries: MetadataRoute.Sitemap = items
        .filter((item) => !item.noindexOverride && !isThinContent(item, section))
        .map((item) => ({
          url: `${SITE_URL}/${section.folder}/${item.slug}/`,
          lastModified: item.updatedAt || item.createdAt || undefined,
          changeFrequency: "weekly",
          priority: 0.6,
        }));

      return [hubEntry, ...detailEntries];
    })
  );

  return [...staticEntries, ...sectionEntries.flat()];
}
