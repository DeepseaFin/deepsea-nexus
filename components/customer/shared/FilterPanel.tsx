"use client";

import { useId, type ReactNode } from "react";

export interface FilterPanelProps {
  readonly title?: string;
  readonly subtitle?: string;
  readonly children: ReactNode;
  readonly className?: string;
}

export default function FilterPanel({ title, subtitle, children, className = "" }: FilterPanelProps) {
  const titleId = useId();

  return (
    <section
      aria-labelledby={title ? titleId : undefined}
      className={`rounded-2xl border border-slate-800/90 bg-slate-950/70 p-4 transition-colors hover:border-slate-700 focus-within:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-400/40 sm:p-5 ${className}`}
    >
      {title || subtitle ? (
        <div className="mb-3">
          {title ? <h4 id={titleId} className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">{title}</h4> : null}
          {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
        </div>
      ) : null}

      <div className="space-y-3">{children}</div>
    </section>
  );
}
