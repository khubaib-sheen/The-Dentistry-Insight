import Link from "next/link";
import { SECTIONS } from "@/lib/sections";
import { getSupabaseSessionClient } from "@/lib/supabase-session";

export default async function AdminDashboard() {
  const supabase = await getSupabaseSessionClient();

  const counts = await Promise.all(
    Object.values(SECTIONS).map(async (s) => {
      const { count: published } = await supabase
        .from(s.table)
        .select("id", { count: "exact", head: true })
        .eq("status", "published");
      const { count: drafts } = await supabase
        .from(s.table)
        .select("id", { count: "exact", head: true })
        .eq("status", "draft");
      return { section: s, published: published || 0, drafts: drafts || 0 };
    })
  );

  return (
    <div>
      <h1 className="text-xl font-black text-slate-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {counts.map(({ section, published, drafts }) => (
          <Link
            key={section.key}
            href={`/admin/${section.key}`}
            className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition"
          >
            <h2 className="text-sm font-bold text-slate-900">{section.label}</h2>
            <p className="text-xs text-slate-500 mt-2">
              {published} published · {drafts} draft{drafts === 1 ? "" : "s"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
