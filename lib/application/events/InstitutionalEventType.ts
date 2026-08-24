export const INSTITUTIONAL_EVENT_TYPES = [
  "document-missing",
  "approval-completed",
  "approval-rejected",
  "facility-approved",
  "facility-expiring",
  "relationship-follow-up-due",
  "ai-recommendation",
  "timeline-milestone",
  "workflow-next-action",
] as const;

export type InstitutionalEventType = (typeof INSTITUTIONAL_EVENT_TYPES)[number];
