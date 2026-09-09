"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { NormalizedItem } from "@/lib/sections";

function extractCountry(location: string | null): string {
  if (!location) return "Other";
  const parts = location.split(",");
  return parts[parts.length - 1].trim();
}

function CountryFilterGrid({
  items,
  folder,
  badge,
}: {
  items: NormalizedItem[];
  folder: string;
  badge: string;
}) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const countries = useMemo(() => {
    const countrySet = new Set<string>();
    items.forEach((item) => {
      countrySet.add(extractCountry(item.subtitle));
    });
    return Array.from(countrySet).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!selectedCountry) return items;
    return items.filter(
      (item) => extractCountry(item.subtitle) === selectedCountry
    );
  }, [items, selectedCountry]);

  return (
    <>
      {/* Filter Dropdown */}
      <div className="mb-6">
        <select
          value={selectedCountry || ""}
          onChange={(e) => setSelectedCountry(e.target.value || null)}
          className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:border-adaBlue transition focus:outline-none focus:ring-2 focus:ring-adaBlue/30"
        >
          <option value="">All Countries</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <p className="text-sm text-slate-400">
          No listings found for the selected country.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isWhatsApp = item.ctaHref?.includes("wa.me");
            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200/80 rounded-xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col"
              >
                <Link href={`/${folder}/${item.slug}/`} className="block flex-1">
                  {item.image && (
                    <div className="relative w-full h-36 bg-slate-100">
                      <Image
                        src={item.image}
                        alt={item.imageAlt || item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-5 pb-3">
                    <span className="px-2.5 py-1 bg-blue-50 text-adaBlue text-[9px] font-extrabold uppercase rounded-full tracking-wider">
                      {badge}
                    </span>
                    <h2 className="text-base font-bold text-slate-900 mt-2">
                      {item.title}
                    </h2>
                    {item.subtitle && (
                      <p className="text-xs text-slate-500 font-semibold mt-1">
                        {item.subtitle}
                      </p>
                    )}
                    {item.summary && (
                      <p className="text-xs text-slate-400 mt-2 line-clamp-3">
                        {item.summary}
                      </p>
                    )}
                  </div>
                </Link>
                {item.ctaHref && item.ctaLabel && (
                  <div className="px-5 pb-5">
                    <a
                      href={item.ctaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold transition ${
                        isWhatsApp
                          ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-600"
                          : "bg-adaBlue/10 hover:bg-adaBlue/20 text-adaBlue"
                      }`}
                    >
                      {isWhatsApp && <i className="fa-brands fa-whatsapp" />}
                      {item.ctaLabel}
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default function SectionHub({
  title,
  intro,
  badge,
  folder,
  items,
}: {
  title: string;
  intro: string;
  badge: string;
  folder: string;
  items: NormalizedItem[];
}) {
  return (
    <>
      <section className="bg-adaNavy text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs uppercase tracking-widest font-black text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-full inline-block mb-4">
            {badge}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
            {title}
          </h1>
          <p className="text-slate-300 max-w-2xl">{intro}</p>
        </div>
      </section>

      <section className="py-12 bg-slate-50 min-h-[40vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-slate-500 font-semibold mb-6">
            {items.length} {items.length === 1 ? "listing" : "listings"}
          </p>

          <CountryFilterGrid items={items} folder={folder} badge={badge} />
        </div>
      </section>
    </>
  );
}
