import type { RecentActivityProps } from "./types";

const DEFAULT_ITEMS = [
  {
    event: "Institutional event placeholder created.",
    timestamp: "Timestamp Placeholder",
  },
  {
    event: "Mission review placeholder completed.",
    timestamp: "Timestamp Placeholder",
  },
  {
    event: "Governance checkpoint placeholder logged.",
    timestamp: "Timestamp Placeholder",
  },
] as const;

function withClassName(base: string, className?: string): string {
  return className ? `${base} ${className}` : base;
}

export function RecentActivity({ items = DEFAULT_ITEMS, className }: RecentActivityProps) {
  return (
    <section className={withClassName("space-y-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4", className)}>
      <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">Recent Activity</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={`${item.event}-${item.timestamp}`} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-sm text-slate-200">{item.event}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{item.timestamp}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}