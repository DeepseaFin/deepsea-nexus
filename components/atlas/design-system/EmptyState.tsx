'use client';

import { DatabaseZap } from 'lucide-react';

export default function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
}: {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/60 p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 bg-slate-950">
        <DatabaseZap className="h-5 w-5 text-cyan-300" />
      </div>
      <p className="mt-4 text-base font-semibold text-slate-100">{title}</p>
      <p className="mx-auto mt-2 max-w-lg text-sm text-slate-400">{message}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 rounded-lg border border-cyan-700/40 bg-cyan-950/30 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-900/50"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
