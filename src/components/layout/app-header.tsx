"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function AppHeader() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [menuOpen, setMenuOpen] = useState(false);

  if (isAdmin) {
    return (
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-[#0f172a] text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-3">
              <span className="text-lg font-semibold">DVTCH Admin</span>
              <span className="hidden text-sm text-slate-300 sm:inline">
                Dashboard
              </span>
            </Link>
          </div>

          <nav className="hidden flex-wrap items-center gap-5 text-sm font-medium text-slate-300 md:flex">
            <Link href="/admin" className="transition hover:text-white">
              Overview
            </Link>
            <Link href="/admin/projects" className="transition hover:text-white">
              Projects
            </Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/admin/projects" className="btn btn-primary">
              Manage projects
            </Link>
            <Link href="/" className="btn btn-ghost">
              View site
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
        {menuOpen ? (
          <div className="border-t border-slate-800 px-6 pb-6">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 pt-4 text-sm font-medium text-slate-300">
              <Link
                href="/admin"
                className="transition hover:text-white"
                onClick={() => setMenuOpen(false)}
              >
                Overview
              </Link>
              <Link
                href="/admin/projects"
                className="transition hover:text-white"
                onClick={() => setMenuOpen(false)}
              >
                Projects
              </Link>
              <Link
                href="/admin/projects"
                className="btn btn-primary"
                onClick={() => setMenuOpen(false)}
              >
                Manage projects
              </Link>
              <Link
                href="/"
                className="btn btn-ghost"
                onClick={() => setMenuOpen(false)}
              >
                View site
              </Link>
            </div>
          </div>
        ) : null}
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-lg font-semibold">DVTCH</span>
          <span className="hidden text-sm text-muted sm:inline">
            UI/UX Designer
          </span>
        </Link>

        <nav className="hidden flex-wrap items-center gap-5 text-sm font-medium text-ink-soft md:flex">
          <Link href="/#testimonials" className="transition hover:text-ink">
            Testimonials
          </Link>
          <Link href="/about" className="transition hover:text-ink">
            About
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/contact" className="btn btn-ghost">
            Contact
          </Link>
          <Link href="/work" className="btn btn-primary">
            View Work
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>
      {menuOpen ? (
        <div className="border-t border-border px-6 pb-6">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 pt-4 text-sm font-medium text-ink-soft">
            <Link
              href="/#testimonials"
              className="transition hover:text-ink"
              onClick={() => setMenuOpen(false)}
            >
              Testimonials
            </Link>
            <Link
              href="/about"
              className="transition hover:text-ink"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/work"
              className="btn btn-primary"
              onClick={() => setMenuOpen(false)}
            >
              View Work
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
