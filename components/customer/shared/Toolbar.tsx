"use client";

import { useId, type ReactNode } from "react";

export interface ToolbarProps {
  readonly title?: string;
  readonly subtitle?: string;
  readonly search?: ReactNode;
  readonly filters?: ReactNode;
  readonly actions?: ReactNode;
  readonly className?: string;
}

export default function Toolbar({ title, subtitle, search, filters, actions, className = "" }: ToolbarProps) {
  const titleId = useId();

  return (
    <section
      aria-labelledby={title ? titleId : undefined}
      className={`rounded-2xl border border-slate-800/90 bg-slate-950/70 p-4 transition-colors hover:border-slate-700 focus-within:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-400/40 sm:p-5 ${className}`}
    >
      {title || subtitle ? (
        <div className="mb-4">
          {title ? <h3 id={titleId} className="text-sm font-semibold tracking-tight text-slate-100 sm:text-base">{title}</h3> : null}
          {subtitle ? <p className="mt-1 text-xs text-slate-400 sm:text-sm">{subtitle}</p> : null}
        </div>
      ) : null}

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] xl:items-end">
        <div>{search}</div>
        <div>{filters}</div>
        {actions ? <div className="flex flex-wrap items-center gap-2 lg:col-span-2 xl:col-span-1 xl:justify-end">{actions}</div> : null}
      </div>
    </section>
  );
}
