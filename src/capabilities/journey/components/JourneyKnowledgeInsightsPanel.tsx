import { BrainCircuit, CircleAlert, FileQuestion, Landmark } from "lucide-react";
import type {
  JourneyKnowledgeInsightsViewModel,
} from "@/src/capabilities/journey/adapters/getJourneyKnowledgeInsightsProjection";

type JourneyKnowledgeInsightsPanelProps = {
  readonly insights: JourneyKnowledgeInsightsViewModel;
};

function SectionHeader({
}: {
  readonly title?: string;
  readonly description?: string;
}) {
  return (
    <header className="mb-4 flex items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Knowledge Insights</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-100">Institutional Intelligence Summary</h2>
        <p className="mt-2 text-sm text-slate-400">Projection-backed knowledge distilled into executive-facing operational insights.</p>
      </div>
      <div className="rounded-full border border-cyan-700/40 bg-cyan-950/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200">
        Action Placeholder
      </div>
    </header>
  );
}

function EmptyHint({ message }: { readonly message: string }) {
  return (
    <p className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-400">
      {message}
    </p>
  );
}

export default function JourneyKnowledgeInsightsPanel({ insights }: JourneyKnowledgeInsightsPanelProps) {
  return (
    <section className="rounded-2xl border border-slate-800/90 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(2,6,23,0.92))] p-6 shadow-[0_14px_32px_rgba(2,6,23,0.22)]">
      <SectionHeader
      />

      <div className="grid gap-3 xl:grid-cols-2">
        <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <BrainCircuit className="h-3.5 w-3.5 text-cyan-300" /> Key Business Facts
          </h3>
          {insights.keyBusinessFacts.length === 0 ? (
            <div className="mt-3">
              <EmptyHint message="No key business facts available from current knowledge projection." />
            </div>
          ) : (
            <ul className="mt-3 space-y-2">
              {insights.keyBusinessFacts.map((fact) => (
                <li key={`${fact.factName}-${fact.factValue}`} className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{fact.factName}</p>
                  <p className="mt-1 text-sm font-medium text-slate-200">{fact.factValue}</p>
                  <p className="mt-1 text-xs text-cyan-200">Confidence {fact.confidence}%</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <CircleAlert className="h-3.5 w-3.5 text-cyan-300" /> Risk Indicators
          </h3>
          {insights.riskIndicators.length === 0 ? (
            <div className="mt-3">
              <EmptyHint message="No risk indicators flagged by current knowledge validation." />
            </div>
          ) : (
            <ul className="mt-3 space-y-2">
              {insights.riskIndicators.map((risk) => (
                <li key={`${risk.label}-${risk.detail}`} className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                  <p className="text-sm font-medium text-slate-200">{risk.label}</p>
                  <p className="mt-1 text-xs text-slate-400">{risk.detail}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <FileQuestion className="h-3.5 w-3.5 text-cyan-300" /> Missing Information
          </h3>
          {insights.missingInformation.length === 0 ? (
            <div className="mt-3">
              <EmptyHint message="No missing information warnings are currently present." />
            </div>
          ) : (
            <ul className="mt-3 space-y-2">
              {insights.missingInformation.map((item, index) => (
                <li key={`${item.detail}-${index}`} className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                  <p className="text-sm font-medium text-slate-200">{item.label}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.detail}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <Landmark className="h-3.5 w-3.5 text-cyan-300" /> Institutional Observations
          </h3>
          {insights.institutionalObservations.length === 0 ? (
            <div className="mt-3">
              <EmptyHint message="No institutional observations are currently available." />
            </div>
          ) : (
            <ul className="mt-3 space-y-2">
              {insights.institutionalObservations.map((observation) => (
                <li key={`${observation.label}-${observation.detail}`} className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                  <p className="text-sm font-medium text-slate-200">{observation.label}</p>
                  <p className="mt-1 text-xs text-slate-400">{observation.detail}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </section>
  );
}