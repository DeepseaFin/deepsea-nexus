"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";

export interface CommandPaletteProps {
  readonly open: boolean;
  readonly onClose: () => void;
}

interface CommandItem {
  readonly id: string;
  readonly label: string;
  readonly group: "Customers" | "Deals" | "Documents" | "Tasks" | "Approvals";
}

const commandItems: readonly CommandItem[] = [
  { id: "customer-directory", label: "Open customer directory", group: "Customers" },
  { id: "customer-watchlist", label: "View customer watchlist", group: "Customers" },
  { id: "deals-pipeline", label: "Open deal pipeline", group: "Deals" },
  { id: "deals-underwriting", label: "Review underwriting queue", group: "Deals" },
  { id: "documents-vault", label: "Open document vault", group: "Documents" },
  { id: "documents-checklist", label: "Review required documents", group: "Documents" },
  { id: "tasks-today", label: "View today tasks", group: "Tasks" },
  { id: "tasks-assignments", label: "Open task assignments", group: "Tasks" },
  { id: "approvals-center", label: "Open approval center", group: "Approvals" },
  { id: "approvals-pending", label: "View pending approvals", group: "Approvals" },
];

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return commandItems;
    }

    return commandItems.filter((item) =>
      `${item.group} ${item.label}`.toLowerCase().includes(normalized),
    );
  }, [query]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-slate-950/70 p-4 pt-20 backdrop-blur-sm sm:p-6 sm:pt-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <motion.section
            className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900/95 shadow-[0_24px_60px_rgba(2,6,23,0.5)]"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-center gap-2 border-b border-slate-800 px-3 py-3 sm:px-4">
              <Search className="h-4 w-4 text-cyan-300" aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                autoFocus
                placeholder="Search customers, deals, documents, tasks, approvals"
                className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
              />
              <span className="rounded-md border border-slate-700 px-2 py-0.5 text-[11px] text-slate-400">
                Esc
              </span>
            </header>

            <div className="max-h-[26rem] overflow-y-auto p-2">
              {results.length === 0 ? (
                <p className="px-3 py-6 text-sm text-slate-500">
                  No matching commands. Broaden your search across customers, deals, documents, tasks,
                  or approvals.
                </p>
              ) : (
                <ul className="space-y-1">
                  {results.map((result) => (
                    <li key={result.id}>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-lg border border-transparent px-3 py-2 text-left transition hover:border-slate-700 hover:bg-slate-800/70"
                      >
                        <span className="text-sm text-slate-200">{result.label}</span>
                        <span className="text-[11px] uppercase tracking-[0.12em] text-slate-500">
                          {result.group}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
