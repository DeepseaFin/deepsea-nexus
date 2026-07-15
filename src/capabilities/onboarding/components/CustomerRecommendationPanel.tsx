import type { CustomerRecommendation } from "@/src/capabilities/onboarding/types/CustomerOnboardingState";

type CustomerRecommendationPanelProps = {
  readonly recommendations: readonly CustomerRecommendation[];
};

function tone(priority: CustomerRecommendation["priority"]): string {
  if (priority === "high") return "text-rose-300";
  if (priority === "medium") return "text-amber-300";
  return "text-cyan-300";
}

export default function CustomerRecommendationPanel({ recommendations }: CustomerRecommendationPanelProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Recommendation Panel</h2>
      <div className="mt-3 space-y-2">
        {recommendations.map((recommendation) => (
          <article key={recommendation.id} className="rounded border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-sm font-semibold text-slate-100">{recommendation.title}</p>
            <p className="mt-1 text-xs text-slate-400">{recommendation.detail}</p>
            <p className={["mt-2 text-xs uppercase tracking-[0.12em]", tone(recommendation.priority)].join(" ")}>{recommendation.priority}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
