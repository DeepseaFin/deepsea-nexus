"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { PUBLIC_NAVIGATION_ITEMS } from "@/components/layout/publicNavigation";

export interface PublicShellProps {
  readonly children: React.ReactNode;
}

function navLinkClass(active: boolean): string {
  return active
    ? "text-cyan-300"
    : "text-slate-300 transition-colors hover:text-cyan-200";
}

export default function PublicShell({ children }: PublicShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050d18] text-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#050d18]/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2" aria-label="Deepsea Nexus home">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
            <span className="text-sm font-semibold tracking-[0.2em] text-cyan-200">DEEPSEA NEXUS</span>
          </Link>

          <nav aria-label="Global" className="hidden items-center gap-7 lg:flex">
            {PUBLIC_NAVIGATION_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={`text-sm font-medium ${navLinkClass(active)}`}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/contact"
              className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-medium text-slate-100 transition-colors hover:border-cyan-400/60 hover:text-cyan-200"
            >
              Book Briefing
            </Link>
            <Link
              href="/login"
              className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-300"
            >
              Login
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-200 lg:hidden"
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen ? (
          <div className="border-t border-slate-800 bg-[#071423] px-4 py-4 sm:px-6 lg:hidden">
            <nav aria-label="Mobile global" className="grid gap-3">
              {PUBLIC_NAVIGATION_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-3 py-2 text-sm ${active ? "bg-cyan-900/40 text-cyan-200" : "text-slate-300"}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link
                  href="/contact"
                  className="rounded-lg border border-slate-700 px-3 py-2 text-center text-sm font-medium text-slate-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Briefing
                </Link>
                <Link
                  href="/login"
                  className="rounded-lg bg-cyan-400 px-3 py-2 text-center text-sm font-semibold text-slate-950"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            </nav>
          </div>
        ) : null}
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">{children}</main>

      <footer className="mt-12 border-t border-slate-800/80 bg-[#050d18]">
        <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Deepsea Nexus</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Institutional operating system for relationship-led origination, structured execution, and evidence-based
                decisions across trade finance and receivables.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-100">Platform</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>
                  <Link href="/platform" className="hover:text-cyan-200">Control Tower</Link>
                </li>
                <li>
                  <Link href="/technology" className="hover:text-cyan-200">Architecture</Link>
                </li>
                <li>
                  <Link href="/resources" className="hover:text-cyan-200">Knowledge Library</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-100">Use Cases</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>
                  <Link href="/solutions" className="hover:text-cyan-200">Institutional Workflow</Link>
                </li>
                <li>
                  <Link href="/solutions" className="hover:text-cyan-200">Portfolio Monitoring</Link>
                </li>
                <li>
                  <Link href="/solutions" className="hover:text-cyan-200">Governance and Readiness</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-100">Company</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>
                  <Link href="/company" className="hover:text-cyan-200">About</Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-cyan-200">Contact</Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-cyan-200">Client Access</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-800 pt-5 text-xs text-slate-400">
            <p>Deepsea Nexus FZCO. Institutional-grade finance operations software built in the UAE.</p>
          </div>
        </section>
      </footer>
    </div>
  );
}
