import Link from "next/link";
import type { Metadata } from "next";
import { SECTIONS, getPublishedList } from "@/lib/sections";

export const revalidate = 300; // ISR: refresh every 5 minutes

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

function formatDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function HomePage() {
  const jobs = await getPublishedList(SECTIONS.jobs, 6);

  return (
    <>
      {/* HERO — ported 1:1 from index.html */}
      <section className="relative bg-adaNavy text-white overflow-hidden py-16 lg:py-24 hero-bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs uppercase tracking-widest font-black text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-full inline-block mb-6">
              Dentist Hub
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-6">
              What is <br />
              <span className="text-rose-400">The Dentistry Insight?</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
              The Dentistry Insight is a growing dentist platform, posting
              dental jobs, blogs, community posts, market listings, and
              licensing exam resources for dental professionals worldwide.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/jobs/"
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition shadow-lg shadow-rose-900/30 text-sm"
              >
                Explore Dental Jobs
              </Link>
              <Link
                href="/market/"
                className="px-6 py-3 bg-adaBlue hover:bg-blue-700 text-white font-bold rounded-lg transition text-sm shadow-md"
              >
                Browse Dental Market
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* JOBS — Server Component, rendered in raw HTML for crawlers.
          This replaces the old client-side fetch-into-empty-div pattern. */}
      <section id="jobs-section" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between flex-wrap gap-4">
            <div>
              <div className="text-xs font-bold tracking-widest text-adaBlue uppercase mb-2">
                Latest Openings
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Dental Jobs
              </h2>
            </div>
            <Link
              href="/jobs/"
              className="text-sm font-bold text-adaBlue hover:underline"
            >
              View all jobs &rarr;
            </Link>
          </div>

          {jobs.length === 0 ? (
            <p className="text-sm text-slate-400">No listings yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.slug}/`}
                  className="block bg-white border border-slate-200/80 rounded-xl p-5 hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <span className="px-2.5 py-1 bg-blue-50 text-adaBlue text-[9px] font-extrabold uppercase rounded-full tracking-wider">
                    Job Opening
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2">
                    {job.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-1">
                    {job.subtitle}
                  </p>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3">
                    {job.summary}
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-3">
                    {formatDate(job.createdAt)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact-section" className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center max-w-xl mx-auto">
            <div className="text-xs font-bold tracking-widest text-adaBlue uppercase mb-2">
              Get In Touch
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Contact Us
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Reach out to Dr. Hussain Ahmad directly for queries, listings,
              or collaboration.
            </p>
          </div>
          <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
            <a
              href="mailto:hussainsheen63@gmail.com"
              className="bg-white border border-slate-200/80 rounded-xl p-6 flex items-center gap-4 hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-full bg-adaSoftBlue flex items-center justify-center text-adaBlue text-lg flex-shrink-0">
                <i className="fa-solid fa-envelope" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Email
                </div>
                <div className="text-sm font-bold text-slate-900 break-all">
                  hussainsheen63@gmail.com
                </div>
              </div>
            </a>
            <a
              href="https://wa.me/923433411151"
              target="_blank"
              rel="noopener"
              className="bg-white border border-slate-200/80 rounded-xl p-6 flex items-center gap-4 hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 text-lg flex-shrink-0">
                <i className="fa-brands fa-whatsapp" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  WhatsApp
                </div>
                <div className="text-sm font-bold text-slate-900">
                  +92 343 3411151
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
