import type { WorkspaceAttributes, WorkspaceTimestamp } from "@/lib/workspaces/types";

export interface WorkspaceContext {
  readonly institutionId: string;
  readonly institutionName?: string;
  readonly actorId?: string;
  readonly actorRole?: string;
  readonly locale?: string;
  readonly timeZone?: string;
  readonly channel?: string;
  readonly correlationId?: string;
  readonly observedAt: WorkspaceTimestamp;
  readonly metadata?: WorkspaceAttributes;
}
