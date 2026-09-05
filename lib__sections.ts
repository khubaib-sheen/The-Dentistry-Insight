import { getSupabaseServerClient } from "@/lib/supabase";

export type SectionKey =
  | "jobs"
  | "blogs"
  | "workshop"
  | "market"
  | "exams"
  | "students";

export interface NormalizedItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null; // company/location, price, subject, exam date, etc.
  summary: string; // short card description
  content: string; // full body for detail page
  image: string | null;
  imageAlt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  noindexOverride: boolean;
  ctaLabel: string | null;
  ctaHref: string | null;
  extra: Record<string, string | null>;
}

interface SectionConfig {
  key: SectionKey;
  table: string;
  folder: string; // URL segment, matches the live site's existing routes
  label: string; // plural, human-readable
  singular: string;
  badge: string;
  minChars: number; // thin-content threshold, mirrors scripts/prerender.js
  selectColumns: string;
  jsonLdType: "JobPosting" | "BlogPosting" | "Article" | "Product";
  normalize: (row: any) => NormalizedItem;
}

const SITE_URL = "https://www.thedentistryinsight.com";

function plainText(html: string | null | undefined, max = 160): string {
  if (!html) return "";
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > max ? text.slice(0, max - 1).trimEnd() + "…" : text;
}

export const SECTIONS: Record<SectionKey, SectionConfig> = {
  jobs: {
    key: "jobs",
    table: "admin_jobs",
    folder: "jobs",
    label: "Dental Jobs",
    singular: "Job",
    badge: "Job Opening",
    minChars: 200,
    selectColumns:
      "id, slug, title, description, short_description, content, company, location, salary, apply_link, whatsapp_number, contact_email, image_url, image_url_alt, created_at, updated_at, meta_title, meta_description, canonical_url, noindex",
    jsonLdType: "JobPosting",
    normalize: (r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title || "Untitled job",
      subtitle: [r.company, r.location].filter(Boolean).join(" · ") || null,
      summary: r.short_description || plainText(r.description),
      content: r.content || r.description || "",
      image: r.image_url || null,
      imageAlt: r.image_url_alt || null,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      metaTitle: r.meta_title,
      metaDescription: r.meta_description,
      canonicalUrl: r.canonical_url,
      noindexOverride: !!r.noindex,
      ctaLabel: r.apply_link
        ? "Apply Now"
        : r.whatsapp_number
        ? "Apply via WhatsApp"
        : r.contact_email
        ? "Email to Apply"
        : null,
      ctaHref: r.apply_link
        ? r.apply_link
        : r.whatsapp_number
        ? `https://wa.me/${String(r.whatsapp_number).replace(/[^0-9]/g, "")}`
        : r.contact_email
        ? `mailto:${r.contact_email}`
        : null,
      extra: { salary: r.salary || null },
    }),
  },
  blogs: {
    key: "blogs",
    table: "admin_blogs",
    folder: "blogs",
    label: "Dental Blogs",
    singular: "Blog",
    badge: "Blog",
    minChars: 400,
    selectColumns:
      "id, slug, title, description, short_description, content, category, image_url, cover_image_url, cover_image_url_alt, pdf_url, created_at, updated_at, meta_title, meta_description, canonical_url, noindex",
    jsonLdType: "BlogPosting",
    normalize: (r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title || "Untitled post",
      subtitle: r.category || null,
      summary: r.short_description || plainText(r.description),
      content: r.content || r.description || "",
      image: r.cover_image_url || r.image_url || null,
      imageAlt: r.cover_image_url_alt || null,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      metaTitle: r.meta_title,
      metaDescription: r.meta_description,
      canonicalUrl: r.canonical_url,
      noindexOverride: !!r.noindex,
      ctaLabel: r.pdf_url ? "Download PDF" : null,
      ctaHref: r.pdf_url || null,
      extra: {},
    }),
  },
  workshop: {
    key: "workshop",
    table: "admin_posts",
    folder: "workshop",
    label: "Dental Workshop",
    singular: "Post",
    badge: "Workshop Post",
    minChars: 200,
    selectColumns:
      "id, slug, title, description, content, category, image_url, image_url_alt, link, created_at, updated_at, meta_title, meta_description, canonical_url, noindex",
    jsonLdType: "Article",
    normalize: (r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title || "Untitled post",
      subtitle: r.category || null,
      summary: plainText(r.description),
      content: r.content || r.description || "",
      image: r.image_url || null,
      imageAlt: r.image_url_alt || null,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      metaTitle: r.meta_title,
      metaDescription: r.meta_description,
      canonicalUrl: r.canonical_url,
      noindexOverride: !!r.noindex,
      ctaLabel: r.link ? "View Resource" : null,
      ctaHref: r.link || null,
      extra: {},
    }),
  },
  market: {
    key: "market",
    table: "admin_market",
    folder: "market",
    label: "Dental Market",
    singular: "Listing",
    badge: "Marketplace",
    minChars: 150,
    selectColumns:
      "id, slug, title, description, content, category, price, listing_type, contact, whatsapp_number, link, image_url, cover_image_url, cover_image_url_alt, created_at, updated_at, meta_title, meta_description, canonical_url, noindex",
    jsonLdType: "Product",
    normalize: (r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title || "Untitled listing",
      subtitle: r.price ? `PKR ${r.price}` : r.listing_type || null,
      summary: plainText(r.description),
      content: r.content || r.description || "",
      image: r.cover_image_url || r.image_url || null,
      imageAlt: r.cover_image_url_alt || null,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      metaTitle: r.meta_title,
      metaDescription: r.meta_description,
      canonicalUrl: r.canonical_url,
      noindexOverride: !!r.noindex,
      ctaLabel: r.whatsapp_number
        ? "Contact via WhatsApp"
        : r.link
        ? "View Listing"
        : null,
      ctaHref: r.whatsapp_number
        ? `https://wa.me/${String(r.whatsapp_number).replace(/[^0-9]/g, "")}`
        : r.link || null,
      extra: { listing_type: r.listing_type || null, contact: r.contact || null },
    }),
  },
  exams: {
    key: "exams",
    table: "admin_exams",
    folder: "exams",
    label: "Licensing Exams",
    singular: "Exam",
    badge: "Licensing Exam",
    minChars: 400,
    selectColumns:
      "id, slug, title, description, content, category, cover_image, cover_image_alt, image_url, exam_date, link, links, created_at, updated_at, meta_title, meta_description, canonical_url, noindex",
    jsonLdType: "Article",
    normalize: (r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title || "Untitled exam guide",
      subtitle: r.exam_date
        ? new Date(r.exam_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : r.category || null,
      summary: plainText(r.description),
      content: r.content || r.description || "",
      image: r.cover_image || r.image_url || null,
      imageAlt: r.cover_image_alt || null,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      metaTitle: r.meta_title,
      metaDescription: r.meta_description,
      canonicalUrl: r.canonical_url,
      noindexOverride: !!r.noindex,
      ctaLabel: r.link ? "Official Exam Page" : null,
      ctaHref: r.link || null,
      extra: {},
    }),
  },
  students: {
    key: "students",
    table: "admin_students",
    folder: "students",
    label: "Student Corner",
    singular: "Resource",
    badge: "Student Corner",
    minChars: 150,
    selectColumns:
      "id, slug, subject, title, description, created_at, updated_at, meta_title, meta_description, canonical_url, noindex",
    jsonLdType: "Article",
    normalize: (r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title || "Untitled resource",
      subtitle: r.subject || null,
      summary: plainText(r.description),
      content: r.description || "",
      image: null,
      imageAlt: null,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      metaTitle: r.meta_title,
      metaDescription: r.meta_description,
      canonicalUrl: r.canonical_url,
      noindexOverride: !!r.noindex,
      ctaLabel: null,
      ctaHref: null,
      extra: {},
    }),
  },
};

