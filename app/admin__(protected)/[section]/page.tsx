import Link from "next/link";
import { notFound } from "next/navigation";
import { SECTIONS, type SectionKey } from "@/lib/sections";
import { getSupabaseSessionClient } from "@/lib/supabase-session";
import DeleteButton from "@/components/admin/DeleteButton";
import DuplicateButton from "@/components/admin/DuplicateButton";

export default async function AdminSectionList({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: key } = await params;
  const section = SECTIONS[key as SectionKey];
  if (!section) notFound();

  const supabase = await getSupabaseSessionClient();
  const { data: rows, error } = await supabase
    .from(section.table)
    .select("id, title, slug, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="text-sm text-rose-600">Failed to load: {error.message}</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-black text-slate-900">{section.label}</h1>
        <Link
          href={`/admin/${section.key}/new`}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition"
        >
          + New {section.singular}
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-[11px] uppercase text-slate-500 font-bold">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(rows ?? []).map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3 font-semibold text-slate-800">
                  {row.title}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      row.status === "published"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">
                  {row.created_at
                    ? new Date(row.created_at).toLocaleDateString()
                    : ""}
                </td>
                <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                  <Link
                    href={`/admin/${section.key}/${row.id}`}
                    className="text-adaBlue font-bold text-xs hover:underline"
                  >
                    Edit
                  </Link>
                  <DuplicateButton section={section.key} id={row.id} />
                  <DeleteButton section={section.key} id={row.id} title={row.title} />
                </td>
              </tr>
            ))}
            {(rows ?? []).length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-400 text-sm">
                  Nothing here yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
