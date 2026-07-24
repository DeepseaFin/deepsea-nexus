import React from "react";

export interface SectionCardProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly actions?: React.ReactNode;
  readonly children: React.ReactNode;
}

export default function SectionCard({ title, subtitle, actions, children }: SectionCardProps) {
  return (
    <section className="rounded-2xl border border-slate-800/90 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(2,6,23,0.92))] p-5 shadow-[0_14px_32px_rgba(2,6,23,0.28)] sm:p-6">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-slate-100 sm:text-base">{title}</h2>
          {subtitle ? <p className="mt-1 text-xs text-slate-400 sm:text-sm">{subtitle}</p> : null}
        </div>
        {actions ? <div>{actions}</div> : null}
      </header>
      <div>{children}</div>
    </section>
  );
}
