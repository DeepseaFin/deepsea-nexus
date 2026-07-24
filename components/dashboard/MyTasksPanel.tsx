import React from "react";
import DashboardSection from "@/components/dashboard/DashboardSection";
import EmptyState from "@/components/ui/EmptyState";
import StatusChip from "@/components/ui/StatusChip";
import type { DashboardTaskItem } from "@/lib/dashboard/dashboard.types";

export interface MyTasksPanelProps {
  readonly tasks: readonly DashboardTaskItem[];
}

export default function MyTasksPanel({ tasks }: MyTasksPanelProps) {
  return (
    <DashboardSection
      title="My Tasks"
      subtitle="Operational and governance tasks for current workspace role"
    >
      {tasks.length === 0 ? (
        <EmptyState
          title="No assigned tasks"
          description="Task entries will appear here when upstream capability task feeds are connected."
        />
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-medium text-slate-100">{task.title}</h3>
                <StatusChip label={task.status} variant={task.status} />
              </div>
              <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
                {task.owner ? <span>Owner: {task.owner}</span> : null}
                {task.dueLabel ? <span>Due: {task.dueLabel}</span> : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardSection>
  );
}
