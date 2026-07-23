import RelationshipWorkspaceView from "@/components/atlas/relationship/RelationshipWorkspaceView";
import type { RelationshipProjection } from "@/src/capabilities/relationship/projections/RelationshipProjection";

export interface RelationshipWorkspace {
  readonly relationship: RelationshipProjection;
}

interface RelationshipWorkspaceProps {
  readonly projection: RelationshipProjection;
  readonly className?: string;
}

function buildRelationshipWorkspace(projection: RelationshipProjection): RelationshipWorkspace {
  return Object.freeze({
    relationship: projection,
  });
}

export default function RelationshipWorkspace({ projection, className }: RelationshipWorkspaceProps) {
  const workspace = buildRelationshipWorkspace(projection);

  return <RelationshipWorkspaceView workspace={workspace} className={className} />;
}
