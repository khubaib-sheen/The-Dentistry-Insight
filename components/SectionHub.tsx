import Link from "next/link";
import Image from "next/image";
import type { NormalizedItem } from "@/lib/sections";
import SectionHubClient from "./SectionHubClient";

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

          {/* Client-side filter + grid */}
          <SectionHubClient items={items} folder={folder} badge={badge} />
        </div>
      </section>
    </>
  );
}
