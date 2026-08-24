import { ConfidenceBand } from "@/lib/business-passport/types/Confidence";
import type { Evidence } from "@/lib/evidence/domain/Evidence";
import type { KnowledgeFact } from "@/lib/knowledge/domain/KnowledgeFact";
import type { RelationshipWorkspaceIntelligenceViewModel } from "@/lib/customer/RelationshipWorkspaceIntelligenceViewModel";
import type {
  RelationshipKnowledgeBusinessDomain,
  RelationshipKnowledgeDomainGroupViewModel,
  RelationshipKnowledgeExplorerViewModel,
  RelationshipKnowledgeItemViewModel,
} from "@/lib/customer/RelationshipKnowledgeExplorerViewModel";

export interface RelationshipKnowledgeExplorerInput {
  readonly intelligence: RelationshipWorkspaceIntelligenceViewModel;
  readonly knowledgeFacts: readonly KnowledgeFact[];
  readonly evidence?: readonly Evidence[];
  readonly documentLabelsById?: Readonly<Record<string, string>>;
  readonly domainByFactName?: Readonly<Record<string, RelationshipKnowledgeBusinessDomain>>;
  readonly businessPassportReferencesByFactName?: Readonly<Record<string, readonly string[]>>;
}

export interface RelationshipKnowledgeExplorer {
  buildViewModel(input: RelationshipKnowledgeExplorerInput): RelationshipKnowledgeExplorerViewModel;
}

const DOMAIN_ORDER: readonly RelationshipKnowledgeBusinessDomain[] = [
  "corporate",
  "financial",
  "trade",
  "compliance",
  "operations",
] as const;

const DOMAIN_TITLES: Record<RelationshipKnowledgeBusinessDomain, RelationshipKnowledgeDomainGroupViewModel["title"]> = {
  corporate: "Corporate",
  financial: "Financial",
  trade: "Trade",
  compliance: "Compliance",
  operations: "Operations",
};

