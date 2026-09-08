"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/jobs/", label: "Jobs" },
  { href: "/blogs/", label: "Blogs" },
  { href: "/workshop/", label: "Dental Workshop" },
  { href: "/market/", label: "Market" },
  { href: "/exams/", label: "Exams" },
  { href: "/students/", label: "Students" },
  { href: "/contact/", label: "Contact Us" },
];

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Top Utilities bar */}
      <div className="bg-adaNavy text-white text-xs py-2 px-4 md:px-8 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-4">
          <span className="opacity-80">
            <i className="fa-solid fa-users mr-1" /> Dentist Hub
          </span>
          <span className="hidden md:inline opacity-80">|</span>
          <span className="hidden md:inline opacity-80">
            <i className="fa-solid fa-circle-check mr-1" /> Verified Career Portal
          </span>
        </div>
        <span className="text-[11px] font-semibold bg-adaRose px-2 py-0.5 rounded text-white">
          DR. HUSSAIN AHMAD INITIATIVE
        </span>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24">
            <Link href="/" className="flex items-center gap-4 group">
              <Image
                src="/logo.png"
                alt="The Dentistry Insight Logo"
                width={64}
                height={64}
                className="h-14 sm:h-16 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col border-l-2 border-slate-200 pl-4">
                <span className="text-lg sm:text-xl font-black text-adaNavy tracking-tight leading-none">
                  The Dentistry Insight
                </span>
                <span className="text-[10px] font-semibold text-slate-400 mt-1 tracking-wider uppercase">
                  Dental Careers & Resources
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-slate-700 hover:text-adaBlue font-semibold text-sm transition"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <i className="fa-solid fa-bars text-xl" />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-3 shadow-lg">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-slate-700 font-semibold text-sm py-2"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
