export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-adaNavy text-slate-300 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start text-center md:text-left mb-8">
          <div />
          <div className="text-center">
            <p className="text-sm font-bold text-white">The Dentistry Insight</p>
            <p className="text-xs mt-2 opacity-70">
              © <span>{year}</span> The Dentistry Insight. All rights reserved.
            </p>
            <p className="text-xs mt-2 opacity-70">
              <i className="fa-solid fa-envelope mr-1.5" />
              hussainsheen63@gmail.com
            </p>
            <div className="flex items-center justify-center gap-4 mt-4 text-[11px]">
              <a href="/about/" className="text-slate-400 hover:text-white underline underline-offset-2">
                About
              </a>
              <a href="/privacy-policy/" className="text-slate-400 hover:text-white underline underline-offset-2">
                Privacy Policy
              </a>
              <a href="/terms/" className="text-slate-400 hover:text-white underline underline-offset-2">
                Terms
              </a>
            </div>
          </div>
          <div className="text-center md:text-right">
            <h4 className="text-xs font-black tracking-wider uppercase text-slate-300 mb-2">
              Administrative Zone
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Authorized clinical operators & team managers only.
            </p>
            <a
              href="/admin"
              className="text-[11px] font-semibold text-slate-400 hover:text-white underline underline-offset-2"
            >
              Admin Login
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