export function sectionUrl(section: SectionConfig, slug?: string) {
  return slug
    ? `${SITE_URL}/${section.folder}/${slug}/`
    : `${SITE_URL}/${section.folder}/`;
}

// Mirrors contentLength() in scripts/prerender.js: thin pages get
// noindex,follow dynamically (not stored), so this stays accurate
// as content is edited without needing a backfill job.
export function isThinContent(item: NormalizedItem, section: SectionConfig) {
  const len = (item.title + " " + item.summary + item.content).length;
  return len < section.minChars;
}

export async function getPublishedList(
  section: SectionConfig,
  limit?: number
): Promise<NormalizedItem[]> {
  const supabase = getSupabaseServerClient();
  let query = supabase
    .from(section.table)
    .select(section.selectColumns)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error(`Failed to load ${section.table}:`, error.message);
    return [];
  }
  return (data ?? []).map(section.normalize);
}

export async function getPublishedBySlug(
  section: SectionConfig,
  slug: string
): Promise<NormalizedItem | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from(section.table)
    .select(section.selectColumns)
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return section.normalize(data);
}

export async function getAllPublishedSlugs(
  section: SectionConfig
): Promise<string[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from(section.table)
    .select("slug")
    .eq("status", "published");

  if (error || !data) return [];
  return data.map((r: any) => r.slug).filter(Boolean);
}
