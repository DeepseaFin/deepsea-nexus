"use client";

import ActivityFeed from "@/components/activity/ActivityFeed";
import ActivityFilterPanel, { type ActivityFilterPanelProps } from "@/components/activity/ActivityFilterPanel";
import ActivityHeader from "@/components/activity/ActivityHeader";
import ActivitySummaryPanel from "@/components/activity/ActivitySummaryPanel";
import ActivityTimeline from "@/components/activity/ActivityTimeline";
import EmptyState from "@/components/ui/EmptyState";
import SectionCard from "@/components/ui/SectionCard";
import type { ActivityPresentationModel } from "@/lib/activity/presentation/ActivityPresentationModel";

export interface ActivityWorkspaceProps {
  readonly presentation?: ActivityPresentationModel | null;
  readonly className?: string;
  readonly emptyMessage?: string;
  readonly filterPanelProps?: Omit<ActivityFilterPanelProps, "presentation">;
}

export default function ActivityWorkspace({
  presentation,
  className = "",
  emptyMessage = "Activity presentation data is not available in this workspace.",
  filterPanelProps,
}: ActivityWorkspaceProps) {
  if (!presentation) {
    return (
      <SectionCard title="Institutional Activity" subtitle="No activity data is currently available">
        <EmptyState title="Activity unavailable" description={emptyMessage} />
      </SectionCard>
    );
  }

  return (
    <section className={`space-y-5 ${className}`.trim()} aria-label="Activity workspace">
      <ActivityHeader presentation={presentation} />

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <ActivitySummaryPanel presentation={presentation} />
          <ActivityFeed presentation={presentation} />
          <ActivityTimeline presentation={presentation} />
        </div>

        <aside className="space-y-5">
          <ActivityFilterPanel presentation={presentation} {...filterPanelProps} />
        </aside>
      </div>

      {presentation.validationWarnings.length > 0 ? (
        <section
          aria-label="Activity validation warnings"
          className="rounded-2xl border border-amber-700/50 bg-amber-900/20 p-4"
        >
          <h3 className="text-sm font-semibold text-amber-200">Validation Warnings</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-100">
            {presentation.validationWarnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </section>
  );
}
