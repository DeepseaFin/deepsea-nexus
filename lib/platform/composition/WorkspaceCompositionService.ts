import type { WorkspaceId } from "@/lib/platform/workspace/WorkspaceId";
import type { WorkspaceComposition } from "@/lib/platform/composition/WorkspaceComposition";
import type { WorkspaceCompositionId } from "@/lib/platform/composition/WorkspaceCompositionId";
import type { WorkspaceCompositionMetadata } from "@/lib/platform/composition/WorkspaceCompositionMetadata";
import type { WorkspaceCompositionStatus } from "@/lib/platform/composition/WorkspaceCompositionStatus";
import type { WorkspaceCompositionType } from "@/lib/platform/composition/WorkspaceCompositionType";

export interface CreateWorkspaceCompositionInput {
  readonly compositionId: WorkspaceCompositionId;
  readonly workspaceId: WorkspaceId;
  readonly name: string;
  readonly description: string;
  readonly type: WorkspaceCompositionType;
  readonly status: WorkspaceCompositionStatus;
  readonly version: string;
  readonly metadata: WorkspaceCompositionMetadata;
}

export interface WorkspaceCompositionService {
  create(input: CreateWorkspaceCompositionInput): Promise<WorkspaceComposition>;
  get(compositionId: WorkspaceCompositionId): Promise<WorkspaceComposition | null>;
  listByWorkspaceId(workspaceId: WorkspaceId): Promise<readonly WorkspaceComposition[]>;
  listByType(type: WorkspaceCompositionType): Promise<readonly WorkspaceComposition[]>;
  listByStatus(status: WorkspaceCompositionStatus): Promise<readonly WorkspaceComposition[]>;
}
