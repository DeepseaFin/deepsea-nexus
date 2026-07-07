'use client';

type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

const toneClasses: Record<StatusTone, string> = {
  neutral: 'border-slate-700 bg-slate-900 text-slate-200',
  success: 'border-emerald-700/50 bg-emerald-950/40 text-emerald-200',
  warning: 'border-amber-700/50 bg-amber-950/40 text-amber-200',
  danger: 'border-rose-700/50 bg-rose-950/40 text-rose-200',
  info: 'border-cyan-700/50 bg-cyan-950/40 text-cyan-200',
};

export default function StatusBadge({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: StatusTone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${toneClasses[tone]}`}
    >
      {label}
    </span>
  );
}
