import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of Use for The Dentistry Insight.",
  alternates: { canonical: "/terms/" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-6">
        Terms of Use
      </h1>
      <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700 space-y-4">
        <p>
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p>
          By using thedentistryinsight.com, you agree to these terms. Job
          listings, market listings, and other content are posted in good
          faith but are not independently verified beyond the platform&apos;s
          stated review process. Users are responsible for their own due
          diligence before applying to a job or completing a transaction with
          another user.
        </p>
        <h2 className="text-base font-bold text-slate-900">Content</h2>
        <p>
          Content submitted through the platform must be accurate and
          relevant to dental professionals. We reserve the right to remove
          any listing at our discretion.
        </p>
        <h2 className="text-base font-bold text-slate-900">Contact</h2>
        <p>
          Questions about these terms can be sent to{" "}
          <a href="mailto:hussainsheen63@gmail.com" className="text-adaBlue">
            hussainsheen63@gmail.com
          </a>
          .
        </p>
      </div>
    </section>
  );
}
