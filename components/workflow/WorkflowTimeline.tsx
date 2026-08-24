import EmptyState from "@/components/ui/EmptyState";
import SectionCard from "@/components/ui/SectionCard";
import type { WorkflowPresentationModel } from "@/lib/workflow/presentation/WorkflowPresentationModel";

export interface WorkflowTimelineProps {
  readonly presentation: WorkflowPresentationModel;
}

export default function WorkflowTimeline({ presentation }: WorkflowTimelineProps) {
  return (
    <SectionCard title="Timeline" subtitle="Chronological workflow history">
      {presentation.timeline.length === 0 ? (
        <EmptyState title="No timeline entries" description="No workflow events are currently available." />
      ) : (
        <ol className="space-y-2">
          {presentation.timeline.map((entry) => (
            <li key={entry.eventId} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-slate-100">{entry.typeLabel}</p>
                  <p className="mt-1 text-xs text-slate-400">{entry.message}</p>
                </div>
                <p className="text-xs text-slate-500">{entry.occurredAtDisplay}</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                <span>{entry.actorLabel}</span>
                {entry.stageChangeLabel ? <span>{entry.stageChangeLabel}</span> : null}
                {entry.taskId ? <span>Task: {entry.taskId}</span> : null}
                {entry.milestoneId ? <span>Milestone: {entry.milestoneId}</span> : null}
              </div>
            </li>
          ))}
        </ol>
      )}
    </SectionCard>
  );
}
