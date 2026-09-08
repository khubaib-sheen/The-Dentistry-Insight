import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Dr. Hussain Ahmad at The Dentistry Insight for job postings, queries, or collaboration.",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
        Contact Us
      </h1>
      <p className="text-sm text-slate-500 mb-8">
        Reach out to Dr. Hussain Ahmad directly for queries, listings, or
        collaboration.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href="mailto:hussainsheen63@gmail.com"
          className="bg-white border border-slate-200/80 rounded-xl p-6 flex items-center gap-4 hover:shadow-md transition"
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
          className="bg-white border border-slate-200/80 rounded-xl p-6 flex items-center gap-4 hover:shadow-md transition"
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
    </section>
  );
}
