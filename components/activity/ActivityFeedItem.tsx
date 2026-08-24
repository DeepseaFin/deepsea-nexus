import StatusChip from "@/components/ui/StatusChip";
import type { ActivityFeedPresentationModel } from "@/lib/activity/presentation/ActivityPresentationModel";

export interface ActivityFeedItemProps {
  readonly item: ActivityFeedPresentationModel;
  readonly compact?: boolean;
}

function toStatusVariant(
  tone: ActivityFeedPresentationModel["severityTone"],
): "default" | "info" | "success" | "warning" | "danger" {
  if (tone === "neutral") {
    return "default";
  }

  return tone;
}

export default function ActivityFeedItem({ item, compact = false }: ActivityFeedItemProps) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 sm:p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold text-slate-100">{item.title}</h4>
          {item.description ? <p className="mt-1 text-xs text-slate-400">{item.description}</p> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusChip label={item.severityLabel} variant={toStatusVariant(item.severityTone)} />
          <StatusChip label={item.typeLabel} variant="info" />
        </div>
      </div>

      <dl className="mt-3 grid gap-2 text-xs text-slate-400 sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">Actor</dt>
          <dd className="mt-0.5 text-slate-200">{item.actor.displayName}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Target</dt>
          <dd className="mt-0.5 text-slate-200">{item.target.targetLabel}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Module</dt>
          <dd className="mt-0.5 text-slate-200">{item.moduleLabel}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Occurred</dt>
          <dd className="mt-0.5 text-slate-200">{item.occurredAtDisplay}</dd>
        </div>
      </dl>

      {!compact ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StatusChip label={item.acknowledgedLabel} variant={item.acknowledgedLabel === "Acknowledged" ? "success" : "warning"} />
          {item.tags.map((tag) => (
            <StatusChip key={`${item.activityId}-${tag}`} label={tag} />
          ))}
        </div>
      ) : null}
    </article>
  );
}
