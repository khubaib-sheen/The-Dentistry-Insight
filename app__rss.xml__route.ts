import { SECTIONS, getPublishedList } from "@/lib/sections";

const SITE_URL = "https://www.thedentistryinsight.com";
const SITE_NAME = "The Dentistry Insight";

function escapeXml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const [blogs, workshop] = await Promise.all([
    getPublishedList(SECTIONS.blogs, 30),
    getPublishedList(SECTIONS.workshop, 20),
  ]);

  const items = [
    ...blogs.map((item) => ({ item, section: SECTIONS.blogs })),
    ...workshop.map((item) => ({ item, section: SECTIONS.workshop })),
  ]
    .filter((x) => x.item.createdAt)
    .sort(
      (a, b) =>
        new Date(b.item.createdAt!).getTime() -
        new Date(a.item.createdAt!).getTime()
    )
    .slice(0, 40);

  const rssItems = items
    .map(({ item, section }) => {
      const url = `${SITE_URL}/${section.folder}/${item.slug}/`;
      return `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(item.createdAt!).toUTCString()}</pubDate>
      <description>${escapeXml(item.summary || "")}</description>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>Dental blogs and workshop posts from ${SITE_NAME}</description>
    <language>en</language>${rssItems}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
