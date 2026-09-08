import Link from "next/link";
import Image from "next/image";
import type { NormalizedItem } from "@/lib/sections";

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

          {items.length === 0 ? (
            <p className="text-sm text-slate-400">
              Nothing published here yet — check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/${folder}/${item.slug}/`}
                  className="block bg-white border border-slate-200/80 rounded-xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
                >
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
                  <div className="p-5">
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
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
