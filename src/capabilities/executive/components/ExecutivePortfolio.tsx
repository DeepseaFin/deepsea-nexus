import type { ExecutivePortfolioItem } from "@/src/capabilities/executive/types/ExecutiveWorkspaceState";

type ExecutivePortfolioProps = {
  readonly items: readonly ExecutivePortfolioItem[];
};

export default function ExecutivePortfolio({ items }: ExecutivePortfolioProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Executive Portfolio</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="rounded border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{item.segment}</p>
            <p className="mt-1 text-sm font-semibold text-slate-100">Exposure {item.exposure}</p>
            <p className="mt-1 text-xs text-slate-400">Trend: {item.trend}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.1em] text-cyan-300">{item.quality}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
