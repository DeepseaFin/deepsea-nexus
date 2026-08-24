'use client';

import { Bell, Command, Search, UserCircle2 } from 'lucide-react';

export interface DNOSTopbarProps {
  readonly title: string;
}

export default function DNOSTopbar({ title }: DNOSTopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/90 bg-[#050d18]/95 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Current Workspace</p>
          <h1 className="truncate text-base font-semibold tracking-tight text-slate-100 sm:text-lg">
            {title}
          </h1>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-600/40 hover:text-cyan-200"
          aria-label="Search"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Search</span>
        </button>

        <button
          type="button"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300 transition hover:text-cyan-200"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-400" />
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-600/40 hover:text-cyan-200"
          aria-label="Open command palette"
        >
          <Command className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Command</span>
        </button>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300 transition hover:text-cyan-200"
          aria-label="User avatar"
        >
          <UserCircle2 className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
