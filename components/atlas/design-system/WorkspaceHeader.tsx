'use client';

import StatusBadge from './StatusBadge';
import QuickActionBar, { type QuickAction } from './QuickActionBar';

type HeaderField = {
  label: string;
  value: string;
};

export default function WorkspaceHeader({
  title,
  subtitle,
  status,
  fields = [],
  actions = [],
}: {
  title: string;
  subtitle: string;
  status?: { label: string; tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' };
  fields?: HeaderField[];
  actions?: QuickAction[];
}) {
  return (
    <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Workspace Header</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-100">{title}</h1>
          <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
        </div>
        {status ? <StatusBadge label={status.label} tone={status.tone ?? 'neutral'} /> : null}
      </div>

      {actions.length > 0 ? <QuickActionBar actions={actions} /> : null}

      {fields.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {fields.map((item) => (
            <div key={item.label} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">{item.label}</p>
              <p className="mt-1 text-sm font-semibold text-slate-100">{item.value}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
