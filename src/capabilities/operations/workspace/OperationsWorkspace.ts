import OperationsWorkspaceView from "@/components/atlas/operations/OperationsWorkspaceView";
import type { OperationsWorkspaceProjection } from "@/src/capabilities/operations/projections/OperationsWorkspaceProjection";

interface OperationsWorkspaceProps {
  readonly projection: OperationsWorkspaceProjection;
  readonly className?: string;
}

export default function OperationsWorkspace({ projection, className }: OperationsWorkspaceProps) {
  return <OperationsWorkspaceView projection={projection} className={className} />;
}