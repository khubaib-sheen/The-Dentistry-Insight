import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for The Dentistry Insight.",
  alternates: { canonical: "/privacy-policy/" },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-6">
        Privacy Policy
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
          The Dentistry Insight (&quot;we&quot;, &quot;us&quot;) operates
          thedentistryinsight.com. This page explains what information we
          collect from visitors and how it is used.
        </p>
        <h2 className="text-base font-bold text-slate-900">
          Information We Collect
        </h2>
        <p>
          We collect information you voluntarily provide when applying to a
          job listing, submitting a market listing, or contacting us directly
          (such as your name, email, or WhatsApp number). We do not sell this
          information to third parties.
        </p>
        <h2 className="text-base font-bold text-slate-900">
          Cookies &amp; Analytics
        </h2>
        <p>
          We may use standard analytics tools to understand how visitors use
          the site, in aggregate and non-identifying form.
        </p>
        <h2 className="text-base font-bold text-slate-900">Contact</h2>
        <p>
          For questions about this policy, contact us at{" "}
          <a href="mailto:hussainsheen63@gmail.com" className="text-adaBlue">
            hussainsheen63@gmail.com
          </a>
          .
        </p>
      </div>
    </section>
  );
}
