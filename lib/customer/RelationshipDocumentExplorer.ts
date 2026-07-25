import type {
  DocumentIntelligenceDocumentResult,
  DocumentIntelligenceProcessingResult,
} from "@/lib/documents/documentIntelligenceOrchestrator";
import type { DocumentRecord } from "@/lib/documents/documentRepository";
import type { Evidence } from "@/lib/evidence/domain/Evidence";
import type { KnowledgeFact } from "@/lib/knowledge/domain/KnowledgeFact";
import type { ExecutiveRelationshipDashboardViewModel } from "@/lib/customer/ExecutiveRelationshipDashboardViewModel";
import type { RelationshipWorkspaceIntelligenceViewModel } from "@/lib/customer/RelationshipWorkspaceIntelligenceViewModel";
import type {
  RelationshipDocumentBusinessCategory,
  RelationshipDocumentExplorerCategoryViewModel,
  RelationshipDocumentExplorerDocumentViewModel,
  RelationshipDocumentExplorerViewModel,
} from "@/lib/customer/RelationshipDocumentExplorerViewModel";

export interface RelationshipDocumentExplorerSourceDocument {
  readonly document: Pick<DocumentRecord, "id" | "document_type" | "status" | "uploaded_at" | "created_at" | "updated_at">;
  readonly processedAt?: string;
  readonly relatedEvidence?: readonly Evidence[];
  readonly relatedKnowledge?: readonly KnowledgeFact[];
  readonly businessPassportReferences?: readonly string[];
}

export interface RelationshipDocumentExplorerInput {
  readonly intelligence: RelationshipWorkspaceIntelligenceViewModel;
  readonly dashboard?: ExecutiveRelationshipDashboardViewModel;
  readonly documentIntelligenceResult?: DocumentIntelligenceProcessingResult;
  readonly processedDocuments?: readonly RelationshipDocumentExplorerSourceDocument[];
}

export interface RelationshipDocumentExplorer {
  buildViewModel(input: RelationshipDocumentExplorerInput): RelationshipDocumentExplorerViewModel;
}

const CATEGORY_ORDER: readonly RelationshipDocumentBusinessCategory[] = [
  "corporate-documents",
  "financial-documents",
  "trade-documents",
  "compliance-documents",
  "legal-documents",
  "other-documents",
] as const;

const CATEGORY_TITLES: Record<RelationshipDocumentBusinessCategory, RelationshipDocumentExplorerCategoryViewModel["title"]> = {
  "corporate-documents": "Corporate Documents",
  "financial-documents": "Financial Documents",
  "trade-documents": "Trade Documents",
  "compliance-documents": "Compliance Documents",
  "legal-documents": "Legal Documents",
  "other-documents": "Other Documents",
};

function normalizeTimestamp(value: string | undefined, fallback: string): string {
  if (!value) {
    return fallback;
  }

  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return new Date(parsed).toISOString();
}

function normalizeLabel(value: string): string {
  return value.toLowerCase().replace(/[\s_-]+/g, "").trim();
}

function categorizeDocumentType(documentType: string): RelationshipDocumentBusinessCategory {
  const normalized = normalizeLabel(documentType);

  if (["tradelicense", "certificateofincorporation", "incorporationcertificate"].includes(normalized)) {
    return "corporate-documents";
  }

  if (["bankstatement", "financialstatement"].includes(normalized)) {
    return "financial-documents";
  }

  if (["invoice", "billoflading", "packinglist", "insurancecertificate"].includes(normalized)) {
    return "trade-documents";
  }

  if (normalized.includes("compliance") || normalized.includes("kyc") || normalized.includes("aml")) {
    return "compliance-documents";
  }

  if (normalized.includes("legal") || normalized.includes("contract") || normalized.includes("agreement")) {
    return "legal-documents";
  }

  return "other-documents";
}

function mapIntelligenceDocument(
  item: DocumentIntelligenceDocumentResult,
  fallbackDate: string,
): RelationshipDocumentExplorerSourceDocument {
  return {
    document: {
      id: item.document.id,
      document_type: item.document.document_type,
      status: item.document.status,
      uploaded_at: item.document.uploaded_at,
      created_at: item.document.created_at,
      updated_at: item.document.updated_at,
    },
    processedAt: fallbackDate,
    relatedEvidence: [item.evidence],
    relatedKnowledge: item.knowledge.knowledgeCollection.facts,
  };
}

