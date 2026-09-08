import { SECTIONS, getPublishedList } from "@/lib/sections";
import { buildHubMetadata } from "@/lib/seo";
import SectionHub from "@/components/SectionHub";

export const revalidate = 300;

const section = SECTIONS.market;

export const metadata = buildHubMetadata(
  section,
  "Buy, sell, and trade dental equipment and supplies within the community."
);

export default async function Page() {
  const items = await getPublishedList(section);
  return (
    <SectionHub
      title={section.label}
      intro="Buy, sell, and trade dental equipment and supplies within the community."
      badge={section.badge}
      folder={section.folder}
      items={items}
    />
  );
}
