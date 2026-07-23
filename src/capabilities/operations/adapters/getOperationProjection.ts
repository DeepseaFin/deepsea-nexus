import type { Operation } from "@/lib/operations/Operation";
import type {
  OperationProjection,
  OperationProjectionSummaryMetadata,
} from "@/src/capabilities/operations/projections/OperationProjection";

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toISOString();
}

function toSummaryMetadata(operation: Operation): OperationProjectionSummaryMetadata {
  return {
    sourceSystem: operation.metadata.sourceSystem ?? "Unknown source",
    sourceReference: operation.metadata.sourceReference ?? "Unavailable reference",
    tags: operation.metadata.tags ?? [],
    attributeCount: Object.keys(operation.metadata.attributes ?? {}).length,
  };
}

export function getOperationProjection(operation: Operation): OperationProjection {
  return {
    operationId: operation.operationId.toString(),
    relationshipId: operation.relationshipId.toString(),
    operationName: operation.operationName,
    description: operation.description,
    operationType: operation.operationType,
    status: operation.status,
    priority: operation.priority,
    createdDate: formatTimestamp(operation.createdAt),
    updatedDate: formatTimestamp(operation.updatedAt),
    summaryMetadata: toSummaryMetadata(operation),
  };
}
