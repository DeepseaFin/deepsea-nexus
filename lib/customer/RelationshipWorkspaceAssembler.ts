import type { ExecutiveRelationshipCustomerSnapshotViewModel, ExecutiveRelationshipRecentDocumentViewModel, ExecutiveRelationshipRiskFlagViewModel } from "@/lib/customer/ExecutiveRelationshipDashboardViewModel";
import type { ExecutiveRelationshipDashboardAssembler } from "@/lib/customer/ExecutiveRelationshipDashboardAssembler";
import type {
  RelationshipTimelineAssembler,
  TimelineBusinessPassportUpdateInput,
  TimelineDocumentEventInput,
  TimelineEvidenceEventInput,
  TimelineKnowledgeEventInput,
} from "@/lib/customer/RelationshipTimelineAssembler";
import type {
  RelationshipDocumentExplorer,
  RelationshipDocumentExplorerSourceDocument,
} from "@/lib/customer/RelationshipDocumentExplorer";
import type {
  RelationshipEvidenceExplorer,
} from "@/lib/customer/RelationshipEvidenceExplorer";
import type {
  RelationshipKnowledgeExplorer,
} from "@/lib/customer/RelationshipKnowledgeExplorer";
import type { RelationshipActionCenter } from "@/lib/customer/RelationshipActionCenter";
import type {
  RelationshipWorkspaceIntelligenceInput,
  RelationshipWorkspaceIntelligenceService,
} from "@/lib/customer/RelationshipWorkspaceIntelligence";
import type { RelationshipWorkspaceViewModel } from "@/lib/customer/RelationshipWorkspaceViewModel";
import type { DocumentIntelligenceProcessingResult } from "@/lib/documents/documentIntelligenceOrchestrator";
import type { Evidence } from "@/lib/evidence/domain/Evidence";
import type { EvidenceCorrelationReport } from "@/lib/intelligence/EvidenceCorrelationTypes";
import type { RelationshipInsightsReport } from "@/lib/intelligence/RelationshipInsightsTypes";
import type { RelationshipReadinessReport } from "@/lib/intelligence/RelationshipReadinessTypes";
import type { KnowledgeFact } from "@/lib/knowledge/domain/KnowledgeFact";
import type { RelationshipEvidenceBusinessDomain } from "@/lib/customer/RelationshipEvidenceExplorerViewModel";
import type { RelationshipKnowledgeBusinessDomain } from "@/lib/customer/RelationshipKnowledgeExplorerViewModel";

export interface RelationshipWorkspaceAssemblerDependencies {
  readonly workspaceIntelligenceService: RelationshipWorkspaceIntelligenceService;
  readonly executiveDashboardAssembler: ExecutiveRelationshipDashboardAssembler;
  readonly relationshipTimelineAssembler: RelationshipTimelineAssembler;
  readonly relationshipDocumentExplorer: RelationshipDocumentExplorer;
  readonly relationshipEvidenceExplorer: RelationshipEvidenceExplorer;
  readonly relationshipKnowledgeExplorer: RelationshipKnowledgeExplorer;
  readonly relationshipActionCenter: RelationshipActionCenter;
}

export interface RelationshipWorkspaceAssemblerInput {
  readonly intelligenceInput: RelationshipWorkspaceIntelligenceInput;
  readonly customerSnapshot: ExecutiveRelationshipCustomerSnapshotViewModel;
  readonly recentDocuments?: readonly ExecutiveRelationshipRecentDocumentViewModel[];
  readonly riskAndAttentionFlags?: readonly ExecutiveRelationshipRiskFlagViewModel[];
  readonly customerCreatedAt?: string;
  readonly businessPassportUpdates?: readonly TimelineBusinessPassportUpdateInput[];
  readonly documentEvents?: readonly TimelineDocumentEventInput[];
  readonly evidenceEvents?: readonly TimelineEvidenceEventInput[];
  readonly knowledgeEvents?: readonly TimelineKnowledgeEventInput[];
  readonly confidenceUpdatedAt?: string;
  readonly readinessUpdatedAt?: string;
  readonly outstandingActionsUpdatedAt?: string;
  readonly documentIntelligenceResult?: DocumentIntelligenceProcessingResult;
  readonly processedDocuments?: readonly RelationshipDocumentExplorerSourceDocument[];
  readonly evidenceCorrelation?: EvidenceCorrelationReport;
  readonly supportingDocumentLabelsById?: Readonly<Record<string, string>>;
  readonly factDomainOverrides?: Readonly<Record<string, RelationshipEvidenceBusinessDomain>>;
  readonly evidenceLastUpdatedByFact?: Readonly<Record<string, string>>;
  readonly relatedKnowledgeFacts?: readonly KnowledgeFact[];
  readonly knowledgeFacts: readonly KnowledgeFact[];
  readonly evidence?: readonly Evidence[];
  readonly knowledgeDomainByFactName?: Readonly<Record<string, RelationshipKnowledgeBusinessDomain>>;
  readonly businessPassportReferencesByFactName?: Readonly<Record<string, readonly string[]>>;
  readonly insightsReport?: RelationshipInsightsReport;
  readonly readinessReport?: RelationshipReadinessReport;
}

