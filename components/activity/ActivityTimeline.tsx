import EmptyState from "@/components/ui/EmptyState";
import SectionCard from "@/components/ui/SectionCard";
import StatusChip from "@/components/ui/StatusChip";
import type { ActivityPresentationModel } from "@/lib/activity/presentation/ActivityPresentationModel";

export interface ActivityTimelineProps {
  readonly presentation: ActivityPresentationModel;
}

function toStatusVariant(
  tone: ActivityPresentationModel["timeline"][number]["entries"][number]["severityTone"],
): "default" | "info" | "success" | "warning" | "danger" {
  if (tone === "neutral") {
    return "default";
  }

  return tone;
}

export default function ActivityTimeline({ presentation }: ActivityTimelineProps) {
  return (
    <SectionCard title="Timeline" subtitle="Grouped activity history by day">
      {presentation.timeline.length === 0 ? (
        <EmptyState title="No timeline entries" description="No timeline groups are currently available." />
      ) : (
        <div className="space-y-4">
          {presentation.timeline.map((group) => (
            <section key={group.dayKey} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 sm:p-4">
              <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-slate-100">{group.dayLabel}</h4>
                <StatusChip label={group.countLabel} />
              </header>

              <ol className="space-y-2">
                {group.entries.map((entry) => (
                  <li key={entry.activityId} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-slate-100">{entry.title}</p>
                        {entry.description ? <p className="mt-1 text-xs text-slate-400">{entry.description}</p> : null}
                      </div>
                      <StatusChip label={entry.severityLabel} variant={toStatusVariant(entry.severityTone)} />
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                      <span>{entry.typeLabel}</span>
                      <span>{entry.actorLabel}</span>
                      <span>{entry.targetLabel}</span>
                      <span>{entry.occurredAtDisplay}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
