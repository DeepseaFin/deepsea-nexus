"use client";

import { memo, useId } from "react";
import { Search } from "lucide-react";

export interface SearchBarProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly label?: string;
  readonly ariaLabel?: string;
  readonly className?: string;
}

function SearchBar({
  value,
  onChange,
  placeholder = "Search",
  label = "Search",
  ariaLabel,
  className = "",
}: SearchBarProps) {
  const inputId = useId();
  const resolvedAriaLabel = ariaLabel ?? label;

  return (
    <label htmlFor={inputId} className={`flex flex-col gap-1 ${className}`}>
      <span className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{label}</span>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
        <input
          id={inputId}
          aria-label={resolvedAriaLabel}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-700 bg-slate-950/70 py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 transition-colors hover:border-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
        />
      </div>
    </label>
  );
}

const MemoizedSearchBar = memo(SearchBar);
MemoizedSearchBar.displayName = "SearchBar";

export default MemoizedSearchBar;
