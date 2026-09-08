import { notFound } from "next/navigation";
import { SECTIONS, type SectionKey } from "@/lib/sections";
import { getSupabaseSessionClient } from "@/lib/supabase-session";
import RecordForm from "@/components/admin/RecordForm";

export default async function EditRecordPage({
  params,
}: {
  params: Promise<{ section: string; id: string }>;
}) {
  const { section: key, id } = await params;
  const section = SECTIONS[key as SectionKey];
  if (!section) notFound();

  const supabase = await getSupabaseSessionClient();
  const { data: record, error } = await supabase
    .from(section.table)
    .select("*")
    .eq("id", id)
    .single();

  if (error || !record) notFound();

  return (
    <div>
      <h1 className="text-xl font-black text-slate-900 mb-6">
        Edit {section.singular}
      </h1>
      <RecordForm section={section.key} record={record} />
    </div>
  );
}
