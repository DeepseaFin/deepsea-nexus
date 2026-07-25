import type { ExecutiveRelationshipDashboardViewModel } from "@/lib/customer/ExecutiveRelationshipDashboardViewModel";
import type { RelationshipActionCenterViewModel } from "@/lib/customer/RelationshipActionCenterViewModel";
import type { RelationshipDocumentExplorerViewModel } from "@/lib/customer/RelationshipDocumentExplorerViewModel";
import type { RelationshipEvidenceExplorerViewModel } from "@/lib/customer/RelationshipEvidenceExplorerViewModel";
import type { RelationshipKnowledgeExplorerViewModel } from "@/lib/customer/RelationshipKnowledgeExplorerViewModel";
import type { RelationshipTimelineViewModel } from "@/lib/customer/RelationshipTimelineViewModel";

export interface RelationshipWorkspaceViewModel {
  readonly generatedAt: string;
  readonly executiveDashboard: ExecutiveRelationshipDashboardViewModel;
  readonly timeline: RelationshipTimelineViewModel;
  readonly documentExplorer: RelationshipDocumentExplorerViewModel;
  readonly evidenceExplorer: RelationshipEvidenceExplorerViewModel;
  readonly knowledgeExplorer: RelationshipKnowledgeExplorerViewModel;
  readonly actionCenter: RelationshipActionCenterViewModel;
}
