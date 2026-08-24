import type { ConfidenceBand } from "@/lib/business-passport/types/Confidence";
import type { RelationshipWorkspaceIntelligenceViewModel } from "@/lib/customer/RelationshipWorkspaceIntelligenceViewModel";
import type {
  EvidenceCorrelationFactReport,
  EvidenceCorrelationReport,
} from "@/lib/intelligence/EvidenceCorrelationTypes";
import type { KnowledgeFact } from "@/lib/knowledge/domain/KnowledgeFact";
import type {
  RelationshipEvidenceBusinessDomain,
  RelationshipEvidenceDomainGroupViewModel,
  RelationshipEvidenceExplorerViewModel,
  RelationshipEvidenceItemViewModel,
  RelationshipEvidenceKnowledgeViewModel,
} from "@/lib/customer/RelationshipEvidenceExplorerViewModel";

export interface RelationshipEvidenceExplorerInput {
  readonly intelligence: RelationshipWorkspaceIntelligenceViewModel;
  readonly evidenceCorrelation?: EvidenceCorrelationReport;
  readonly relatedKnowledgeFacts?: readonly KnowledgeFact[];
  readonly supportingDocumentLabelsById?: Readonly<Record<string, string>>;
  readonly factDomainOverrides?: Readonly<Record<string, RelationshipEvidenceBusinessDomain>>;
  readonly evidenceLastUpdatedByFact?: Readonly<Record<string, string>>;
}

export interface RelationshipEvidenceExplorer {
  buildViewModel(input: RelationshipEvidenceExplorerInput): RelationshipEvidenceExplorerViewModel;
}

const DOMAIN_ORDER: readonly RelationshipEvidenceBusinessDomain[] = [
  "corporate-identity",
  "financial-profile",
  "trade-activity",
  "compliance",
  "operations",
] as const;

const DOMAIN_TITLES: Record<RelationshipEvidenceBusinessDomain, RelationshipEvidenceDomainGroupViewModel["title"]> = {
  "corporate-identity": "Corporate Identity",
  "financial-profile": "Financial Profile",
  "trade-activity": "Trade Activity",
  compliance: "Compliance",
  operations: "Operations",
};

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

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

function classifyDomain(
  fact: string,
  overrides: Readonly<Record<string, RelationshipEvidenceBusinessDomain>> | undefined,
): RelationshipEvidenceBusinessDomain {
  const direct = overrides?.[fact] ?? overrides?.[normalize(fact)];
  if (direct) {
    return direct;
  }

  const key = normalize(fact);

  if (
    key.includes("legalname") ||
    key.includes("registration") ||
    key.includes("jurisdiction") ||
    key.includes("entitytype") ||
    key.includes("incorporation")
  ) {
    return "corporate-identity";
  }

  if (
    key.includes("revenue") ||
    key.includes("turnover") ||
    key.includes("profit") ||
    key.includes("funding") ||
    key.includes("bank")
  ) {
    return "financial-profile";
  }

  if (
    key.includes("invoice") ||
    key.includes("shipment") ||
    key.includes("billoflading") ||
    key.includes("packinglist") ||
    key.includes("counterparty") ||
    key.includes("trade")
  ) {
    return "trade-activity";
  }

  if (
    key.includes("compliance") ||
    key.includes("sanction") ||
    key.includes("aml") ||
    key.includes("kyc") ||
    key.includes("screening")
  ) {
    return "compliance";
  }

  return "operations";
}

function toRelatedKnowledgeIndex(
  facts: readonly KnowledgeFact[] | undefined,
): Map<string, RelationshipEvidenceKnowledgeViewModel[]> {
  const index = new Map<string, RelationshipEvidenceKnowledgeViewModel[]>();

  for (const fact of facts ?? []) {
    const key = normalize(fact.factName);
    const bucket = index.get(key) ?? [];
    bucket.push({
      knowledgeId: fact.knowledgeId.toString(),
      factName: fact.factName,
      confidence: fact.confidence,
      verified: fact.verified,
      lastUpdated: fact.lastVerified,
    });
    index.set(key, bucket);
  }

  return index;
}

