import type { ExposureLimitItem } from "@/src/capabilities/treasury/types/TreasuryWorkspaceState";

type ExposureLimitsProps = {
  readonly items: readonly ExposureLimitItem[];
};

export default function ExposureLimits({ items }: ExposureLimitsProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Exposure Limits</h2>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <article key={item.id} className="rounded border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-sm font-semibold text-slate-100">{item.dimension}</p>
            <p className="mt-1 text-xs text-slate-400">Utilization: {item.utilization}</p>
            <p className="mt-1 text-xs text-slate-400">Limit: {item.limit}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.12em] text-cyan-300">{item.status}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
