"use client";

import WorkflowAssignmentPanel from "@/components/workflow/WorkflowAssignmentPanel";
import WorkflowHeader from "@/components/workflow/WorkflowHeader";
import WorkflowMilestonePanel from "@/components/workflow/WorkflowMilestonePanel";
import WorkflowStageTracker from "@/components/workflow/WorkflowStageTracker";
import WorkflowSummaryPanel from "@/components/workflow/WorkflowSummaryPanel";
import WorkflowTaskBoard from "@/components/workflow/WorkflowTaskBoard";
import WorkflowTimeline from "@/components/workflow/WorkflowTimeline";
import SectionCard from "@/components/ui/SectionCard";
import { PanelEmptyState } from "@/components/customer/shared/PanelFeedback";
import type { WorkflowPresentationModel } from "@/lib/workflow/presentation/WorkflowPresentationModel";

export interface WorkflowWorkspaceProps {
  readonly presentation?: WorkflowPresentationModel | null;
  readonly className?: string;
  readonly emptyMessage?: string;
}

export default function WorkflowWorkspace({
  presentation,
  className = "",
  emptyMessage = "Workflow presentation data is not available in this workspace.",
}: WorkflowWorkspaceProps) {
  if (!presentation) {
    return (
      <SectionCard title="Workflow" subtitle="No workflow data is currently available">
        <PanelEmptyState message={emptyMessage} />
      </SectionCard>
    );
  }

  return (
    <section className={`space-y-5 ${className}`.trim()} aria-label="Workflow workspace">
      <WorkflowHeader presentation={presentation} />

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <WorkflowStageTracker presentation={presentation} />
          <WorkflowSummaryPanel presentation={presentation} />
          <WorkflowTaskBoard presentation={presentation} />
          <WorkflowTimeline presentation={presentation} />
        </div>

        <aside className="space-y-5">
          <WorkflowAssignmentPanel presentation={presentation} />
          <WorkflowMilestonePanel presentation={presentation} />
        </aside>
      </div>

      {presentation.validationWarnings.length > 0 ? (
        <section
          aria-label="Workflow validation warnings"
          className="rounded-2xl border border-amber-700/50 bg-amber-900/20 p-4"
        >
          <h3 className="text-sm font-semibold text-amber-200">Validation Warnings</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-100">
            {presentation.validationWarnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </section>
  );
}
