import { SECTIONS, getPublishedList } from "@/lib/sections";
import { buildHubMetadata } from "@/lib/seo";
import SectionHub from "@/components/SectionHub";

export const revalidate = 300;

const section = SECTIONS.jobs;

export const metadata = buildHubMetadata(
  section,
  "Verified dental job openings from clinics and hospitals across Pakistan and beyond."
);

export default async function Page() {
  const items = await getPublishedList(section);
  return (
    <SectionHub
      title={section.label}
      intro="Verified dental job openings from clinics and hospitals across Pakistan and beyond."
      badge={section.badge}
      folder={section.folder}
      items={items}
    />
  );
}
