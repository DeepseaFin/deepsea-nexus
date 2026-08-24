import { ActivityActorType } from "@/lib/activity/ActivityActor";
import { ActivitySeverity } from "@/lib/activity/ActivitySeverity";
import { ActivityTargetType } from "@/lib/activity/ActivityTarget";
import { ActivityType } from "@/lib/activity/ActivityType";

export const ACTIVITY_TYPES = [
  ActivityType.Lifecycle,
  ActivityType.Governance,
  ActivityType.Compliance,
  ActivityType.Risk,
  ActivityType.Relationship,
  ActivityType.Document,
  ActivityType.Workflow,
  ActivityType.Intelligence,
  ActivityType.System,
] as const;

export const ACTIVITY_SEVERITIES = [
  ActivitySeverity.Low,
  ActivitySeverity.Medium,
  ActivitySeverity.High,
  ActivitySeverity.Critical,
] as const;

export const ACTIVITY_ACTOR_TYPES = [
  ActivityActorType.User,
  ActivityActorType.Team,
  ActivityActorType.Role,
  ActivityActorType.Institution,
  ActivityActorType.System,
] as const;

export const ACTIVITY_TARGET_TYPES = [
  ActivityTargetType.Relationship,
  ActivityTargetType.Workflow,
  ActivityTargetType.Document,
  ActivityTargetType.Evidence,
  ActivityTargetType.Approval,
  ActivityTargetType.Institution,
  ActivityTargetType.Participant,
  ActivityTargetType.Policy,
  ActivityTargetType.Rule,
  ActivityTargetType.Task,
  ActivityTargetType.Milestone,
  ActivityTargetType.Generic,
] as const;

export const ACTIVITY_TYPE_LABELS: Readonly<Record<ActivityType, string>> = {
  [ActivityType.Lifecycle]: "Lifecycle",
  [ActivityType.Governance]: "Governance",
  [ActivityType.Compliance]: "Compliance",
  [ActivityType.Risk]: "Risk",
  [ActivityType.Relationship]: "Relationship",
  [ActivityType.Document]: "Document",
  [ActivityType.Workflow]: "Workflow",
  [ActivityType.Intelligence]: "Intelligence",
  [ActivityType.System]: "System",
};

export const ACTIVITY_SEVERITY_LABELS: Readonly<Record<ActivitySeverity, string>> = {
  [ActivitySeverity.Low]: "Low",
  [ActivitySeverity.Medium]: "Medium",
  [ActivitySeverity.High]: "High",
  [ActivitySeverity.Critical]: "Critical",
};
