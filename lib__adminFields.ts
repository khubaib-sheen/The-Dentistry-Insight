import type { SectionKey } from "@/lib/sections";

export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "image"
  | "select"
  | "date";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  help?: string;
}

// Fields specific to each table, beyond the shared SEO block every
// section already gets (see SHARED_FIELDS below).
export const SECTION_FIELDS: Record<SectionKey, FieldDef[]> = {
  jobs: [
    { name: "title", label: "Job Title", type: "text", required: true },
    { name: "company", label: "Company / Clinic", type: "text" },
    { name: "location", label: "Location", type: "text" },
    { name: "salary", label: "Salary", type: "text" },
    { name: "short_description", label: "Short Description (card preview)", type: "textarea" },
    { name: "content", label: "Full Description", type: "richtext", required: true },
    { name: "image_url", label: "Cover Image", type: "image" },
    { name: "apply_link", label: "Apply Link (URL)", type: "text" },
    { name: "whatsapp_number", label: "WhatsApp Number", type: "text" },
    { name: "contact_email", label: "Contact Email", type: "text" },
  ],
  blogs: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "category", label: "Category", type: "text" },
    { name: "short_description", label: "Short Description (card preview)", type: "textarea" },
    { name: "content", label: "Full Content", type: "richtext", required: true },
    { name: "cover_image_url", label: "Cover Image", type: "image" },
    { name: "pdf_url", label: "PDF Attachment (URL)", type: "text" },
  ],
  workshop: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "category", label: "Category", type: "text" },
    { name: "content", label: "Content", type: "richtext", required: true },
    { name: "image_url", label: "Image", type: "image" },
    { name: "link", label: "External Link (URL)", type: "text" },
  ],
  market: [
    { name: "title", label: "Title", type: "text", required: true },
    {
      name: "listing_type",
      label: "Listing Type",
      type: "select",
      options: [
        { value: "sell", label: "Selling" },
        { value: "buy", label: "Buying" },
      ],
    },
    { name: "price", label: "Price (PKR)", type: "text" },
    { name: "content", label: "Description", type: "richtext", required: true },
    { name: "cover_image_url", label: "Cover Image", type: "image" },
    { name: "contact", label: "Contact Info", type: "text" },
    { name: "whatsapp_number", label: "WhatsApp Number", type: "text" },
    { name: "link", label: "External Link (URL)", type: "text" },
  ],
  exams: [
    { name: "title", label: "Exam / Guide Title", type: "text", required: true },
    { name: "category", label: "Category", type: "text" },
    { name: "exam_date", label: "Exam Date", type: "date" },
    { name: "content", label: "Content", type: "richtext", required: true },
    { name: "cover_image", label: "Cover Image", type: "image" },
    { name: "link", label: "Official Link (URL)", type: "text" },
  ],
  students: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "subject", label: "Subject", type: "text" },
    {
      name: "description",
      label: "Description (links are auto-linkified)",
      type: "richtext",
      required: true,
    },
  ],
};

// Present on every table after the Phase 2 migration.
export const SHARED_FIELDS: FieldDef[] = [
  { name: "status", label: "Status", type: "select", options: [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
  ], required: true },
  { name: "meta_title", label: "Meta Title (SEO)", type: "text", help: "~60 characters" },
  { name: "meta_description", label: "Meta Description (SEO)", type: "textarea", help: "~155 characters" },
  { name: "canonical_url", label: "Canonical URL Override", type: "text" },
  { name: "noindex", label: "Force noindex", type: "select", options: [
    { value: "false", label: "No — allow indexing" },
    { value: "true", label: "Yes — noindex this page" },
  ] },
];
