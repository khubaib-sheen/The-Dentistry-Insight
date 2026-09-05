"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SECTIONS, type SectionKey } from "@/lib/sections";
import { getSupabaseSessionClient } from "@/lib/supabase-session";

function slugify(str: string): string {
  return (str || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Columns every admin_* table has after the Phase 2 + generic-field forms.
// Anything not in a section's field list is simply ignored on save.
function pickAllowedFields(section: SectionKey, formData: FormData) {
  void section; // table-specific filtering happens via the form's own field list
  const out: Record<string, string | boolean | null> = {};
  for (const [key, value] of formData.entries()) {
    if (key === "id" || key === "original_slug" || key === "section") continue;
    if (typeof value !== "string") continue;
    if (key === "noindex") {
      out[key] = value === "true";
    } else {
      out[key] = value === "" ? null : value;
    }
  }
  return out;
}

export async function saveRecord(formData: FormData) {
  const section = formData.get("section") as SectionKey;
  const id = formData.get("id") as string | null;
  const originalSlug = formData.get("original_slug") as string | null;
  const config = SECTIONS[section];
  if (!config) throw new Error("Unknown section");

  const supabase = await getSupabaseSessionClient();
  const fields = pickAllowedFields(section, formData);

  // Auto-generate slug from title if left blank.
  let slug = (fields.slug as string) || "";
  if (!slug && fields.title) {
    slug = slugify(fields.title as string);
  }
  fields.slug = slug;

  if (id) {
    // Editing an existing record — if the slug changed, record a 301
    // redirect from the old published URL to the new one (spec §3).
    if (originalSlug && slug && originalSlug !== slug) {
      const fromPath = `/${config.folder}/${originalSlug}/`;
      const toPath = `/${config.folder}/${slug}/`;
      await supabase
        .from("url_redirects")
        .upsert({ from_path: fromPath, to_path: toPath }, { onConflict: "from_path" });
    }

    const { error } = await supabase.from(config.table).update(fields).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    // New record — ensure slug uniqueness by suffixing a short id if needed.
    const { data: existing } = await supabase
      .from(config.table)
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (existing) {
      slug = `${slug}-${crypto.randomUUID().slice(0, 8)}`;
      fields.slug = slug;
    }

    const { error } = await supabase.from(config.table).insert(fields);
    if (error) throw new Error(error.message);
  }

  revalidatePath(`/${config.folder}`);
  revalidatePath(`/${config.folder}/${slug}`);
  redirect(`/admin/${section}`);
}

export async function deleteRecord(section: SectionKey, id: string) {
  const config = SECTIONS[section];
  if (!config) throw new Error("Unknown section");
  const supabase = await getSupabaseSessionClient();
  const { error } = await supabase.from(config.table).delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/${config.folder}`);
  revalidatePath(`/admin/${section}`);
}

export async function duplicateRecord(section: SectionKey, id: string) {
  const config = SECTIONS[section];
  if (!config) throw new Error("Unknown section");
  const supabase = await getSupabaseSessionClient();

  const { data: row, error } = await supabase
    .from(config.table)
    .select("*")
    .eq("id", id)
    .single();
  if (error || !row) throw new Error(error?.message || "Record not found");

  const clone = { ...row };
  delete clone.id;
  clone.title = `${clone.title} (Copy)`;
  clone.slug = null; // regenerated on next save; left blank + unique-suffixed here
  clone.status = "draft";
  clone.created_at = new Date().toISOString();

  // Generate a unique slug immediately so the duplicate is savable right away.
  const base = slugify(clone.title);
  clone.slug = `${base}-${crypto.randomUUID().slice(0, 8)}`;

  const { error: insertError } = await supabase.from(config.table).insert(clone);
  if (insertError) throw new Error(insertError.message);

  revalidatePath(`/admin/${section}`);
}

export async function signOutAdmin() {
  const supabase = await getSupabaseSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
