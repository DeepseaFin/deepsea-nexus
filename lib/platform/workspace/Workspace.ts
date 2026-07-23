import type { WorkspaceId } from "@/lib/platform/workspace/WorkspaceId";
import type { WorkspaceMetadata } from "@/lib/platform/workspace/WorkspaceMetadata";
import type { WorkspaceStatus } from "@/lib/platform/workspace/WorkspaceStatus";
import type { WorkspaceType } from "@/lib/platform/workspace/WorkspaceType";

export interface Workspace {
  readonly workspaceId: WorkspaceId;
  readonly capabilityId: string;
  readonly name: string;
  readonly displayName: string;
  readonly description: string;
  readonly type: WorkspaceType;
  readonly status: WorkspaceStatus;
  readonly version: string;
  readonly metadata: WorkspaceMetadata;
}
