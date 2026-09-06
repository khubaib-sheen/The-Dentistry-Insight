import type { Metadata } from "next";
import type { NormalizedItem } from "@/lib/sections";
import { isThinContent, sectionUrl } from "@/lib/sections";

const SITE_URL = "https://www.thedentistryinsight.com";
const SITE_NAME = "The Dentistry Insight";

type SectionLike = Parameters<typeof isThinContent>[1];

export function buildDetailMetadata(
  item: NormalizedItem,
  section: SectionLike
): Metadata {
  const title = item.metaTitle || `${item.title} | ${section.label}`;
  const description =
    item.metaDescription || item.summary || `${item.title} — ${SITE_NAME}`;
  const canonical = item.canonicalUrl || sectionUrl(section, item.slug);
  const thin = isThinContent(item, section);
  const noindex = item.noindexOverride || thin;

  return {
    title,
    description,
    alternates: { canonical },
    robots: noindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      images: item.image ? [{ url: item.image }] : undefined,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: item.image ? [item.image] : undefined,
    },
  };
}

export function buildHubMetadata(
  section: SectionLike,
  description: string
): Metadata {
  const canonical = sectionUrl(section);
  return {
    title: section.label,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: section.label,
      description,
      url: canonical,
      siteName: SITE_NAME,
    },
  };
}

export function buildDetailJsonLd(item: NormalizedItem, section: SectionLike) {
  const url = sectionUrl(section, item.slug);
  const base = {
    "@context": "https://schema.org",
    headline: item.title,
    description: item.summary,
    image: item.image ? [item.image] : undefined,
    datePublished: item.createdAt,
    dateModified: item.updatedAt || item.createdAt,
    url,
    author: { "@type": "Person", name: "Dr. Hussain Ahmad" },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
  };

  if (section.jsonLdType === "JobPosting") {
    return {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title: item.title,
      description: item.content || item.summary,
      datePosted: item.createdAt,
      validThrough: undefined,
      employmentType: "FULL_TIME",
      hiringOrganization: {
        "@type": "Organization",
        name: item.subtitle?.split(" · ")[0] || SITE_NAME,
      },
      jobLocation: item.subtitle
        ? {
            "@type": "Place",
            address: { "@type": "PostalAddress", addressLocality: item.subtitle },
          }
        : undefined,
      url,
    };
  }

  if (section.jsonLdType === "Product") {
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: item.title,
      description: item.summary,
      image: item.image,
      url,
      offers: item.extra?.price
        ? {
            "@type": "Offer",
            price: item.extra.price,
            priceCurrency: "PKR",
            url,
          }
        : undefined,
    };
  }

  return { ...base, "@type": section.jsonLdType };
}

export function buildBreadcrumbJsonLd(
  section: SectionLike,
  item: NormalizedItem
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: section.label,
        item: sectionUrl(section),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: item.title,
        item: sectionUrl(section, item.slug),
      },
    ],
  };
}
