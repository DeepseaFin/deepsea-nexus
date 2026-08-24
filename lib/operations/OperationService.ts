import type { RelationshipId } from "@/lib/relationship/RelationshipId";
import type { Operation } from "@/lib/operations/Operation";
import type { OperationId } from "@/lib/operations/OperationId";
import type { OperationMetadata } from "@/lib/operations/OperationMetadata";
import type { OperationPriority } from "@/lib/operations/OperationPriority";
import type { OperationStatus } from "@/lib/operations/OperationStatus";
import type { OperationType } from "@/lib/operations/OperationType";

export interface CreateOperationInput {
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

export interface OperationService {
  create(input: CreateOperationInput): Promise<Operation>;
  get(operationId: OperationId): Promise<Operation | null>;
  listByRelationshipId(relationshipId: RelationshipId): Promise<readonly Operation[]>;
  listByType(operationType: OperationType): Promise<readonly Operation[]>;
  listByStatus(status: OperationStatus): Promise<readonly Operation[]>;
  listByPriority(priority: OperationPriority): Promise<readonly Operation[]>;
}
