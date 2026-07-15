import type { ExecutiveDecisionItem } from "@/src/capabilities/executive/types/ExecutiveWorkspaceState";

type ExecutiveDecisionsProps = {
  readonly items: readonly ExecutiveDecisionItem[];
};

export default function ExecutiveDecisions({ items }: ExecutiveDecisionsProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Executive Decisions</h2>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <article key={item.id} className="rounded border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-sm font-semibold text-slate-100">{item.title}</p>
            <p className="mt-1 text-xs text-slate-400">{item.committee}</p>
            <div className="mt-1 flex items-center justify-between text-xs">
              <p className="uppercase tracking-[0.12em] text-cyan-300">{item.outcome}</p>
              <p className="text-slate-500">{item.decidedAt}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
