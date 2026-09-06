import { notFound } from "next/navigation";
import {
  SECTIONS,
  getPublishedBySlug,
  getAllPublishedSlugs,
  getPublishedList,
} from "@/lib/sections";
import {
  buildDetailMetadata,
  buildDetailJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/seo";
import SectionDetail from "@/components/SectionDetail";
import JsonLd from "@/components/JsonLd";

export const revalidate = 300;

const section = SECTIONS.jobs;

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs(section);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getPublishedBySlug(section, slug);
  if (!item) return {};
  return buildDetailMetadata(item, section);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getPublishedBySlug(section, slug);
  if (!item) notFound();

  const allItems = await getPublishedList(section, 8);
  const related = allItems.filter((i) => i.id !== item.id).slice(0, 4);

  return (
    <>
      <JsonLd data={buildDetailJsonLd(item, section)} />
      <JsonLd data={buildBreadcrumbJsonLd(section, item)} />
      <SectionDetail
        item={item}
        folder={section.folder}
        label={section.label}
        badge={section.badge}
        related={related}
      />
    </>
  );
}
