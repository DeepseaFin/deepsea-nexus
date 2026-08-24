import React from "react";
import { Inbox } from "lucide-react";

export interface EmptyStateProps {
  readonly title: string;
  readonly description: string;
  readonly action?: React.ReactNode;
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-6 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-900">
        <Inbox className="h-4 w-4 text-slate-400" aria-hidden="true" />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-slate-100">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </section>
  );
}
