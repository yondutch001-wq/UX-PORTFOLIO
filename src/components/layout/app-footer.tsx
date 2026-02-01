"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppFooter() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <footer className="border-t border-slate-800 bg-[#0f172a] text-slate-300">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6 text-xs uppercase tracking-[0.2em]">
          <span>Admin Console</span>
          <Link href="/" className="transition hover:text-white">
            Back to site
          </Link>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 text-sm md:grid-cols-3 md:items-center">
        <div>
          <p className="text-sm font-semibold">DVTCH</p>
          <p className="mt-2 text-muted">
            UI/UX designer focused on clear, human-centered product experiences.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted md:justify-center">
          <Link href="/work" className="transition hover:text-ink">
            Work
          </Link>
          <Link href="/about" className="transition hover:text-ink">
            About
          </Link>
          <Link href="/contact" className="transition hover:text-ink">
            Contact
          </Link>
        </div>
        <div className="text-muted md:text-right">
          <p>Available for select collaborations.</p>
          <p className="mt-1">dvtchii@gmail.com</p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs uppercase tracking-[0.2em] md:justify-end">
            <a
              href="https://behance.net/Adewoledvtch"
              className="transition hover:text-ink"
              target="_blank"
              rel="noreferrer"
            >
              Behance
            </a>
            <a
              href="https://dribbble.com/yondutch001"
              className="transition hover:text-ink"
              target="_blank"
              rel="noreferrer"
            >
              Dribbble
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
