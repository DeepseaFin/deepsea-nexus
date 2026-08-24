import type { ExplanationItem } from "@/src/capabilities/institution-wizard/types/ExplanationItem";

type ExplainabilityPanelProps = {
  items: readonly ExplanationItem[];
};

function confidenceTone(confidence: number): string {
  if (confidence >= 90) return "text-emerald-200";
  if (confidence >= 80) return "text-cyan-200";
  return "text-amber-200";
}

export default function ExplainabilityPanel({ items }: ExplainabilityPanelProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
      <h3 className="text-base font-semibold text-slate-100">Explainability</h3>

      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <article key={`${item.source}-${item.value}`} className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-slate-100">{item.value}</p>
              <span className={`text-xs font-semibold ${confidenceTone(item.confidence)}`}>{item.confidence}%</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">Source: {item.source}</p>
            <p className="mt-1 text-xs text-slate-300">Reason: {item.reason}</p>
            <p className="mt-1 text-xs text-slate-500">
              Supporting Evidence: {item.supportingEvidence.map((evidence) => evidence.source).join(", ")}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}