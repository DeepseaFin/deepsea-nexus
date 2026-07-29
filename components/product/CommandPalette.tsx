"use client";

import { useMemo, useState } from "react";
import { Command } from "lucide-react";
import UICard from "@/components/ui/Card";
import TextInput from "@/components/ui/TextInput";

export interface CommandPaletteItem {
  readonly id: string;
  readonly label: string;
  readonly hint?: string;
  readonly onSelect?: () => void;
}

export interface CommandPaletteProps {
  readonly open: boolean;
  readonly items: readonly CommandPaletteItem[];
  readonly onOpenChange: (open: boolean) => void;
}

export default function CommandPalette({ open, items, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const closePalette = () => {
    setQuery("");
    setActiveIndex(0);
    onOpenChange(false);
  };

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) => {
      const candidate = `${item.label} ${item.hint ?? ""}`.toLowerCase();
      return candidate.includes(normalizedQuery);
    });
  }, [items, query]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-slate-950/70 p-4 pt-24" role="dialog" aria-modal="true" aria-label="Command palette">
      <button type="button" className="absolute inset-0" aria-label="Close command palette" onClick={closePalette} />

      <UICard variant="elevated" className="relative z-10 w-full max-w-2xl p-0">
        <div className="border-b border-slate-800 p-3">
          <div className="flex items-center gap-2">
            <Command className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <TextInput
              value={query}
              onChange={(event) => {
                setQuery(event.currentTarget.value);
                setActiveIndex(0);
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  closePalette();
                }

                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setActiveIndex((index) => Math.min(index + 1, Math.max(filteredItems.length - 1, 0)));
                }

                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setActiveIndex((index) => Math.max(index - 1, 0));
                }

                if (event.key === "Enter") {
                  const item = filteredItems[activeIndex];
                  if (!item) {
                    return;
                  }

                  item.onSelect?.();
                  closePalette();
                }
              }}
              placeholder="Jump to workspace, page, or action"
              aria-label="Command search"
              autoFocus
            />
          </div>
        </div>

        <ul className="max-h-[360px] overflow-y-auto p-2" role="listbox" aria-label="Command results">
          {filteredItems.length === 0 ? (
            <li className="rounded-lg px-3 py-2 text-sm text-slate-400">No matching commands.</li>
          ) : (
            filteredItems.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => {
                    item.onSelect?.();
                    closePalette();
                  }}
                  className={`w-full rounded-lg px-3 py-2 text-left ds-motion ${
                    index === activeIndex ? "bg-cyan-900/30 text-cyan-100" : "text-slate-300 hover:bg-slate-900/70"
                  }`}
                >
                  <p className="text-sm font-medium">{item.label}</p>
                  {item.hint ? <p className="mt-0.5 text-xs text-slate-400">{item.hint}</p> : null}
                </button>
              </li>
            ))
          )}
        </ul>
      </UICard>
    </div>
  );
}
