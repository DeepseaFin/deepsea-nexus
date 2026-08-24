import type { WorkflowPriority } from "@/lib/customer/workflow/workflow.types";
import type { InstitutionalEventType } from "@/lib/application/events/InstitutionalEventType";

export interface InstitutionalEvent {
  readonly id: string;
  readonly type: InstitutionalEventType;
  readonly occurredAt: string;
  readonly priority: WorkflowPriority;
  readonly title: string;
  readonly description: string;
  readonly owner?: string;
  readonly actionLabel?: string;
  readonly sourceId?: string;
}
