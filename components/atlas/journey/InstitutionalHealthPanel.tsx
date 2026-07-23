import { Activity, ShieldCheck, ShieldAlert } from "lucide-react";
import type { InstitutionalHealthProjection } from "@/src/capabilities/journey/adapters/getInstitutionalHealthProjection";

interface InstitutionalHealthPanelProps {
  readonly health: InstitutionalHealthProjection;
  readonly className?: string;
}

function withClassName(base: string, className?: string): string {
  return className ? `${base} ${className}` : base;
}

function EmptyMessage({ message }: { readonly message: string }) {
  return (
    <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-400">
      {message}
    </p>
  );
}

export default function InstitutionalHealthPanel({ health, className }: InstitutionalHealthPanelProps) {
  return (
    <section className={withClassName("rounded-2xl border border-slate-800/90 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(2,6,23,0.92))] p-6 shadow-[0_14px_32px_rgba(2,6,23,0.22)]", className)} aria-label="Institutional health panel">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Institution Health</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-100">Canonical Health Summary</h2>
          <p className="mt-2 text-sm text-slate-400">Institutional health status projected directly from canonical health artifacts.</p>
        </div>
        <div className="rounded-full border border-cyan-700/40 bg-cyan-950/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200">
          {health.overallStatus}
        </div>
      </header>

      <div className="grid gap-3 xl:grid-cols-3">
        <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Overall Health Score</p>
          <p className="mt-2 text-2xl font-semibold text-slate-100">{health.overallHealthScore}</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Health Grade</p>
          <p className="mt-2 text-2xl font-semibold text-slate-100">{health.overallHealthGrade}</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Last Evaluation Timestamp</p>
          <p className="mt-2 text-sm text-slate-200">{health.evaluationTimestamp}</p>
        </article>
      </div>

      <section className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Health Dimension Breakdown</h3>
        {health.healthDimensions.length === 0 ? (
          <div className="mt-3">
            <EmptyMessage message="No health dimensions are currently available." />
          </div>
        ) : (
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {health.healthDimensions.map((dimension) => (
              <li key={`${dimension.type}-${dimension.category}`} className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-200">{dimension.type}</p>
                  <span className="text-xs text-cyan-200">{dimension.status}</span>
                </div>
                <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-slate-500">{dimension.category}</p>
                <p className="mt-1 text-xs text-slate-400">{dimension.summary}</p>
                <p className="mt-1 text-xs text-cyan-200">Score {dimension.score} | Confidence {dimension.confidence}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-4 grid gap-3 xl:grid-cols-2">
        <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" /> Positive Indicators
          </h3>
          {health.positiveIndicators.length === 0 ? (
            <div className="mt-3">
              <EmptyMessage message="No positive indicators are currently listed." />
            </div>
          ) : (
            <ul className="mt-3 space-y-2">
              {health.positiveIndicators.map((indicator) => (
                <li key={indicator} className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-200">
                  {indicator}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <ShieldAlert className="h-3.5 w-3.5 text-cyan-300" /> Areas Requiring Attention
          </h3>
          {health.attentionRequired.length === 0 ? (
            <div className="mt-3">
              <EmptyMessage message="No attention-required indicators are currently listed." />
            </div>
          ) : (
            <ul className="mt-3 space-y-2">
              {health.attentionRequired.map((indicator) => (
                <li key={indicator} className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-200">
                  {indicator}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          <Activity className="h-3.5 w-3.5 text-cyan-300" /> Metadata
        </h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">Health ID: {health.healthMetadata.healthId}</p>
          <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">Overall Confidence: {health.healthMetadata.overallConfidence}</p>
          <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">Dimension Count: {health.healthMetadata.dimensionCount}</p>
        </div>
      </section>
    </section>
  );
}
