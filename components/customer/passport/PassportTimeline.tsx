import UICard from "@/components/ui/Card";
import StatusChip from "@/components/ui/StatusChip";

export interface PassportTimelineEntry {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly date: string;
  readonly state: "completed" | "active" | "upcoming";
}

export interface PassportTimelineProps {
  readonly entries: readonly PassportTimelineEntry[];
}

function stateVariant(state: PassportTimelineEntry["state"]): "success" | "info" | "default" {
  if (state === "completed") {
    return "success";
  }

  if (state === "active") {
    return "info";
  }

  return "default";
}

function stateLabel(state: PassportTimelineEntry["state"]): string {
  if (state === "completed") {
    return "Completed";
  }

  if (state === "active") {
    return "Active";
  }

  return "Upcoming";
}

export default function PassportTimeline({ entries }: PassportTimelineProps) {
  return (
    <UICard variant="subtle" className="p-5 sm:p-6">
      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">Passport Timeline</h3>
      <ol className="mt-4 space-y-3">
        {entries.map((entry) => (
          <li key={entry.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-100">{entry.title}</p>
                <p className="mt-1 text-xs text-slate-400">{entry.detail}</p>
              </div>
              <StatusChip label={stateLabel(entry.state)} variant={stateVariant(entry.state)} />
            </div>
            <p className="mt-2 text-xs text-slate-500">{entry.date}</p>
          </li>
        ))}
      </ol>
    </UICard>
  );
}
