"use client";

import React from "react";
import { Bell, Command, Menu, Search, UserCircle2 } from "lucide-react";

export interface TopNavigationProps {
  readonly onOpenCommandPalette: () => void;
  readonly onToggleNotifications: () => void;
  readonly onToggleUserMenu: () => void;
  readonly onToggleSidebar: () => void;
}

export default function TopNavigation({
  onOpenCommandPalette,
  onToggleNotifications,
  onToggleUserMenu,
  onToggleSidebar,
}: TopNavigationProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/90 bg-[#050d18]/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1800px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300 lg:hidden"
          aria-label="Toggle navigation"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-900/40 text-cyan-200">
              <span className="text-xs font-bold tracking-wide">DN</span>
            </div>
            <div className="leading-tight">
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Deepsea Nexus</p>
              <p className="text-[11px] text-slate-400">Institutional Operating Platform</p>
            </div>
          </div>
        </div>

        <div className="hidden min-w-0 max-w-xl flex-1 items-center md:flex">
          <label className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="search"
              aria-label="Global Search"
              placeholder="Search customers, deals, documents"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/80 py-2 pl-9 pr-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-600/50"
            />
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-2 text-xs text-slate-300 transition hover:border-cyan-600/40 hover:text-cyan-200"
            aria-label="Open command palette"
          >
            <Command className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Command</span>
            <span className="hidden rounded border border-slate-700 px-1.5 py-0.5 text-[10px] sm:inline">
              ⌘K
            </span>
          </button>

          <button
            type="button"
            onClick={onToggleNotifications}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300 transition hover:text-cyan-200"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-400" />
          </button>

          <button
            type="button"
            onClick={onToggleUserMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300 transition hover:text-cyan-200"
            aria-label="User menu"
          >
            <UserCircle2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
