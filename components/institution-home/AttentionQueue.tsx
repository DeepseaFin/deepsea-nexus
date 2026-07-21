import type { AttentionQueueProps } from "./types";

const DEFAULT_ITEMS = [
  {
    title: "Attention Item Placeholder A",
    detail: "Review pending institutional alignment notes.",
  },
  {
    title: "Attention Item Placeholder B",
    detail: "Confirm mission dependency checkpoint status.",
  },
  {
    title: "Attention Item Placeholder C",
    detail: "Validate readiness for next operational milestone.",
  },
] as const;

function withClassName(base: string, className?: string): string {
  return className ? `${base} ${className}` : base;
}

export function AttentionQueue({ items = DEFAULT_ITEMS, className }: AttentionQueueProps) {
  return (
    <section className={withClassName("space-y-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4", className)}>
      <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">Attention Queue</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.title} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-sm font-semibold text-slate-100">{item.title}</p>
            <p className="mt-1 text-xs text-slate-400">{item.detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}