function getProcessingDate(source: RelationshipDocumentExplorerSourceDocument, fallbackDate: string): string {
  return normalizeTimestamp(
    source.processedAt ?? source.document.updated_at ?? source.document.uploaded_at ?? source.document.created_at,
    fallbackDate,
  );
}

function derivePassportReferences(source: RelationshipDocumentExplorerSourceDocument): readonly string[] {
  if (source.businessPassportReferences && source.businessPassportReferences.length > 0) {
    return source.businessPassportReferences;
  }

  return source.relatedKnowledge?.map((fact) => `knowledge:${fact.factName}`) ?? [];
}

function mapDocument(
  source: RelationshipDocumentExplorerSourceDocument,
  fallbackDate: string,
): RelationshipDocumentExplorerDocumentViewModel {
  return {
    documentId: source.document.id,
    documentType: source.document.document_type,
    processingStatus: source.document.status,
    processingDate: getProcessingDate(source, fallbackDate),
    relatedEvidence:
      source.relatedEvidence?.map((evidence) => ({
        evidenceId: evidence.evidenceId.toString(),
        evidenceType: evidence.evidenceType,
        status: evidence.status,
        source: evidence.source,
      })) ?? [],
    relatedKnowledge:
      source.relatedKnowledge?.map((fact) => ({
        knowledgeId: fact.knowledgeId.toString(),
        factName: fact.factName,
        confidence: fact.confidence,
        verified: fact.verified,
        effectiveDate: fact.effectiveDate,
      })) ?? [],
    businessPassportReferences: derivePassportReferences(source),
  };
}

function sortByProcessingDateDescending(
  left: RelationshipDocumentExplorerDocumentViewModel,
  right: RelationshipDocumentExplorerDocumentViewModel,
): number {
  return Date.parse(right.processingDate) - Date.parse(left.processingDate);
}

function uniqueByDocumentId(
  items: readonly RelationshipDocumentExplorerSourceDocument[],
): RelationshipDocumentExplorerSourceDocument[] {
  const byId = new Map<string, RelationshipDocumentExplorerSourceDocument>();
  for (const item of items) {
    byId.set(item.document.id, item);
  }

  return [...byId.values()];
}

export function createRelationshipDocumentExplorer(): RelationshipDocumentExplorer {
  return {
    buildViewModel(input: RelationshipDocumentExplorerInput): RelationshipDocumentExplorerViewModel {
      const fallbackDate = normalizeTimestamp(input.intelligence.generatedAt, new Date().toISOString());
      const fromIntelligence =
        input.documentIntelligenceResult?.documents.map((item) =>
          mapIntelligenceDocument(item, input.documentIntelligenceResult?.processedAt ?? fallbackDate),
        ) ?? [];
      const fromInput = input.processedDocuments ?? [];

      const fromDashboard =
        input.dashboard?.recentDocuments.map((document) => ({
          document: {
            id: document.id,
            document_type: document.title,
            status: document.status,
            uploaded_at: document.updatedAt,
            created_at: document.updatedAt,
            updated_at: document.updatedAt,
          },
          processedAt: document.updatedAt,
        })) ?? [];

      const merged = uniqueByDocumentId([...fromIntelligence, ...fromInput, ...fromDashboard]);

      const grouped = new Map<RelationshipDocumentBusinessCategory, RelationshipDocumentExplorerDocumentViewModel[]>();
      for (const category of CATEGORY_ORDER) {
        grouped.set(category, []);
      }

      for (const source of merged) {
        const category = categorizeDocumentType(source.document.document_type);
        const mapped = mapDocument(source, fallbackDate);
        const list = grouped.get(category);
        if (!list) {
          continue;
        }

        list.push(mapped);
      }

      const categories: RelationshipDocumentExplorerCategoryViewModel[] = CATEGORY_ORDER.map((key) => {
        const documents = [...(grouped.get(key) ?? [])].sort(sortByProcessingDateDescending);
        return {
          key,
          title: CATEGORY_TITLES[key],
          totalDocuments: documents.length,
          documents,
        };
      });

      return {
        generatedAt: new Date().toISOString(),
        totalDocuments: merged.length,
        categories,
      };
    },
  };
}
