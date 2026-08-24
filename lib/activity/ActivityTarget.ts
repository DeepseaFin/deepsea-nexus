import type { ActivityAttributes, ActivityLabel } from "@/lib/activity/types";

export enum ActivityTargetType {
  Relationship = "relationship",
  Workflow = "workflow",
  Document = "document",
  Evidence = "evidence",
  Approval = "approval",
  Institution = "institution",
  Participant = "participant",
  Policy = "policy",
  Rule = "rule",
  Task = "task",
  Milestone = "milestone",
  Generic = "generic",
}

export interface ActivityTarget {
  readonly targetId: string;
  readonly targetType: ActivityTargetType;
  readonly targetLabel?: ActivityLabel;
  readonly externalRef?: string;
  readonly metadata?: ActivityAttributes;
}
