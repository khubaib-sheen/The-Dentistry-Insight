import { SECTIONS, getPublishedList } from "@/lib/sections";
import { buildHubMetadata } from "@/lib/seo";
import SectionHub from "@/components/SectionHub";

export const revalidate = 300;

const section = SECTIONS.students;

export const metadata = buildHubMetadata(
  section,
  "Study resources and guidance for dental students, organized by subject."
);

export default async function Page() {
  const items = await getPublishedList(section);
  return (
    <SectionHub
      title={section.label}
      intro="Study resources and guidance for dental students, organized by subject."
      badge={section.badge}
      folder={section.folder}
      items={items}
    />
  );
}
