import { notFound } from "next/navigation";
import { SECTIONS, type SectionKey } from "@/lib/sections";
import RecordForm from "@/components/admin/RecordForm";

export default async function NewRecordPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: key } = await params;
  const section = SECTIONS[key as SectionKey];
  if (!section) notFound();

  return (
    <div>
      <h1 className="text-xl font-black text-slate-900 mb-6">
        New {section.singular}
      </h1>
      <RecordForm section={section.key} />
    </div>
  );
}
