import { createClient } from "@supabase/supabase-js";

// Server-side client. Uses the public anon key (same one prerender.js uses) —
// RLS policies restrict anonymous reads to status/public rows, so this is safe
// to call from Server Components at request/build time.
export function getSupabaseServerClient() {
  const url =
    process.env.SUPABASE_URL || "https://rtzxxeeqfhmmnoubwzvq.supabase.co";
  const anonKey =
    process.env.SUPABASE_ANON_KEY ||
    "sb_publishable_v8RouLqDckbyAXURXFo18w_Q0M3Qx5-";

  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}

// Mirrors the TYPES map in scripts/prerender.js so the Next.js routes and the
// legacy static-page generator stay in sync while both exist side by side.
export const CONTENT_TYPES = {
  jobs: { table: "admin_jobs", folder: "jobs", label: "Dental Jobs" },
  blogs: { table: "admin_blogs", folder: "blogs", label: "Dental Blogs" },
  posts: { table: "admin_posts", folder: "workshop", label: "Dental Workshop" },
  market: { table: "admin_market", folder: "market", label: "Dental Market" },
  exams: { table: "admin_exams", folder: "exams", label: "Licensing Exams" },
  students: {
    table: "admin_students",
    folder: "students",
    label: "Student Corner",
  },
} as const;

export function slugify(str: string): string {
  return (str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}
