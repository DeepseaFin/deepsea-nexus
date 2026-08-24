import { Activity, BookOpen, CircleCheck, FileText, Network, ShieldAlert } from "lucide-react";
import type { ExplainabilityProjection } from "@/src/capabilities/journey/adapters/getExplainabilityProjection";

interface ExplainabilityPanelProps {
  readonly explainability: ExplainabilityProjection;
  readonly className?: string;
}

function withClassName(base: string, className?: string): string {
  return className ? `${base} ${className}` : base;
}

function EmptyState({ message }: { readonly message: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-400">
      {message}
    </div>
  );
}

export default function ExplainabilityPanel({ explainability, className }: ExplainabilityPanelProps) {
  return (
    <section className={withClassName("rounded-2xl border border-slate-800/90 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(2,6,23,0.92))] p-6 shadow-[0_14px_32px_rgba(2,6,23,0.22)]", className)} aria-label="Explainability panel">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Explainability</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-100">Recommendation Trace</h2>
          <p className="mt-2 text-sm text-slate-400">Canonical explainability projection showing why the recommendation was produced.</p>
        </div>
        <div className="rounded-full border border-cyan-700/40 bg-cyan-950/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200">
          Confidence {explainability.overallConfidence}
        </div>
      </header>

      <div className="grid gap-3 xl:grid-cols-2">
        <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <CircleCheck className="h-3.5 w-3.5 text-cyan-300" /> Recommendation Summary
          </h3>
          <p className="mt-2 text-sm text-slate-200">{explainability.recommendationTitle}</p>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <Activity className="h-3.5 w-3.5 text-cyan-300" /> Confidence Indicator
          </h3>
          <p className="mt-2 text-sm text-slate-200">Overall recommendation confidence: {explainability.overallConfidence}</p>
        </section>
      </div>

      <section className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          <Network className="h-3.5 w-3.5 text-cyan-300" /> Reasoning Timeline
        </h3>
        {explainability.orderedReasoningPath.length === 0 ? (
          <div className="mt-3">
            <EmptyState message="No explainability path nodes are available." />
          </div>
        ) : (
          <ol className="mt-3 space-y-2">
            {explainability.orderedReasoningPath.map((node) => (
              <li key={`${node.index}-${node.title}`} className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-slate-200">
                    {node.index}. {node.title}
                  </p>
                  <span className="text-xs text-cyan-200">{node.confidencePercent}</span>
                </div>
                <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-slate-500">{node.type}</p>
                <p className="mt-1 text-xs text-slate-400">{node.description}</p>
              </li>
            ))}
          </ol>
        )}
      </section>

      <div className="mt-4 grid gap-3 xl:grid-cols-2">
        <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <ShieldAlert className="h-3.5 w-3.5 text-cyan-300" /> Supporting Risk Summary
          </h3>
          {explainability.supportingRisks.length === 0 ? (
            <div className="mt-3">
              <EmptyState message="No supporting risks are currently attached." />
            </div>
          ) : (
            <ul className="mt-3 space-y-2">
              {explainability.supportingRisks.map((risk) => (
                <li key={risk.id} className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-slate-200">{risk.title}</p>
                    <span className="text-xs text-cyan-200">{risk.confidencePercent}</span>
                  </div>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-slate-500">{risk.severity}</p>
                  <p className="mt-1 text-xs text-slate-400">{risk.description}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Health Summary</h3>
          {explainability.institutionHealthDimensions.length === 0 ? (
            <div className="mt-3">
              <EmptyState message="No supporting health dimensions are currently attached." />
            </div>
          ) : (
            <ul className="mt-3 space-y-2">
              {explainability.institutionHealthDimensions.map((dimension) => (
                <li key={`${dimension.type}-${dimension.summary}`} className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                  <p className="text-sm font-medium text-slate-200">{dimension.type}</p>
                  <p className="mt-1 text-xs text-slate-400">{dimension.summary}</p>
                  <p className="mt-1 text-xs text-cyan-200">Status {dimension.status} | Score {dimension.scorePercent} | Confidence {dimension.confidencePercent}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Business Signals</h3>
          {explainability.businessSignals.length === 0 ? (
            <div className="mt-3">
              <EmptyState message="No supporting business signals are currently attached." />
            </div>
          ) : (
            <ul className="mt-3 space-y-2">
              {explainability.businessSignals.map((signal) => (
                <li key={signal.id} className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-slate-200">{signal.title}</p>
                    <span className="text-xs text-cyan-200">{signal.confidencePercent}</span>
                  </div>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-slate-500">{signal.severity}</p>
                  <p className="mt-1 text-xs text-slate-400">{signal.description}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <BookOpen className="h-3.5 w-3.5 text-cyan-300" /> Knowledge References
          </h3>
          {explainability.knowledgeReferences.length === 0 ? (
            <div className="mt-3">
              <EmptyState message="No supporting knowledge references are currently attached." />
            </div>
          ) : (
            <ul className="mt-3 space-y-2">
              {explainability.knowledgeReferences.map((reference) => (
                <li key={`${reference.knowledgeId}-${reference.factName}`} className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                  <p className="text-sm font-medium text-slate-200">{reference.factName}</p>
                  <p className="mt-1 text-xs text-slate-400">{reference.factValue}</p>
                  <p className="mt-1 text-xs text-cyan-200">{reference.confidencePercent} | {reference.verificationSource}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 xl:col-span-2">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <FileText className="h-3.5 w-3.5 text-cyan-300" /> Evidence References
          </h3>
          {explainability.evidenceReferences.length === 0 ? (
            <div className="mt-3">
              <EmptyState message="No supporting evidence references are currently attached." />
            </div>
          ) : (
            <ul className="mt-3 grid gap-2 md:grid-cols-2">
              {explainability.evidenceReferences.map((reference) => (
                <li key={reference.evidenceId} className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                  <p className="text-sm font-medium text-slate-200">{reference.documentVersion}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {reference.evidenceType} | {reference.status} | {reference.source}
                  </p>
                  <p className="mt-1 text-xs text-cyan-200">{reference.referenceCount} linked references</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Explainability Metadata</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">Recommendation ID: {explainability.explanationMetadata.recommendationId}</p>
          <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">Recommendation Type: {explainability.explanationMetadata.recommendationType}</p>
          <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">Recommendation Priority: {explainability.explanationMetadata.recommendationPriority}</p>
          <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">Path Nodes: {explainability.explanationMetadata.pathNodeCount}</p>
          <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">Risks: {explainability.explanationMetadata.supportingRiskCount}</p>
          <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">Health Dimensions: {explainability.explanationMetadata.supportingHealthDimensionCount}</p>
          <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">Profile Dimensions: {explainability.explanationMetadata.supportingProfileDimensionCount}</p>
          <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">Business Signals: {explainability.explanationMetadata.supportingBusinessSignalCount}</p>
          <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">Institutional Facts: {explainability.explanationMetadata.supportingFactCount}</p>
          <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">Knowledge References: {explainability.explanationMetadata.supportingKnowledgeCount}</p>
          <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">Evidence References: {explainability.explanationMetadata.supportingEvidenceCount}</p>
        </div>
      </section>
    </section>
  );
}
