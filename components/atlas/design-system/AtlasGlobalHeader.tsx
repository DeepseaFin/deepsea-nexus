'use client';

import { Bell, CircleUserRound, Plus, WandSparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import CommandPalette from './CommandPalette';
import SmartSearchBar from './SmartSearchBar';

export default function AtlasGlobalHeader() {
  const [openPalette, setOpenPalette] = useState(false);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpenPalette((open) => !open);
      }
    };

    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#050d18]/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <SmartSearchBar onOpenPalette={() => setOpenPalette(true)} />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:border-cyan-600/40"
            >
              <Plus className="h-3.5 w-3.5" />
              Quick Actions
            </button>

            <Link
              href="/atlas/deals/new"
              className="inline-flex items-center gap-1 rounded-lg border border-cyan-700/40 bg-cyan-950/30 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-100 transition hover:bg-cyan-900/40"
            >
              + New Deal
            </Link>

            <Link
              href="/atlas/clients"
              className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:border-cyan-600/40"
            >
              + Client
            </Link>

            <button
              type="button"
              className="relative rounded-lg border border-slate-700 bg-slate-900 p-2 text-slate-300 transition hover:text-cyan-200"
              aria-label="Global notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-cyan-400" />
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200"
            >
              <CircleUserRound className="h-4 w-4 text-cyan-300" />
              Deepak
            </button>

            <button
              type="button"
              onClick={() => setOpenPalette(true)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-xs text-slate-400 transition hover:text-slate-200"
            >
              <WandSparkles className="h-3.5 w-3.5" />
              ⌘K
            </button>
          </div>
        </div>
      </header>

      <CommandPalette open={openPalette} onClose={() => setOpenPalette(false)} />
    </>
  );
}
