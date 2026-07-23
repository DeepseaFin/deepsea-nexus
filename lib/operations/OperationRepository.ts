import type { RelationshipId } from "@/lib/relationship/RelationshipId";
import type { Operation } from "@/lib/operations/Operation";
import type { OperationId } from "@/lib/operations/OperationId";
import type { OperationPriority } from "@/lib/operations/OperationPriority";
import type { OperationStatus } from "@/lib/operations/OperationStatus";
import type { OperationType } from "@/lib/operations/OperationType";

export interface OperationRepository {
  findById(operationId: OperationId): Promise<Operation | null>;
  save(operation: Operation): Promise<void>;
  listByRelationshipId(relationshipId: RelationshipId): Promise<readonly Operation[]>;
  listByType(operationType: OperationType): Promise<readonly Operation[]>;
  listByStatus(status: OperationStatus): Promise<readonly Operation[]>;
  listByPriority(priority: OperationPriority): Promise<readonly Operation[]>;
}
