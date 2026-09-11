"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { NormalizedItem } from "@/lib/sections";

// Same curated keyword groups as the original static site, so "Karachi,
// Pakistan" or "Al Sharjah, UAE" match the right dropdown option even when
// admins don't type the country name consistently.
const COUNTRY_KEYWORDS: Record<string, string[]> = {
  pakistan: [
    "pakistan", "karachi", "lahore", "islamabad", "rawalpindi", "faisalabad", "multan", "peshawar",
    "quetta", "sialkot", "gujranwala", "sargodha", "rawat", "sadiqabad", "bahawalpur", "sukkur",
    "larkana", "sheikhupura", "jhang", "rahim yar khan", "gujrat", "kasur", "mardan", "mingora",
    "nawabshah", "sahiwal", "okara", "wah cantonment", "wah cantt", "dera ghazi khan", "dg khan",
    "mirpur khas", "kohat", "hyderabad", "abbottabad", "muzaffarabad", "gilgit", "skardu",
    "chiniot", "kamoke", "hafizabad", "burewala", "jacobabad", "attock", "vehari", "chakwal",
    "mandi bahauddin", "jhelum", "toba tek singh", "layyah", "muzaffargarh", "khanewal", "kot addu",
    "nowshera", "charsadda", "swat", "bannu", "dera ismail khan", "bahawalnagar", "daska", "gojra",
    "pattoki", "shikarpur", "khairpur", "dadu", "sanghar", "badin", "tando adam", "mirpur azad kashmir",
    "kotli", "chishtian", "ghotki",
  ],
  usa: [
    "usa", "u.s.a", "united states", "america", "u.s.", "new york", "los angeles", "chicago",
    "houston", "phoenix", "philadelphia", "san antonio", "san diego", "dallas", "san jose",
    "austin", "jacksonville", "fort worth", "columbus", "charlotte", "san francisco", "indianapolis",
    "seattle", "denver", "washington", "boston", "nashville", "detroit", "portland", "memphis",
    "las vegas", "louisville", "baltimore", "milwaukee", "albuquerque", "tucson", "fresno",
    "sacramento", "atlanta", "miami", "oakland", "minneapolis", "tulsa", "cleveland", "wichita",
    "arlington", "california", "texas", "florida", "ohio", "georgia", "michigan", "virginia",
    "new jersey", "north carolina",
  ],
  indonesia: [
    "indonesia", "jakarta", "surabaya", "bandung", "medan", "semarang", "makassar", "palembang",
    "depok", "tangerang", "bekasi", "bali", "denpasar", "yogyakarta", "malang", "bogor",
  ],
  uae: [
    "uae", "u.a.e", "united arab emirates", "dubai", "sharjah", "abu dhabi", "ajman",
    "ras al khaimah", "fujairah", "umm al quwain", "al ain",
  ],
  "saudi arabia": [
    "saudi", "ksa", "riyadh", "jeddah", "mecca", "makkah", "medina", "madinah", "dammam",
    "khobar", "al khobar", "taif", "tabuk", "abha", "jubail", "yanbu", "najran", "hail", "buraidah",
  ],
  australia: [
    "australia", "sydney", "melbourne", "brisbane", "perth", "adelaide", "gold coast",
    "canberra", "newcastle nsw", "hobart", "darwin",
  ],
  qatar: ["qatar", "doha", "al rayyan", "al wakrah", "umm salal"],
  uk: [
    "uk", "u.k", "united kingdom", "england", "london", "scotland", "wales", "britain",
    "great britain", "manchester", "birmingham", "liverpool", "leeds", "glasgow", "edinburgh",
    "bristol", "sheffield", "cardiff", "belfast", "newcastle upon tyne", "nottingham", "leicester",
  ],
};

const COUNTRY_LABELS: Record<string, string> = {
  pakistan: "Pakistan",
  usa: "USA",
  indonesia: "Indonesia",
  uae: "UAE",
  "saudi arabia": "Saudi Arabia",
  australia: "Australia",
  qatar: "Qatar",
  uk: "UK",
  other: "Other",
};

const COUNTRY_CODE_MAP: Record<string, string> = {
  PK: "pakistan", US: "usa", ID: "indonesia", AE: "uae",
  SA: "saudi arabia", AU: "australia", QA: "qatar", GB: "uk",
};

function itemMatchesCountry(item: NormalizedItem, countryKey: string): boolean {
  const text = `${item.subtitle || ""} ${item.title || ""}`.toLowerCase();
  if (countryKey === "other") {
    return !Object.values(COUNTRY_KEYWORDS).some((words) =>
      words.some((w) => text.includes(w))
    );
  }
  const words = COUNTRY_KEYWORDS[countryKey] || [countryKey];
  return words.some((w) => text.includes(w));
}

function PlainGrid({
  items,
  folder,
  badge,
}: {
  items: NormalizedItem[];
  folder: string;
  badge: string;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => {
        const isWhatsApp = item.ctaHref?.includes("wa.me");
        const isMailto = item.ctaHref?.startsWith("mailto:");
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
                  {...(!isMailto && {
                    target: "_blank",
                    rel: "noopener noreferrer",
                  })}
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
  );
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
  // Defaults to Pakistan, same as the original site, until geo-IP resolves.
  const [selectedCountry, setSelectedCountry] = useState<string>("pakistan");

  useEffect(() => {
    let cancelled = false;
    fetch("https://ipapi.co/json/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.country_code) return;
        const key = COUNTRY_CODE_MAP[data.country_code] || "other";
        setSelectedCountry(key);
      })
      .catch(() => {
        // Geo-detection unavailable (blocked/offline) — stays on Pakistan default.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const countryOptions = useMemo(
    () => [...Object.keys(COUNTRY_KEYWORDS), "other"],
    []
  );

  const filteredItems = useMemo(
    () => items.filter((item) => itemMatchesCountry(item, selectedCountry)),
    [items, selectedCountry]
  );

  return (
    <>
      <div className="mb-6">
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:border-adaBlue transition focus:outline-none focus:ring-2 focus:ring-adaBlue/30"
        >
          {countryOptions.map((key) => (
            <option key={key} value={key}>
              {COUNTRY_LABELS[key] || key}
            </option>
          ))}
        </select>
      </div>

      {filteredItems.length === 0 ? (
        <p className="text-sm text-slate-400">
          No listings found for {COUNTRY_LABELS[selectedCountry]}.
        </p>
      ) : (
        <PlainGrid items={filteredItems} folder={folder} badge={badge} />
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
  enableCountryFilter = false,
}: {
  title: string;
  intro: string;
  badge: string;
  folder: string;
  items: NormalizedItem[];
  enableCountryFilter?: boolean;
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

          {items.length === 0 ? (
            <p className="text-sm text-slate-400">
              Nothing published here yet — check back soon.
            </p>
          ) : enableCountryFilter ? (
            <CountryFilterGrid items={items} folder={folder} badge={badge} />
          ) : (
            <PlainGrid items={items} folder={folder} badge={badge} />
          )}
        </div>
      </section>
    </>
  );
}