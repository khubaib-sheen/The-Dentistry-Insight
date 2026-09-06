import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
      <span className="text-xs uppercase tracking-widest font-black text-rose-500 bg-rose-50 px-3 py-1.5 rounded-full inline-block mb-6">
        404
      </span>
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
        We couldn&apos;t find that page
      </h1>
      <p className="text-sm text-slate-500 max-w-md mb-8">
        The listing may have been removed, or the link might be out of date.
        Try one of the sections below instead.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/jobs/"
          className="px-5 py-2.5 bg-adaBlue hover:bg-blue-700 text-white font-bold rounded-lg transition text-sm"
        >
          Browse Jobs
        </Link>
        <Link
          href="/"
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition text-sm"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
