import StatusChip from "@/components/ui/StatusChip";
import UICard from "@/components/ui/Card";

export interface DocumentSummaryItem {
  readonly id: string;
  readonly documentGroup: string;
  readonly owner: string;
  readonly lastUpdated: string;
  readonly status: "current" | "review" | "expiring";
}

export interface DocumentsSummaryProps {
  readonly items: readonly DocumentSummaryItem[];
}

function statusVariant(status: DocumentSummaryItem["status"]): "success" | "warning" | "danger" {
  if (status === "current") {
    return "success";
  }

  if (status === "review") {
    return "warning";
  }

  return "danger";
}

function statusLabel(status: DocumentSummaryItem["status"]): string {
  if (status === "current") {
    return "Current";
  }

  if (status === "review") {
    return "In Review";
  }

  return "Expiring";
}

export default function DocumentsSummary({ items }: DocumentsSummaryProps) {
  return (
    <UICard variant="subtle" className="p-5 sm:p-6" aria-label="Documents summary">
      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">Documents</h3>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-800">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-950/70 text-xs uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-3 py-2.5 font-medium">Document Group</th>
              <th className="px-3 py-2.5 font-medium">Owner</th>
              <th className="px-3 py-2.5 font-medium">Last Updated</th>
              <th className="px-3 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-slate-800 bg-slate-950/45">
                <td className="px-3 py-3 text-slate-100">{item.documentGroup}</td>
                <td className="px-3 py-3 text-slate-300">{item.owner}</td>
                <td className="px-3 py-3 text-slate-300">{item.lastUpdated}</td>
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
