import StatusChip from "@/components/ui/StatusChip";
import UICard from "@/components/ui/Card";

export interface WorkflowSummaryItem {
  readonly id: string;
  readonly stage: string;
  readonly owner: string;
  readonly eta: string;
  readonly status: "on_track" | "attention" | "blocked";
}

export interface WorkflowSummaryProps {
  readonly stages: readonly WorkflowSummaryItem[];
}

function statusVariant(status: WorkflowSummaryItem["status"]): "success" | "warning" | "danger" {
  if (status === "on_track") {
    return "success";
  }

  if (status === "attention") {
    return "warning";
  }

  return "danger";
}

function statusLabel(status: WorkflowSummaryItem["status"]): string {
  if (status === "on_track") {
    return "On Track";
  }

  if (status === "attention") {
    return "Attention";
  }

  return "Blocked";
}

export default function WorkflowSummary({ stages }: WorkflowSummaryProps) {
  return (
    <UICard variant="subtle" className="p-5 sm:p-6">
      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">Workflow Summary</h3>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-800">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-950/70 text-xs uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-3 py-2.5 font-medium">Stage</th>
              <th className="px-3 py-2.5 font-medium">Owner</th>
              <th className="px-3 py-2.5 font-medium">ETA</th>
              <th className="px-3 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {stages.map((stage) => (
              <tr key={stage.id} className="border-t border-slate-800 bg-slate-950/45">
                <td className="px-3 py-3 text-slate-100">{stage.stage}</td>
                <td className="px-3 py-3 text-slate-300">{stage.owner}</td>
                <td className="px-3 py-3 text-slate-300">{stage.eta}</td>
                <td className="px-3 py-3">
                  <StatusChip label={statusLabel(stage.status)} variant={statusVariant(stage.status)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </UICard>
  );
}
