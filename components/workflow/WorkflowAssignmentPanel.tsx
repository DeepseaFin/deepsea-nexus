import SectionCard from "@/components/ui/SectionCard";
import StatusChip from "@/components/ui/StatusChip";
import type { WorkflowPresentationModel } from "@/lib/workflow/presentation/WorkflowPresentationModel";

export interface WorkflowAssignmentPanelProps {
  readonly presentation: WorkflowPresentationModel;
}

interface AssignmentRow {
  readonly owner: string;
  readonly taskCount: number;
}

function buildAssignmentRows(presentation: WorkflowPresentationModel): readonly AssignmentRow[] {
  const counter = new Map<string, number>();

  for (const task of presentation.tasks) {
    const key = task.assignmentLabel;
    counter.set(key, (counter.get(key) ?? 0) + 1);
  }

  return [...counter.entries()]
    .map(([owner, taskCount]) => ({ owner, taskCount }))
    .sort((left, right) => right.taskCount - left.taskCount || left.owner.localeCompare(right.owner));
}

export default function WorkflowAssignmentPanel({ presentation }: WorkflowAssignmentPanelProps) {
  const assignmentRows = buildAssignmentRows(presentation);

  return (
    <SectionCard title="Assignments" subtitle={presentation.assignmentCountLabel}>
      {assignmentRows.length === 0 ? (
        <p className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-sm text-slate-400">
          No assignment details are currently available.
        </p>
      ) : (
        <ul className="space-y-2">
          {assignmentRows.map((row) => (
            <li key={row.owner} className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
              <p className="text-sm text-slate-100">{row.owner}</p>
              <StatusChip label={`${row.taskCount} task(s)`} variant={row.owner === "Unassigned" ? "warning" : "info"} />
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
