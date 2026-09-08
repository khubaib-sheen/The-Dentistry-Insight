import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description:
    "The Dentistry Insight is a growing platform for dental professionals — jobs, blogs, workshop discussion, market listings, and licensing exam resources.",
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-6">
        About The Dentistry Insight
      </h1>
      <div className="flex items-center gap-4 mb-8">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
          <Image
            src="/founder.jpg"
            alt="Dr. Hussain Ahmad, founder of The Dentistry Insight"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">Dr. Hussain Ahmad</p>
          <p className="text-xs text-slate-500">Founder, The Dentistry Insight</p>
        </div>
      </div>
      <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700 space-y-4">
        <p>
          The Dentistry Insight is a growing platform built for dental
          professionals — posting verified dental jobs, community blogs,
          workshop discussions, market listings, and licensing exam resources
          for dentists across Pakistan and worldwide.
        </p>
        <p>
          The platform is currently focused on building trust with the dental
          community through organic growth. Only verified job vacancies are
          posted, sourced directly from clinics or trusted portals.
        </p>
      </div>
    </section>
  );
}