export interface RelationshipWorkspaceAssembler {
  assemble(input: RelationshipWorkspaceAssemblerInput): Promise<RelationshipWorkspaceViewModel>;
}

export function createRelationshipWorkspaceAssembler(
  dependencies: RelationshipWorkspaceAssemblerDependencies,
): RelationshipWorkspaceAssembler {
  return {
    async assemble(input: RelationshipWorkspaceAssemblerInput): Promise<RelationshipWorkspaceViewModel> {
      const intelligence = await dependencies.workspaceIntelligenceService.buildViewModel(input.intelligenceInput);

      const executiveDashboard = dependencies.executiveDashboardAssembler.assemble({
        intelligence,
        customerSnapshot: input.customerSnapshot,
        recentDocuments: input.recentDocuments,
        riskAndAttentionFlags: input.riskAndAttentionFlags,
      });

      const timeline = dependencies.relationshipTimelineAssembler.assemble({
        intelligence,
        dashboard: executiveDashboard,
        customerId: input.intelligenceInput.customerId,
        customerCreatedAt: input.customerCreatedAt,
        businessPassportUpdates: input.businessPassportUpdates,
        documentEvents: input.documentEvents,
        evidenceEvents: input.evidenceEvents,
        knowledgeEvents: input.knowledgeEvents,
        confidenceUpdatedAt: input.confidenceUpdatedAt,
        readinessUpdatedAt: input.readinessUpdatedAt,
        outstandingActionsUpdatedAt: input.outstandingActionsUpdatedAt,
      });

      const documentExplorer = dependencies.relationshipDocumentExplorer.buildViewModel({
        intelligence,
        dashboard: executiveDashboard,
        documentIntelligenceResult: input.documentIntelligenceResult,
        processedDocuments: input.processedDocuments,
      });

      const evidenceExplorer = dependencies.relationshipEvidenceExplorer.buildViewModel({
        intelligence,
        evidenceCorrelation: input.evidenceCorrelation,
        relatedKnowledgeFacts: input.relatedKnowledgeFacts ?? input.knowledgeFacts,
        supportingDocumentLabelsById: input.supportingDocumentLabelsById,
        factDomainOverrides: input.factDomainOverrides,
        evidenceLastUpdatedByFact: input.evidenceLastUpdatedByFact,
      });

      const knowledgeExplorer = dependencies.relationshipKnowledgeExplorer.buildViewModel({
        intelligence,
        knowledgeFacts: input.knowledgeFacts,
        evidence: input.evidence,
        documentLabelsById: input.supportingDocumentLabelsById,
        domainByFactName: input.knowledgeDomainByFactName,
        businessPassportReferencesByFactName: input.businessPassportReferencesByFactName,
      });

      const actionCenter = dependencies.relationshipActionCenter.buildViewModel({
        intelligence,
        dashboard: executiveDashboard,
        insightsReport: input.insightsReport,
        readinessReport: input.readinessReport,
      });

      return {
        generatedAt: new Date().toISOString(),
        executiveDashboard,
        timeline,
        documentExplorer,
        evidenceExplorer,
        knowledgeExplorer,
        actionCenter,
      };
    },
  };
}
