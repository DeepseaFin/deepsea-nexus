import OperationsWorkspaceView from "@/components/atlas/operations/OperationsWorkspaceView";
import type { OperationProjection } from "@/src/capabilities/operations/projections/OperationProjection";

export interface OperationsWorkspaceSummaryMetadata {
  readonly sourceSystem: string;
  readonly sourceReference: string;
  readonly tags: readonly string[];
  readonly attributeCount: number;
}

export interface OperationsWorkspace {
  readonly operationSummary: string;
  readonly relationshipIdentifier: string;
  readonly operationType: string;
  readonly status: string;
  readonly priority: string;
  readonly createdDate: string;
  readonly updatedDate: string;
  readonly summaryMetadata: OperationsWorkspaceSummaryMetadata;
}

interface OperationsWorkspaceProps {
  readonly projection: OperationProjection;
  readonly className?: string;
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toISOString();
}

function toOperationsWorkspace(projection: OperationProjection): OperationsWorkspace {
  return {
    operationSummary: projection.operationName,
    relationshipIdentifier: projection.relationshipId,
    operationType: projection.operationType,
    status: projection.status,
    priority: projection.priority,
    createdDate: formatTimestamp(projection.createdDate),
    updatedDate: formatTimestamp(projection.updatedDate),
    summaryMetadata: {
      sourceSystem: projection.summaryMetadata.sourceSystem,
      sourceReference: projection.summaryMetadata.sourceReference,
      tags: projection.summaryMetadata.tags,
      attributeCount: projection.summaryMetadata.attributeCount,
    },
  };
}

export default function OperationsWorkspace({ projection, className }: OperationsWorkspaceProps) {
  return <OperationsWorkspaceView workspace={toOperationsWorkspace(projection)} className={className} />;
}