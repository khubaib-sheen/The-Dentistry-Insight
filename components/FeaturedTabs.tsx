"use client";

import { useState } from "react";
import Link from "next/link";

type Item = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  summary: string;
  createdAt: string | null;
};

export default function FeaturedTabs({
  blogs,
  exams,
  workshop,
}: {
  blogs: Item[];
  exams: Item[];
  workshop: Item[];
}) {
  const tabs = [
    { key: "blogs", label: "Latest Blogs", items: blogs },
    { key: "exams", label: "Latest Exams", items: exams },
    { key: "workshop", label: "Workshop Posts", items: workshop },
  ] as const;

  const [active, setActive] = useState<typeof tabs[number]["key"]>("blogs");

  const activeItems = tabs.find((t) => t.key === active)!.items;

  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-slate-900">Featured</h3>
          <div className="flex gap-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${
                  active === t.key
                    ? "bg-adaBlue text-white shadow"
                    : "bg-white text-slate-600 border border-slate-200"
                }`}
                aria-pressed={active === t.key}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeItems.map((item) => (
            <article
              key={item.id}
              className="bg-white border border-slate-200/80 rounded-xl overflow-hidden hover:shadow-lg transition"
            >
              <Link href={`/${active}/${item.slug}/`} className="block p-5">
                <h4 className="text-base font-bold text-slate-900">{item.title}</h4>
                {item.subtitle && (
                  <p className="text-xs text-slate-500 mt-1">{item.subtitle}</p>
                )}
                {item.summary && (
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3">{item.summary}</p>
                )}
                <p className="text-[10px] text-slate-400 font-semibold mt-3">
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                </p>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
