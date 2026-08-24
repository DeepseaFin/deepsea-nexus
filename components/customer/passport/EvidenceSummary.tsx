import StatusChip from "@/components/ui/StatusChip";
import UICard from "@/components/ui/Card";

export interface EvidenceItem {
  readonly id: string;
  readonly category: string;
  readonly status: "verified" | "review" | "missing";
  readonly updated: string;
}

export interface EvidenceSummaryProps {
  readonly items: readonly EvidenceItem[];
}

function statusVariant(status: EvidenceItem["status"]): "success" | "warning" | "danger" {
  if (status === "verified") {
    return "success";
  }

  if (status === "review") {
    return "warning";
  }

  return "danger";
}

function statusLabel(status: EvidenceItem["status"]): string {
  if (status === "verified") {
    return "Verified";
  }

  if (status === "review") {
    return "In Review";
  }

  return "Missing";
}

export default function EvidenceSummary({ items }: EvidenceSummaryProps) {
  return (
    <UICard variant="subtle" className="p-5 sm:p-6">
      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">Evidence Summary</h3>
      <div className="mt-4 space-y-2.5">
        {items.map((item) => (
          <article key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2.5">
            <div>
              <p className="text-sm font-medium text-slate-100">{item.category}</p>
              <p className="text-xs text-slate-500">Updated {item.updated}</p>
            </div>
            <StatusChip label={statusLabel(item.status)} variant={statusVariant(item.status)} />
          </article>
        ))}
      </div>
    </UICard>
  );
}