const FACT_DOMAIN_DEFAULTS: Readonly<Record<string, RelationshipKnowledgeBusinessDomain>> = {
  legalname: "corporate",
  registrationnumber: "corporate",
  jurisdiction: "corporate",
  entitytype: "corporate",
  incorporationdate: "corporate",
  revenuerange: "financial",
  monthlyturnover: "financial",
  profitabilitysignal: "financial",
  fundingneed: "financial",
  invoicenumber: "trade",
  billofladingnumber: "trade",
  packinglistnumber: "trade",
  shipmentdate: "trade",
  duedate: "trade",
  grossweight: "trade",
  netweight: "trade",
  sanctionsscreeningstatus: "compliance",
  jurisdictionalstatus: "compliance",
};

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function compactFactName(value: string): string {
  return normalize(value).replace(/[\s_-]+/g, "");
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

function toBand(score: number): ConfidenceBand {
  if (score >= 90) {
    return ConfidenceBand.VeryHigh;
  }

  if (score >= 75) {
    return ConfidenceBand.High;
  }

  if (score >= 50) {
    return ConfidenceBand.Moderate;
  }

  if (score >= 25) {
    return ConfidenceBand.Low;
  }

  return ConfidenceBand.VeryLow;
}

function classifyDomain(
  factName: string,
  overrides: Readonly<Record<string, RelationshipKnowledgeBusinessDomain>> | undefined,
): RelationshipKnowledgeBusinessDomain {
  const direct = overrides?.[factName] ?? overrides?.[normalize(factName)] ?? overrides?.[compactFactName(factName)];
  if (direct) {
    return direct;
  }

  return FACT_DOMAIN_DEFAULTS[compactFactName(factName)] ?? "operations";
}

function indexEvidenceByFact(evidence: readonly Evidence[] | undefined): Map<string, Evidence[]> {
  const index = new Map<string, Evidence[]>();

  for (const item of evidence ?? []) {
    for (const reference of item.references) {
      const key = compactFactName(reference.section);
      const bucket = index.get(key) ?? [];
      bucket.push(item);
      index.set(key, bucket);
    }
  }

  return index;
}

function uniqueEvidence(items: readonly Evidence[]): readonly Evidence[] {
  const byId = new Map<string, Evidence>();
  for (const item of items) {
    byId.set(item.evidenceId.toString(), item);
  }

  return [...byId.values()];
}

function uniqueDocuments(
  ids: readonly string[],
  labels: Readonly<Record<string, string>> | undefined,
): readonly { id: string; label: string }[] {
  const seen = new Set<string>();
  const output: Array<{ id: string; label: string }> = [];

  for (const id of ids) {
    if (seen.has(id)) {
      continue;
    }

    seen.add(id);
    output.push({
      id,
      label: labels?.[id] ?? id,
    });
  }

  return output;
}

function toBusinessConclusion(fact: KnowledgeFact): string {
  return `${fact.factName}: ${String(fact.value)}`;
}

function sortKnowledgeItems(
  left: RelationshipKnowledgeItemViewModel,
  right: RelationshipKnowledgeItemViewModel,
): number {
  if (left.lastUpdated !== right.lastUpdated) {
    return Date.parse(right.lastUpdated) - Date.parse(left.lastUpdated);
  }

  return left.businessConclusion.localeCompare(right.businessConclusion);
}

export function createRelationshipKnowledgeExplorer(): RelationshipKnowledgeExplorer {
  return {
    buildViewModel(input: RelationshipKnowledgeExplorerInput): RelationshipKnowledgeExplorerViewModel {
      const fallbackTimestamp = normalizeTimestamp(input.intelligence.generatedAt, new Date().toISOString());
      const evidenceByFact = indexEvidenceByFact(input.evidence);

      const grouped = new Map<RelationshipKnowledgeBusinessDomain, RelationshipKnowledgeItemViewModel[]>();
      for (const domain of DOMAIN_ORDER) {
        grouped.set(domain, []);
      }

      for (const fact of input.knowledgeFacts) {
        const domain = classifyDomain(fact.factName, input.domainByFactName);
        const factKey = compactFactName(fact.factName);
        const supportingEvidence = uniqueEvidence(evidenceByFact.get(factKey) ?? []);
        const documentIds = supportingEvidence.map((item) => item.metadata.documentId);

        const item: RelationshipKnowledgeItemViewModel = {
          knowledgeId: fact.knowledgeId.toString(),
          businessConclusion: toBusinessConclusion(fact),
          supportingEvidence: supportingEvidence.map((evidenceItem) => ({
            evidenceId: evidenceItem.evidenceId.toString(),
            evidenceType: evidenceItem.evidenceType,
            status: evidenceItem.status,
            source: evidenceItem.source,
          })),
          confidence: {
            score: fact.confidence,
            band: toBand(fact.confidence),
          },
          relatedDocuments: uniqueDocuments(documentIds, input.documentLabelsById),
          businessPassportReferences:
            input.businessPassportReferencesByFactName?.[fact.factName] ??
            input.businessPassportReferencesByFactName?.[normalize(fact.factName)] ??
            input.businessPassportReferencesByFactName?.[factKey] ??
            [],
          lastUpdated: normalizeTimestamp(fact.lastVerified || fact.metadata.updatedAt, fallbackTimestamp),
        };

        const bucket = grouped.get(domain);
        if (!bucket) {
          continue;
        }

        bucket.push(item);
      }

      const domains: RelationshipKnowledgeDomainGroupViewModel[] = DOMAIN_ORDER.map((key) => {
        const knowledgeItems = [...(grouped.get(key) ?? [])].sort(sortKnowledgeItems);
        return {
          key,
          title: DOMAIN_TITLES[key],
          totalKnowledgeItems: knowledgeItems.length,
          knowledgeItems,
        };
      });

      const totalKnowledgeItems = domains.reduce((sum, domain) => sum + domain.totalKnowledgeItems, 0);

      return {
        generatedAt: new Date().toISOString(),
        totalKnowledgeItems,
        domains,
      };
    },
  };
}
