import Link from "next/link";
import Image from "next/image";
import type { NormalizedItem } from "@/lib/sections";

export default function SectionDetail({
  item,
  folder,
  label,
  badge,
  related = [],
}: {
  item: NormalizedItem;
  folder: string;
  label: string;
  badge: string;
  related?: NormalizedItem[];
}) {
  return (
    <article className="bg-white">
      {/* Breadcrumbs — mirrors the BreadcrumbList JSON-LD emitted in generateMetadata */}
      <nav
        aria-label="Breadcrumb"
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 text-xs text-slate-400"
      >
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-adaBlue">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href={`/${folder}/`} className="hover:text-adaBlue">
              {label}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-slate-600 font-semibold truncate max-w-[240px]">
            {item.title}
          </li>
        </ol>
      </nav>

      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 border-b border-slate-100">
        <span className="px-2.5 py-1 bg-blue-50 text-adaBlue text-[10px] font-extrabold uppercase rounded-full tracking-wider">
          {badge}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-3">
          {item.title}
        </h1>
        {item.subtitle && (
          <p className="text-sm text-slate-500 font-semibold mt-2">
            {item.subtitle}
          </p>
        )}
        {item.createdAt && (
          <p className="text-[11px] text-slate-400 font-semibold mt-2">
            Posted{" "}
            {new Date(item.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        )}
      </header>

      {item.image && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden bg-slate-100">
            <Image
              src={item.image}
              alt={item.imageAlt || item.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Renders as HTML: new content is authored via the Tiptap editor
            (Phase 4); legacy plain-text rows render fine too since they
            contain no markup. */}
        <div
          className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />

        {item.ctaLabel && item.ctaHref && (
          <a
            href={item.ctaHref}
            target="_blank"
            rel="noopener"
            className="inline-block mt-8 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition shadow-lg shadow-rose-900/20 text-sm"
          >
            {item.ctaLabel}
          </a>
        )}
      </div>

      {/* Internal linking: 2-4 related posts within the same section,
          plus a link to Jobs — the site's primary conversion page. */}
      {related.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-4">
            Related {label}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/${folder}/${r.slug}/`}
                className="block bg-slate-50 border border-slate-200/80 rounded-lg p-4 hover:shadow-md transition"
              >
                <h3 className="text-sm font-bold text-slate-800">{r.title}</h3>
                {r.subtitle && (
                  <p className="text-xs text-slate-500 mt-1">{r.subtitle}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 flex flex-wrap items-center gap-4">
        <Link
          href={`/${folder}/`}
          className="text-sm font-bold text-adaBlue hover:underline"
        >
          &larr; Back to {label}
        </Link>
        {folder !== "jobs" && (
          <Link
            href="/jobs/"
            className="text-sm font-bold text-rose-600 hover:underline"
          >
            Browse Dental Jobs &rarr;
          </Link>
        )}
      </div>
    </article>
  );
}
