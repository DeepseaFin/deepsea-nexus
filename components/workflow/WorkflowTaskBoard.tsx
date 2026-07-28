import EmptyState from "@/components/ui/EmptyState";
import SectionCard from "@/components/ui/SectionCard";
import StatusChip from "@/components/ui/StatusChip";
import type { WorkflowPresentationModel } from "@/lib/workflow/presentation/WorkflowPresentationModel";

export interface WorkflowTaskBoardProps {
  readonly presentation: WorkflowPresentationModel;
}

function toStatusVariant(
  tone: WorkflowPresentationModel["tasks"][number]["statusTone"],
): "default" | "info" | "success" | "warning" | "danger" {
  if (tone === "neutral") {
    return "default";
  }

  return tone;
}

function toPriorityVariant(
  tone: WorkflowPresentationModel["tasks"][number]["priorityTone"],
): "default" | "info" | "success" | "warning" | "danger" {
  if (tone === "neutral") {
    return "default";
  }

  return tone;
}

export default function WorkflowTaskBoard({ presentation }: WorkflowTaskBoardProps) {
  const activeTasks = presentation.tasks.filter(
    (task) => task.statusTone !== "success" && task.statusTone !== "danger",
  );
  const closedTasks = presentation.tasks.filter(
    (task) => task.statusTone === "success" || task.statusTone === "danger",
  );

  return (
    <SectionCard title="Task Board" subtitle={`${presentation.tasks.length} task(s) across active and completed lanes`}>
      {presentation.tasks.length === 0 ? (
        <EmptyState title="No tasks" description="This workflow does not currently contain any task entries." />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          <section aria-label="Active tasks" className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Active</h4>
            {activeTasks.length === 0 ? (
              <p className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-sm text-slate-400">
                No active tasks.
              </p>
            ) : (
              <ul className="space-y-2">
                {activeTasks.map((task) => (
                  <li key={task.taskId} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-slate-100">{task.title}</p>
                        {task.description ? <p className="mt-1 text-xs text-slate-400">{task.description}</p> : null}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <StatusChip label={task.statusLabel} variant={toStatusVariant(task.statusTone)} />
                        <StatusChip label={task.priorityLabel} variant={toPriorityVariant(task.priorityTone)} />
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">Owner: {task.assignmentLabel}</p>
                    {task.dueAtDisplay ? <p className="mt-1 text-xs text-slate-500">Due: {task.dueAtDisplay}</p> : null}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-label="Closed tasks" className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Completed and Cancelled</h4>
            {closedTasks.length === 0 ? (
              <p className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-sm text-slate-400">
                No completed or cancelled tasks.
              </p>
            ) : (
              <ul className="space-y-2">
                {closedTasks.map((task) => (
                  <li key={task.taskId} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="text-sm font-medium text-slate-100">{task.title}</p>
                      <StatusChip label={task.statusLabel} variant={toStatusVariant(task.statusTone)} />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">Owner: {task.assignmentLabel}</p>
                    {task.completedAtDisplay ? (
                      <p className="mt-1 text-xs text-slate-500">Completed: {task.completedAtDisplay}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </SectionCard>
  );
}
