import UICard from "@/components/ui/Card";
import StatusChip from "@/components/ui/StatusChip";

export interface WorkQueueItem {
  readonly id: string;
  readonly title: string;
  readonly owner: string;
  readonly due: string;
  readonly priority: "critical" | "high" | "medium";
  readonly status: "pending" | "in_progress" | "blocked";
}

export interface WorkQueueProps {
  readonly items: readonly WorkQueueItem[];
}

function priorityVariant(priority: WorkQueueItem["priority"]): "danger" | "warning" | "info" {
  if (priority === "critical") {
    return "danger";
  }

  if (priority === "high") {
    return "warning";
  }

  return "info";
}

function priorityLabel(priority: WorkQueueItem["priority"]): string {
  if (priority === "critical") {
    return "Critical";
  }

  if (priority === "high") {
    return "High";
  }

  return "Medium";
}

function statusVariant(status: WorkQueueItem["status"]): "default" | "warning" | "danger" {
  if (status === "pending") {
    return "default";
  }

  if (status === "in_progress") {
    return "warning";
  }

  return "danger";
}

function statusLabel(status: WorkQueueItem["status"]): string {
  if (status === "pending") {
    return "Pending";
  }

  if (status === "in_progress") {
    return "In Progress";
  }

  return "Blocked";
}

export default function WorkQueue({ items }: WorkQueueProps) {
  return (
    <UICard variant="subtle" className="p-5 sm:p-6">
      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">Pending Work</h3>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-800">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-950/70 text-xs uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-3 py-2.5 font-medium">Task</th>
              <th className="px-3 py-2.5 font-medium">Owner</th>
              <th className="px-3 py-2.5 font-medium">Due</th>
              <th className="px-3 py-2.5 font-medium">Priority</th>
              <th className="px-3 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-slate-800 bg-slate-950/45">
                <td className="px-3 py-3 text-slate-100">{item.title}</td>
                <td className="px-3 py-3 text-slate-300">{item.owner}</td>
                <td className="px-3 py-3 text-slate-300">{item.due}</td>
                <td className="px-3 py-3">
                  <StatusChip label={priorityLabel(item.priority)} variant={priorityVariant(item.priority)} />
                </td>
                <td className="px-3 py-3">
                  <StatusChip label={statusLabel(item.status)} variant={statusVariant(item.status)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </UICard>
  );
}
