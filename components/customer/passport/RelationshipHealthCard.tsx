import AIConfidenceBadge from "@/components/ui/AIConfidenceBadge";
import StatusChip from "@/components/ui/StatusChip";
import UICard from "@/components/ui/Card";

export interface RelationshipHealthCardProps {
  readonly healthScore: number;
  readonly posture: string;
  readonly watchItems: string;
  readonly covenantState: string;
}

export default function RelationshipHealthCard({
  healthScore,
  posture,
  watchItems,
  covenantState,
}: RelationshipHealthCardProps) {
  return (
    <UICard variant="subtle" className="p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">Relationship Health</h3>
        <AIConfidenceBadge score={healthScore} label="Health" />
      </div>

      <div className="mt-4 space-y-2.5">
        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2.5">
          <p className="text-sm text-slate-300">Portfolio Posture</p>
          <StatusChip label={posture} variant="success" />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2.5">
          <p className="text-sm text-slate-300">Watch Items</p>
          <p className="text-sm font-semibold text-slate-100">{watchItems}</p>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2.5">
          <p className="text-sm text-slate-300">Covenant State</p>
          <p className="text-sm font-semibold text-slate-100">{covenantState}</p>
        </div>
      </div>
    </UICard>
  );
}
