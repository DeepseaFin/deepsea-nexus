"use client";

import { memo, type ReactNode } from "react";

export interface MetricCardProps {
  readonly label: string;
  readonly value: string;
  readonly note?: string;
  readonly footer?: ReactNode;
  readonly className?: string;
}

function MetricCard({ label, value, note, footer, className = "" }: MetricCardProps) {
  return (
    <article
      aria-label={label}
      className={`h-full min-h-[9rem] rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-colors hover:border-slate-700 ${className}`}
    >
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-100">{value}</p>
      {note ? <p className="mt-1 text-xs text-slate-400">{note}</p> : null}
      {footer ? <div className="mt-3">{footer}</div> : null}
    </article>
  );
}

const MemoizedMetricCard = memo(MetricCard);
MemoizedMetricCard.displayName = "MetricCard";

export default MemoizedMetricCard;
