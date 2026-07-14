import type { BusinessPassportSummary } from "@/src/capabilities/institution-wizard/types/BusinessPassportSummary";
import type { BusinessReadiness } from "@/src/capabilities/institution-wizard/types/BusinessReadiness";
import type { ExplanationItem } from "@/src/capabilities/institution-wizard/types/ExplanationItem";
import type { Recommendation } from "@/src/capabilities/institution-wizard/types/Recommendation";
import ExplainabilityPanel from "@/src/capabilities/institution-wizard/components/ExplainabilityPanel";
import ReadinessCard from "@/src/capabilities/institution-wizard/components/ReadinessCard";
import RecommendationPanel from "@/src/capabilities/institution-wizard/components/RecommendationPanel";

type BusinessPassportCardProps = {
  passport: BusinessPassportSummary;
  readiness?: BusinessReadiness;
  explanations?: readonly ExplanationItem[];
  recommendation?: Recommendation;
};

function readinessTone(level: BusinessPassportSummary["businessReadiness"]["level"]): string {
  if (level === "ready") return "border-emerald-700/40 bg-emerald-950/20 text-emerald-200";
  if (level === "conditional") return "border-amber-700/40 bg-amber-950/20 text-amber-200";
  return "border-rose-700/40 bg-rose-950/20 text-rose-200";
}

export default function BusinessPassportCard({
  passport,
  readiness,
  explanations,
  recommendation,
}: BusinessPassportCardProps) {
  return (
    <div className="space-y-2">
      <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
        <header className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">Business Passport</h2>
          <span className={`rounded-full border px-2 py-0.5 text-xs uppercase tracking-[0.12em] ${readinessTone(passport.businessReadiness.level)}`}>
            {passport.businessReadiness.level}
          </span>
        </header>

      <div className="grid gap-2 sm:grid-cols-2">
        <article className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Institution</p>
          <p className="mt-1 text-sm font-medium text-slate-200">{passport.institution}</p>
        </article>
        <article className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Identity</p>
          <p className="mt-1 text-sm font-medium text-slate-200">{passport.identity}</p>
        </article>
        <article className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Confidence</p>
          <p className="mt-1 text-sm font-medium text-cyan-200">{passport.confidence}%</p>
        </article>
        <article className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Business Readiness</p>
          <p className="mt-1 text-sm font-medium text-slate-200">{passport.businessReadiness.score}%</p>
        </article>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Supporting Documents</p>
          <div className="mt-2 space-y-1">
            {passport.supportingDocuments.length === 0 && (
              <p className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1 text-sm text-slate-400">None uploaded.</p>
            )}
            {passport.supportingDocuments.map((item) => (
              <p key={item} className="rounded border border-emerald-700/30 bg-emerald-950/20 px-2 py-1 text-sm text-emerald-200">{item}</p>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Missing Evidence</p>
          <div className="mt-2 space-y-1">
            {passport.missingEvidence.map((item) => (
              <p key={item} className="rounded border border-amber-700/30 bg-amber-950/20 px-2 py-1 text-sm text-amber-200">{item}</p>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Risk</p>
          <div className="mt-2 space-y-1">
            {passport.risk.map((item) => (
              <p key={item} className="rounded border border-rose-700/30 bg-rose-950/20 px-2 py-1 text-sm text-rose-200">{item}</p>
            ))}
          </div>
        </div>
      </div>

        <div className="mt-4 rounded border border-cyan-700/30 bg-cyan-950/20 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-cyan-300">Next Action</p>
          <p className="mt-1 text-sm text-cyan-100">{passport.nextAction}</p>
        </div>
      </section>

      {readiness && <ReadinessCard readiness={readiness} />}
      {explanations && explanations.length > 0 && <ExplainabilityPanel items={explanations} />}
      {recommendation && <RecommendationPanel recommendation={recommendation} />}
    </div>
  );
}