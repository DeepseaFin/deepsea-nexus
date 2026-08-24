import type { RecommendedActionsProps } from "./types";

const DEFAULT_ITEMS = [
  {
    title: "Recommended Action Placeholder A",
    rationale: "Align stakeholders on mission-level operating cadence.",
  },
  {
    title: "Recommended Action Placeholder B",
    rationale: "Prepare documents for upcoming governance review.",
  },
  {
    title: "Recommended Action Placeholder C",
    rationale: "Schedule checkpoint for institutional risk visibility.",
  },
] as const;

function withClassName(base: string, className?: string): string {
  return className ? `${base} ${className}` : base;
}

export function RecommendedActions({ items = DEFAULT_ITEMS, className }: RecommendedActionsProps) {
  return (
    <section className={withClassName("space-y-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4", className)}>
      <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">Recommended Actions</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.title} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-sm font-semibold text-slate-100">{item.title}</p>
            <p className="mt-1 text-xs text-slate-400">{item.rationale}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}