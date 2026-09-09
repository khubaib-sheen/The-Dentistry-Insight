"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { NormalizedItem } from "@/lib/sections";

export default function SectionHubClient({
  items,
  folder,
  badge,
}: {
  items: NormalizedItem[];
  folder: string;
  badge: string;
}) {
  const [selected, setSelected] = useState("ALL");

  function extractCountry(item: NormalizedItem) {
    const s = item.subtitle || "";
    // If subtitle contains '·' (company · location), take the last segment
    const dotParts = s.split("·").map((p) => p.trim()).filter(Boolean);
    const loc = dotParts.length > 1 ? dotParts[dotParts.length - 1] : s;
    const commaParts = loc.split(",").map((p) => p.trim()).filter(Boolean);
    return commaParts.length ? commaParts[commaParts.length - 1] : "";
  }

  const countries = useMemo(() => {
    const set = new Set<string>();
    items.forEach((it) => {
      const c = extractCountry(it);
      if (c) set.add(c);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const filtered = useMemo(() => {
    if (selected === "ALL") return items;
    return items.filter((it) => extractCountry(it) === selected);
  }, [items, selected]);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <label htmlFor="country-filter" className="text-xs text-slate-500 font-semibold">
            Filter by country
          </label>
          <select
            id="country-filter"
            className="text-sm rounded-md border border-slate-200 px-3 py-2"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="ALL">All Countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="text-xs text-slate-400">Showing {filtered.length} of {items.length}</div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-slate-400">No listings match that filter.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
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
                      <p className="text-xs text-slate-400 mt-2 line-clamp-3">{item.summary}</p>
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
