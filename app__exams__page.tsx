import { SECTIONS, getPublishedList } from "@/lib/sections";
import { buildHubMetadata } from "@/lib/seo";
import SectionHub from "@/components/SectionHub";

export const revalidate = 300;

const section = SECTIONS.exams;

export const metadata = buildHubMetadata(
  section,
  "Licensing exam guides, dates, and preparation resources for dentists worldwide."
);

export default async function Page() {
  const items = await getPublishedList(section);
  return (
    <SectionHub
      title={section.label}
      intro="Licensing exam guides, dates, and preparation resources for dentists worldwide."
      badge={section.badge}
      folder={section.folder}
      items={items}
    />
  );
}