function toEvidenceItem(params: {
  readonly fact: EvidenceCorrelationFactReport;
  readonly knowledgeIndex: Map<string, RelationshipEvidenceKnowledgeViewModel[]>;
  readonly documentLabels: Readonly<Record<string, string>> | undefined;
  readonly lastUpdatedByFact: Readonly<Record<string, string>> | undefined;
  readonly fallbackTimestamp: string;
}): RelationshipEvidenceItemViewModel {
  const factKey = normalize(params.fact.fact);
  const relatedKnowledge = params.knowledgeIndex.get(factKey) ?? [];

  return {
    businessFact: params.fact.fact,
    confidence: {
      score: params.fact.confidenceScore,
      band: params.fact.confidenceLevel as ConfidenceBand,
    },
    supportingDocuments: params.fact.supportingDocuments.map((documentId) => ({
      id: documentId,
      label: params.documentLabels?.[documentId] ?? documentId,
    })),
    relatedKnowledge,
    lastUpdated: normalizeTimestamp(
      params.lastUpdatedByFact?.[params.fact.fact] ?? params.lastUpdatedByFact?.[factKey],
      params.fallbackTimestamp,
    ),
  };
}

function sortEvidenceItems(
  left: RelationshipEvidenceItemViewModel,
  right: RelationshipEvidenceItemViewModel,
): number {
  if (left.lastUpdated !== right.lastUpdated) {
    return Date.parse(right.lastUpdated) - Date.parse(left.lastUpdated);
  }

  return left.businessFact.localeCompare(right.businessFact);
}

function uniqueSortedKnowledge(
  items: readonly RelationshipEvidenceKnowledgeViewModel[],
): readonly RelationshipEvidenceKnowledgeViewModel[] {
  const byId = new Map<string, RelationshipEvidenceKnowledgeViewModel>();
  for (const item of items) {
    byId.set(item.knowledgeId, item);
  }

  return [...byId.values()].sort((left, right) => left.factName.localeCompare(right.factName));
}

export function createRelationshipEvidenceExplorer(): RelationshipEvidenceExplorer {
  return {
    buildViewModel(input: RelationshipEvidenceExplorerInput): RelationshipEvidenceExplorerViewModel {
      const fallbackTimestamp = normalizeTimestamp(
        input.evidenceCorrelation?.generatedAt ?? input.intelligence.generatedAt,
        new Date().toISOString(),
      );

      const groups = new Map<RelationshipEvidenceBusinessDomain, RelationshipEvidenceItemViewModel[]>();
      for (const domain of DOMAIN_ORDER) {
        groups.set(domain, []);
      }

      const knowledgeIndex = toRelatedKnowledgeIndex(input.relatedKnowledgeFacts);
      const facts = input.evidenceCorrelation?.facts ?? [];

      for (const fact of facts) {
        const domain = classifyDomain(fact.fact, input.factDomainOverrides);
        const item = toEvidenceItem({
          fact,
          knowledgeIndex,
          documentLabels: input.supportingDocumentLabelsById,
          lastUpdatedByFact: input.evidenceLastUpdatedByFact,
          fallbackTimestamp,
        });

        const current = groups.get(domain);
        if (!current) {
          continue;
        }

        current.push({
          ...item,
          relatedKnowledge: uniqueSortedKnowledge(item.relatedKnowledge),
        });
      }

      const domains: RelationshipEvidenceDomainGroupViewModel[] = DOMAIN_ORDER.map((key) => {
        const evidenceItems = [...(groups.get(key) ?? [])].sort(sortEvidenceItems);
        return {
          key,
          title: DOMAIN_TITLES[key],
          totalEvidenceItems: evidenceItems.length,
          evidenceItems,
        };
      });

      const totalEvidenceItems = domains.reduce((count, domain) => count + domain.totalEvidenceItems, 0);

      return {
        generatedAt: new Date().toISOString(),
        totalEvidenceItems,
        domains,
      };
    },
  };
}
