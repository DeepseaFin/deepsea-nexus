import React from "react";
import type { LucideIcon } from "lucide-react";

export interface StatCardProps {
  readonly label: string;
  readonly value: string;
  readonly delta?: string;
  readonly icon?: LucideIcon;
}

export default function StatCard({ label, value, delta, icon: Icon }: StatCardProps) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      <header className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{label}</p>
        {Icon ? <Icon className="h-4 w-4 text-cyan-300" aria-hidden="true" /> : null}
      </header>
      <p className="mt-2 text-xl font-semibold tracking-tight text-slate-100">{value}</p>
      {delta ? <p className="mt-1 text-xs text-slate-400">{delta}</p> : null}
    </article>
  );
}
