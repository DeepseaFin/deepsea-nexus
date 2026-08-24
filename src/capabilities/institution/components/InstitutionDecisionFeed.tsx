import type { InstitutionDecisionItem } from "@/src/capabilities/institution/types/InstitutionWorkspaceState";

type InstitutionDecisionFeedProps = {
  readonly decisions: readonly InstitutionDecisionItem[];
};

export default function InstitutionDecisionFeed({ decisions }: InstitutionDecisionFeedProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Institution Decision Feed</h2>
      <div className="mt-3 space-y-2">
        {decisions.map((decision) => (
          <article key={decision.id} className="rounded border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-sm font-semibold text-slate-100">{decision.title}</p>
            <p className="mt-1 text-xs text-slate-400">Outcome: {decision.outcome}</p>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span>{decision.owner}</span>
              <span>{decision.decidedAt}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
