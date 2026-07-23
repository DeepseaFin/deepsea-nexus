import { BadgeCheck, ShieldAlert, Sparkles } from "lucide-react";
import type { ExecutiveDecisionProjection } from "@/src/capabilities/journey/adapters/getExecutiveDecisionProjection";

interface ExecutiveDecisionPanelProps {
  readonly decision: ExecutiveDecisionProjection;
  readonly className?: string;
}

function withClassName(base: string, className?: string): string {
  return className ? `${base} ${className}` : base;
}

function Field({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-slate-200">{value}</p>
    </div>
  );
}

export default function ExecutiveDecisionPanel({ decision, className }: ExecutiveDecisionPanelProps) {
  return (
    <section className={withClassName("rounded-2xl border border-slate-800/90 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(2,6,23,0.92))] p-6 shadow-[0_14px_32px_rgba(2,6,23,0.22)]", className)} aria-label="Executive decision panel">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Institutional Decision</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-100">Executive Decision Panel</h2>
          <p className="mt-2 text-sm text-slate-400">Canonical decision-package summary for institutional decision readiness.</p>
        </div>
        <div className="rounded-full border border-cyan-700/40 bg-cyan-950/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200">
          {decision.decisionStatus}
        </div>
      </header>

      <div className="grid gap-3 xl:grid-cols-2">
        <Field label="Institution Summary" value={decision.institutionSummary} />
        <Field label="Overall Confidence" value={decision.overallConfidence} />
        <Field label="Decision Status" value={decision.decisionStatus} />
        <Field label="Recommendation" value={decision.recommendation} />
        <Field label="Recommendation Priority" value={decision.recommendationPriority} />
        <Field label="Top Risk Summary" value={decision.topRiskSummary} />
        <Field label="Institution Health Summary" value={decision.institutionHealthSummary} />
        <Field label="Pipeline Version" value={decision.pipelineVersion} />
        <Field label="Decision Package Version" value={decision.decisionPackageVersion} />
        <Field label="Generated Timestamp" value={decision.generatedTimestamp} />
      </div>

      <section className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          <Sparkles className="h-3.5 w-3.5 text-cyan-300" /> Next Recommended Action
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-200">{decision.nextRecommendedAction}</p>
      </section>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/70 px-2 py-1">
          <BadgeCheck className="h-3 w-3 text-cyan-300" /> Canonical Package
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/70 px-2 py-1">
          <ShieldAlert className="h-3 w-3 text-cyan-300" /> Presentation Projection
        </span>
      </div>
    </section>
  );
}
