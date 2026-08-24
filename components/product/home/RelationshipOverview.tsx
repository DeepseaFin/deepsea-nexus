import UICard from "@/components/ui/Card";
import StatusChip from "@/components/ui/StatusChip";

export interface RelationshipSummaryItem {
  readonly id: string;
  readonly label: string;
  readonly value: string;
}

export interface RelationshipRecord {
  readonly id: string;
  readonly name: string;
  readonly segment: string;
  readonly exposure: string;
  readonly status: "stable" | "watch" | "attention";
}

export interface RelationshipOverviewProps {
  readonly summary: readonly RelationshipSummaryItem[];
  readonly topRelationships: readonly RelationshipRecord[];
}

function variantFromStatus(status: RelationshipRecord["status"]): "success" | "warning" | "danger" {
  if (status === "stable") {
    return "success";
  }

  if (status === "watch") {
    return "warning";
  }

  return "danger";
}

function labelFromStatus(status: RelationshipRecord["status"]): string {
  if (status === "stable") {
    return "Stable";
  }

  if (status === "watch") {
    return "Watch";
  }

  return "Attention";
}

export default function RelationshipOverview({ summary, topRelationships }: RelationshipOverviewProps) {
  return (
    <UICard variant="subtle" className="p-5 sm:p-6">
      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">Relationship Overview</h3>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {summary.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{item.label}</p>
            <p className="mt-1 text-lg font-semibold text-slate-100">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {topRelationships.map((relationship) => (
          <div
            key={relationship.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2.5"
          >
            <div>
              <p className="text-sm font-medium text-slate-100">{relationship.name}</p>
              <p className="text-xs text-slate-400">{relationship.segment}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-200">{relationship.exposure}</p>
              <StatusChip label={labelFromStatus(relationship.status)} variant={variantFromStatus(relationship.status)} />
            </div>
          </div>
        ))}
      </div>
    </UICard>
  );
}
