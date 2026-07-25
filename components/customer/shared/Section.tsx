"use client";

import type { ReactNode } from "react";

export interface SectionProps {
  readonly title?: string;
  readonly subtitle?: string;
  readonly actions?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
}

export default function Section({ title, subtitle, actions, children, className = "" }: SectionProps) {
  return (
    <section className={`space-y-4 ${className}`}>
      {title || subtitle || actions ? (
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            {title ? <h2 className="text-sm font-semibold tracking-tight text-slate-100 sm:text-base">{title}</h2> : null}
            {subtitle ? <p className="mt-1 text-xs text-slate-400 sm:text-sm">{subtitle}</p> : null}
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </header>
      ) : null}

      <div className="space-y-4">{children}</div>
    </section>
  );
}
