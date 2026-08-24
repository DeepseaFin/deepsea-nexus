import ActivityFeedItem from "@/components/activity/ActivityFeedItem";
import EmptyState from "@/components/ui/EmptyState";
import SectionCard from "@/components/ui/SectionCard";
import type { ActivityPresentationModel } from "@/lib/activity/presentation/ActivityPresentationModel";

export interface ActivityFeedProps {
  readonly presentation: ActivityPresentationModel;
}

export default function ActivityFeed({ presentation }: ActivityFeedProps) {
  return (
    <SectionCard title="Activity Feed" subtitle="Chronological institutional activity stream">
      {presentation.feed.length === 0 ? (
        <EmptyState title="No activity feed entries" description="No activity records are available for this feed." />
      ) : (
        <div className="space-y-3">
          {presentation.feed.map((item) => (
            <ActivityFeedItem key={item.activityId} item={item} />
          ))}
        </div>
      )}
    </SectionCard>
  );
}
