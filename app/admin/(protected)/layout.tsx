import Link from "next/link";
import { SECTIONS } from "@/lib/sections";
import { signOutAdmin } from "@/app/admin/actions";

export const metadata = { robots: { index: false, follow: false } };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-adaNavy text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/admin" className="font-black text-sm tracking-tight">
            The Dentistry Insight — Admin
          </Link>
          <form action={signOutAdmin}>
            <button className="text-xs font-semibold text-slate-300 hover:text-white">
              Sign out
            </button>
          </form>
        </div>
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 pb-3 flex flex-wrap gap-4">
          {Object.values(SECTIONS).map((s) => (
            <Link
              key={s.key}
              href={`/admin/${s.key}`}
              className="text-xs font-semibold text-slate-300 hover:text-white"
            >
              {s.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</div>
    </div>
  );
}
