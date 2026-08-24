import React from "react";

type StatusVariant = "default" | "success" | "warning" | "danger" | "info";

const variantClasses: Readonly<Record<StatusVariant, string>> = {
  default: "border-slate-700 bg-slate-900 text-slate-200",
  success: "border-emerald-700/50 bg-emerald-900/40 text-emerald-200",
  warning: "border-amber-700/50 bg-amber-900/40 text-amber-200",
  danger: "border-rose-700/50 bg-rose-900/40 text-rose-200",
  info: "border-cyan-700/50 bg-cyan-900/40 text-cyan-200",
};

export interface StatusChipProps {
  readonly label: string;
  readonly variant?: StatusVariant;
}

export default function StatusChip({ label, variant = "default" }: StatusChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${variantClasses[variant]}`}
    >
      {label}
    </span>
  );
}
