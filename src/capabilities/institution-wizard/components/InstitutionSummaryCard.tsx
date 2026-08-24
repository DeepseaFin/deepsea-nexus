import type { InstitutionUnderstanding } from "@/src/capabilities/institution-wizard/types/InstitutionUnderstanding";

type InstitutionSummaryCardProps = {
  understanding: InstitutionUnderstanding;
};

function confidenceTone(level: InstitutionUnderstanding["confidence"]["level"]): string {
  if (level === "high") return "border-emerald-700/40 bg-emerald-950/20 text-emerald-200";
  if (level === "medium") return "border-cyan-700/40 bg-cyan-950/20 text-cyan-200";
  return "border-amber-700/40 bg-amber-950/20 text-amber-200";
}

function riskTone(severity: "low" | "medium" | "high"): string {
  if (severity === "high") return "border-rose-700/40 bg-rose-950/20 text-rose-200";
  if (severity === "medium") return "border-amber-700/40 bg-amber-950/20 text-amber-200";
  return "border-emerald-700/40 bg-emerald-950/20 text-emerald-200";
}

export default function InstitutionSummaryCard({ understanding }: InstitutionSummaryCardProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Institution Summary</h2>
        <span className={`rounded-full border px-2 py-0.5 text-xs uppercase tracking-[0.12em] ${confidenceTone(understanding.confidence.level)}`}>
          {understanding.confidence.score}%
        </span>
      </header>

      <div className="grid gap-2 sm:grid-cols-2">
        <article className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Institution Name</p>
          <p className="mt-1 text-sm font-medium text-slate-200">{understanding.institutionName}</p>
        </article>
        <article className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Jurisdiction</p>
          <p className="mt-1 text-sm font-medium text-slate-200">{understanding.jurisdiction}</p>
        </article>
        <article className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Legal Form</p>
          <p className="mt-1 text-sm font-medium text-slate-200">{understanding.legalForm}</p>
        </article>
        <article className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Business Activity</p>
          <p className="mt-1 text-sm font-medium text-slate-200">{understanding.businessActivity}</p>
        </article>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Supporting Documents</p>
          <div className="mt-2 space-y-1">
            {understanding.supportingDocuments.length === 0 && (
              <p className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1 text-sm text-slate-400">None uploaded.</p>
            )}
            {understanding.supportingDocuments.map((item) => (
              <p key={item} className="rounded border border-emerald-700/30 bg-emerald-950/20 px-2 py-1 text-sm text-emerald-200">{item}</p>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Missing Evidence</p>
          <div className="mt-2 space-y-1">
            {understanding.missingEvidence.map((item) => (
              <p key={item} className="rounded border border-amber-700/30 bg-amber-950/20 px-2 py-1 text-sm text-amber-200">{item}</p>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Potential Risks</p>
          <div className="mt-2 space-y-1">
            {understanding.potentialRisks.map((risk) => (
              <p key={risk.title} className={`rounded border px-2 py-1 text-sm ${riskTone(risk.severity)}`}>
                {risk.title}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}