import type { BusinessReadiness } from "@/src/capabilities/institution-wizard/types/BusinessReadiness";

type ReadinessCardProps = {
  readiness: BusinessReadiness;
};

function statusTone(status: BusinessReadiness["status"]): string {
  if (status === "ready") return "border-emerald-700/40 bg-emerald-950/20 text-emerald-200";
  if (status === "review_required") return "border-amber-700/40 bg-amber-950/20 text-amber-200";
  return "border-rose-700/40 bg-rose-950/20 text-rose-200";
}

export default function ReadinessCard({ readiness }: ReadinessCardProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-100">Business Readiness</h3>
        <span className={`rounded-full border px-2 py-0.5 text-xs uppercase tracking-[0.12em] ${statusTone(readiness.status)}`}>
          {readiness.status}
        </span>
      </header>

      <div className="grid gap-2 sm:grid-cols-2">
        <article className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Readiness Score</p>
          <p className="mt-1 text-sm font-medium text-cyan-200">{readiness.readinessScore}%</p>
        </article>
        <article className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Confidence</p>
          <p className="mt-1 text-sm font-medium text-slate-200">{readiness.confidence}%</p>
        </article>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Missing Evidence</p>
          <div className="mt-2 space-y-1">
            {readiness.missingEvidence.length === 0 && (
              <p className="rounded border border-emerald-700/30 bg-emerald-950/20 px-2 py-1 text-sm text-emerald-200">No missing evidence.</p>
            )}
            {readiness.missingEvidence.map((item) => (
              <p key={item} className="rounded border border-amber-700/30 bg-amber-950/20 px-2 py-1 text-sm text-amber-200">{item}</p>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Manual Review Items</p>
          <div className="mt-2 space-y-1">
            {readiness.manualReviewItems.length === 0 && (
              <p className="rounded border border-emerald-700/30 bg-emerald-950/20 px-2 py-1 text-sm text-emerald-200">No manual review required.</p>
            )}
            {readiness.manualReviewItems.map((item) => (
              <p key={item} className="rounded border border-slate-700/40 bg-slate-950/70 px-2 py-1 text-sm text-slate-200">{item}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}