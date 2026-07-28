import SectionCard from "@/components/ui/SectionCard";
import StatusChip from "@/components/ui/StatusChip";
import type { ActivityPresentationModel } from "@/lib/activity/presentation/ActivityPresentationModel";

export interface ActivityHeaderProps {
  readonly presentation: ActivityPresentationModel;
}

export default function ActivityHeader({ presentation }: ActivityHeaderProps) {
  return (
    <SectionCard
      title="Institutional Activity"
      subtitle={presentation.summary.totalActivitiesLabel}
      actions={<StatusChip label={presentation.totalLabel} variant="info" />}
    >
      <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
          <dt className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Generated</dt>
          <dd className="mt-1 text-sm text-slate-100">{presentation.generatedAtDisplay}</dd>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
          <dt className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Acknowledged</dt>
          <dd className="mt-1 text-sm text-slate-100">{presentation.summary.acknowledgedActivitiesLabel}</dd>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
          <dt className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Unacknowledged</dt>
          <dd className="mt-1 text-sm text-slate-100">{presentation.summary.unacknowledgedActivitiesLabel}</dd>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
          <dt className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Critical</dt>
          <dd className="mt-1 text-sm text-slate-100">{presentation.summary.criticalActivitiesLabel}</dd>
        </div>
      </dl>
    </SectionCard>
  );
}
