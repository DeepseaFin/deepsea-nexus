"use client";

import type { ReactNode } from "react";

export interface EmptyStateProps {
  readonly title?: string;
  readonly message: string;
  readonly actions?: ReactNode;
  readonly className?: string;
}

export default function EmptyState({ title, message, actions, className = "" }: EmptyStateProps) {
  return (
    <div className={`rounded-lg border border-slate-800 bg-slate-950/70 p-4 text-center ${className}`} role="status" aria-live="polite">
      {title ? <p className="text-sm font-semibold text-slate-100">{title}</p> : null}
      <p className={`${title ? "mt-1" : ""} text-sm text-slate-400`}>{message}</p>
      {actions ? <div className="mt-3 flex items-center justify-center gap-2">{actions}</div> : null}
    </div>
  );
}
