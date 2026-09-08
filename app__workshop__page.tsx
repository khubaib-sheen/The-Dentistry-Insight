import { SECTIONS, getPublishedList } from "@/lib/sections";
import { buildHubMetadata } from "@/lib/seo";
import SectionHub from "@/components/SectionHub";

export const revalidate = 300;

const section = SECTIONS.workshop;

export const metadata = buildHubMetadata(
  section,
  "Community discussions, case notes, and workshop posts from practicing dentists."
);

export default async function Page() {
  const items = await getPublishedList(section);
  return (
    <SectionHub
      title={section.label}
      intro="Community discussions, case notes, and workshop posts from practicing dentists."
      badge={section.badge}
      folder={section.folder}
      items={items}
    />
  );
}
