import { SECTIONS, getPublishedList } from "@/lib/sections";
import { buildHubMetadata } from "@/lib/seo";
import SectionHub from "@/components/SectionHub";

export const revalidate = 300;

const section = SECTIONS.blogs;

export const metadata = buildHubMetadata(
  section,
  "Articles and insights for dental professionals, written by the community."
);

export default async function Page() {
  const items = await getPublishedList(section);
  return (
    <SectionHub
      title={section.label}
      intro="Articles and insights for dental professionals, written by the community."
      badge={section.badge}
      folder={section.folder}
      items={items}
    />
  );
}
