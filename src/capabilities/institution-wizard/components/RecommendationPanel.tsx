import type { Recommendation } from "@/src/capabilities/institution-wizard/types/Recommendation";

type RecommendationPanelProps = {
  recommendation: Recommendation;
};

export default function RecommendationPanel({ recommendation }: RecommendationPanelProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
      <h3 className="text-base font-semibold text-slate-100">Recommendations</h3>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Missing Documents</p>
          <div className="mt-2 space-y-1">
            {recommendation.missingDocuments.length === 0 && (
              <p className="rounded border border-emerald-700/30 bg-emerald-950/20 px-2 py-1 text-sm text-emerald-200">No missing documents.</p>
            )}
            {recommendation.missingDocuments.map((item) => (
              <p key={item} className="rounded border border-amber-700/30 bg-amber-950/20 px-2 py-1 text-sm text-amber-200">{item}</p>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Manual Reviews</p>
          <div className="mt-2 space-y-1">
            {recommendation.manualReviews.length === 0 && (
              <p className="rounded border border-emerald-700/30 bg-emerald-950/20 px-2 py-1 text-sm text-emerald-200">No manual reviews.</p>
            )}
            {recommendation.manualReviews.map((item) => (
              <p key={item} className="rounded border border-slate-700/40 bg-slate-950/70 px-2 py-1 text-sm text-slate-200">{item}</p>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Next Action</p>
          <p className="mt-2 rounded border border-cyan-700/30 bg-cyan-950/20 px-2 py-2 text-sm text-cyan-100">{recommendation.nextAction}</p>
        </div>
      </div>
    </section>
  );
}