import type { ReactNode } from "react";

export interface InstitutionHomeProps {
  readonly institutionName: ReactNode;
  readonly institutionSubtitle?: ReactNode;
  readonly personaSlot?: ReactNode;
  readonly searchSlot?: ReactNode;
  readonly notificationsSlot?: ReactNode;
  readonly className?: string;
}

export interface InstitutionHeaderProps {
  readonly institutionName: ReactNode;
  readonly institutionSubtitle?: ReactNode;
  readonly personaSlot?: ReactNode;
  readonly searchSlot?: ReactNode;
  readonly notificationsSlot?: ReactNode;
  readonly className?: string;
}

export interface MissionFocusCardProps {
  readonly missionTitle?: ReactNode;
  readonly heartbeat?: ReactNode;
  readonly confidence?: ReactNode;
  readonly owner?: ReactNode;
  readonly nextMilestone?: ReactNode;
  readonly className?: string;
}

export interface AttentionQueueItem {
  readonly title: string;
  readonly detail: string;
}

export interface AttentionQueueProps {
  readonly items?: readonly AttentionQueueItem[];
  readonly className?: string;
}

export interface RecommendedActionItem {
  readonly title: string;
  readonly rationale: string;
}

export interface RecommendedActionsProps {
  readonly items?: readonly RecommendedActionItem[];
  readonly className?: string;
}

export interface RecentActivityItem {
  readonly event: string;
  readonly timestamp: string;
}

export interface RecentActivityProps {
  readonly items?: readonly RecentActivityItem[];
  readonly className?: string;
}

export interface InstitutionSnapshotMetric {
  readonly label: "Active Missions" | "Waiting Missions" | "At Risk Missions" | "Completed Today";
  readonly value: ReactNode;
}

export interface InstitutionSnapshotProps {
  readonly metrics?: readonly InstitutionSnapshotMetric[];
  readonly className?: string;
}