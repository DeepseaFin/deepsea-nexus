import RelationshipWorkspaceView from "@/components/atlas/relationship/RelationshipWorkspaceView";
import type { RelationshipWorkspaceProjection } from "@/src/capabilities/relationship/projections/RelationshipWorkspaceProjection";

interface RelationshipWorkspaceProps {
  readonly projection: RelationshipWorkspaceProjection;
  readonly className?: string;
}

export default function RelationshipWorkspace({ projection, className }: RelationshipWorkspaceProps) {
  return <RelationshipWorkspaceView projection={projection} className={className} />;
}
