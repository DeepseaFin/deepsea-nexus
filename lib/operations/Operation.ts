import type { RelationshipId } from "@/lib/relationship/RelationshipId";
import type { OperationId } from "@/lib/operations/OperationId";
import type { OperationMetadata } from "@/lib/operations/OperationMetadata";
import type { OperationPriority } from "@/lib/operations/OperationPriority";
import type { OperationStatus } from "@/lib/operations/OperationStatus";
import type { OperationType } from "@/lib/operations/OperationType";

export interface Operation {
  readonly operationId: OperationId;
  readonly relationshipId: RelationshipId;
  readonly operationName: string;
  readonly description: string;
  readonly operationType: OperationType;
  readonly status: OperationStatus;
  readonly priority: OperationPriority;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly metadata: OperationMetadata;
}
