import type { ProjectionComposition } from "@/lib/platform/projection/ProjectionComposition";
import type { ProjectionCompositionId } from "@/lib/platform/projection/ProjectionCompositionId";
import type { ProjectionCompositionMetadata } from "@/lib/platform/projection/ProjectionCompositionMetadata";
import type { ProjectionCompositionStatus } from "@/lib/platform/projection/ProjectionCompositionStatus";
import type { ProjectionCompositionType } from "@/lib/platform/projection/ProjectionCompositionType";

export interface CreateProjectionCompositionInput {
  readonly compositionId: ProjectionCompositionId;
  readonly name: string;
  readonly description: string;
  readonly type: ProjectionCompositionType;
  readonly status: ProjectionCompositionStatus;
  readonly version: string;
  readonly metadata: ProjectionCompositionMetadata;
}

export interface ProjectionCompositionService {
  create(input: CreateProjectionCompositionInput): Promise<ProjectionComposition>;
  get(compositionId: ProjectionCompositionId): Promise<ProjectionComposition | null>;
  listByType(type: ProjectionCompositionType): Promise<readonly ProjectionComposition[]>;
  listByStatus(status: ProjectionCompositionStatus): Promise<readonly ProjectionComposition[]>;
}
