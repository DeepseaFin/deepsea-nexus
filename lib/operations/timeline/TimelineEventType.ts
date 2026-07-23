export enum TimelineEventType {
  OperationCreated = "operation-created",
  TaskCreated = "task-created",
  TaskAssigned = "task-assigned",
  TaskCompleted = "task-completed",
  DocumentReceived = "document-received",
  DocumentVerified = "document-verified",
  ComplianceReviewed = "compliance-reviewed",
  ApprovalGranted = "approval-granted",
  ApprovalRejected = "approval-rejected",
  Custom = "custom",
}