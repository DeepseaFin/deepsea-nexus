import UICard from "@/components/ui/Card";
import StatusChip from "@/components/ui/StatusChip";

export interface AIInsightPlaceholderPanelProps {
  readonly title?: string;
  readonly summary?: string;
  readonly readinessSignals?: readonly string[];
}

export default function AIInsightPlaceholderPanel({
  title = "AI Insight Placeholder",
  summary = "This panel is reserved for explainable AI recommendations once domain services are connected.",
  readinessSignals = ["Data Contract Ready", "Evidence Anchoring Required", "Human Review Gate Enabled"],
}: AIInsightPlaceholderPanelProps) {
  return (
    <UICard variant="ai" className="p-5 sm:p-6" aria-label="AI insight placeholder">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-100">{title}</h3>
        <StatusChip label="Ready for Integration" variant="info" />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-200">{summary}</p>
      <ul className="mt-4 space-y-2 text-xs text-slate-300">
        {readinessSignals.map((signal) => (
          <li key={signal} className="rounded-lg border border-cyan-800/40 bg-slate-950/40 px-3 py-2">
            {signal}
          </li>
        ))}
      </ul>
    </UICard>
  );
}
