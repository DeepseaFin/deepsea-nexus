import AIConfidenceBadge from "@/components/ui/AIConfidenceBadge";
import UICard from "@/components/ui/Card";

export interface KnowledgeSignal {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly confidence: number;
}

export interface KnowledgeSnapshotProps {
  readonly signals: readonly KnowledgeSignal[];
}

export default function KnowledgeSnapshot({ signals }: KnowledgeSnapshotProps) {
  return (
    <UICard variant="subtle" className="p-5 sm:p-6">
      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">Knowledge Snapshot</h3>
      <div className="mt-4 space-y-2.5">
        {signals.map((signal) => (
          <article key={signal.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-sm font-medium text-slate-100">{signal.title}</h4>
                <p className="mt-1 text-xs text-slate-400">{signal.detail}</p>
              </div>
              <AIConfidenceBadge score={signal.confidence} label="Signal" />
            </div>
          </article>
        ))}
      </div>
    </UICard>
  );
}
