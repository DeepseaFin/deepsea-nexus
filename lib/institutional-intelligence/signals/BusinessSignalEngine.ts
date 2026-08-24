import type { InstitutionalFactGraph } from "@/lib/institutional-intelligence/domain/InstitutionalFactGraph";
import type { InstitutionalNode } from "@/lib/institutional-intelligence/domain/InstitutionalNode";
import { InstitutionalNodeType } from "@/lib/institutional-intelligence/domain/InstitutionalNode";
import type { BusinessSignal } from "@/lib/institutional-intelligence/signals/BusinessSignal";
import { BusinessSignalSeverity } from "@/lib/institutional-intelligence/signals/BusinessSignalSeverity";
import { BusinessSignalType } from "@/lib/institutional-intelligence/signals/BusinessSignalType";

interface GraphNodeBuckets {
  readonly identityNodes: readonly InstitutionalNode[];
  readonly directorNodes: readonly InstitutionalNode[];
  readonly shareholderNodes: readonly InstitutionalNode[];
  readonly licenceNodes: readonly InstitutionalNode[];
  readonly activityNodes: readonly InstitutionalNode[];
  readonly documentNodes: readonly InstitutionalNode[];
  readonly evidenceNodes: readonly InstitutionalNode[];
  readonly evidenceReferenceNodes: readonly InstitutionalNode[];
  readonly knowledgeFactNodes: readonly InstitutionalNode[];
}

function clampConfidence(value: number): number {
  if (value < 0) {
    return 0;
  }

  if (value > 1) {
    return 1;
  }

  return value;
}

function toSignalSeverity(score: number): BusinessSignalSeverity {
  if (score >= 0.8) {
    return BusinessSignalSeverity.Informational;
  }

  if (score >= 0.6) {
    return BusinessSignalSeverity.Watch;
  }

  if (score >= 0.4) {
    return BusinessSignalSeverity.Elevated;
  }

  return BusinessSignalSeverity.Material;
}

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object") {
    return value;
  }

  const properties = Object.getOwnPropertyNames(value);

  for (const property of properties) {
    const propertyValue = (value as Record<string, unknown>)[property];

    if (propertyValue !== null && (typeof propertyValue === "object" || typeof propertyValue === "function")) {
      deepFreeze(propertyValue);
    }
  }

  return Object.freeze(value);
}

function isKnowledgeNode(node: InstitutionalNode): boolean {
  return node.type === InstitutionalNodeType.KnowledgeFact;
}

function toBuckets(graph: InstitutionalFactGraph): GraphNodeBuckets {
  return {
    identityNodes: graph.nodes.filter((node) => node.type === InstitutionalNodeType.Identity),
    directorNodes: graph.nodes.filter((node) => node.type === InstitutionalNodeType.Director),
    shareholderNodes: graph.nodes.filter((node) => node.type === InstitutionalNodeType.Shareholder),
    licenceNodes: graph.nodes.filter((node) => node.type === InstitutionalNodeType.Licence),
    activityNodes: graph.nodes.filter((node) => node.type === InstitutionalNodeType.Activity),
    documentNodes: graph.nodes.filter((node) => node.type === InstitutionalNodeType.Document),
    evidenceNodes: graph.nodes.filter((node) => node.type === InstitutionalNodeType.Evidence),
    evidenceReferenceNodes: graph.nodes.filter((node) => node.type === InstitutionalNodeType.EvidenceReference),
    knowledgeFactNodes: graph.nodes.filter((node) => node.type === InstitutionalNodeType.KnowledgeFact),
  };
}

function withTwoDecimals(value: number): number {
  return Number(value.toFixed(2));
}

function normalizeTerm(term: string): string {
  return term.trim().toLowerCase();
}

function supportingIds(...groups: readonly (readonly InstitutionalNode[])[]): readonly string[] {
  const unique = new Set<string>();

  for (const group of groups) {
    for (const node of group) {
      unique.add(node.id);
    }
  }

  return [...unique];
}

function knowledgeNodesMatching(
  nodes: readonly InstitutionalNode[],
  keywords: readonly string[],
): readonly InstitutionalNode[] {
  const normalizedKeywords = keywords.map((keyword) => normalizeTerm(keyword));

  return nodes.filter((node) => {
    if (!isKnowledgeNode(node)) {
      return false;
    }

    const factName = normalizeTerm(node.attributes.factName);

    return normalizedKeywords.some((keyword) => factName.includes(keyword));
  });
}

function averageKnowledgeConfidence(nodes: readonly InstitutionalNode[]): number {
  if (nodes.length === 0) {
    return 0;
  }

  const sum = nodes.reduce((total, node) => {
    if (!isKnowledgeNode(node)) {
      return total;
    }

    return total + node.attributes.confidence;
  }, 0);

  return sum / nodes.length;
}

function countIdentityFields(identityNode: InstitutionalNode | undefined): {
  readonly available: number;
  readonly total: number;
} {
  if (!identityNode || identityNode.type !== InstitutionalNodeType.Identity) {
    return {
      available: 0,
      total: 9,
    };
  }

  const fields = [
    identityNode.attributes.legalName,
    identityNode.attributes.tradingName,
    identityNode.attributes.registrationNumber,
    identityNode.attributes.jurisdiction,
    identityNode.attributes.country,
    identityNode.attributes.incorporationDate,
    identityNode.attributes.entityType,
    identityNode.attributes.industry,
    identityNode.attributes.website,
  ];

  const available = fields.filter((field) => typeof field === "string" && field.trim().length > 0).length;

  return {
    available,
    total: fields.length,
  };
}

function createSignal(input: {
  readonly institutionId: string;
  readonly type: BusinessSignalType;
  readonly title: string;
  readonly description: string;
  readonly score: number;
  readonly supportingFactIds: readonly string[];
}): BusinessSignal {
  const normalizedScore = clampConfidence(input.score);

  return {
    id: `${input.institutionId}:${input.type}`,
    type: input.type,
    title: input.title,
    description: input.description,
    severity: toSignalSeverity(normalizedScore),
    supportingFactIds: input.supportingFactIds,
    confidence: withTwoDecimals(normalizedScore),
  };
}

export interface BusinessSignalEngine {
  evaluate(graph: InstitutionalFactGraph): readonly BusinessSignal[];
}

export class DefaultBusinessSignalEngine implements BusinessSignalEngine {
  evaluate(graph: InstitutionalFactGraph): readonly BusinessSignal[] {
    const buckets = toBuckets(graph);
    const identityNode = buckets.identityNodes[0];
    const identityFields = countIdentityFields(identityNode);

    const corporateProfileScore = clampConfidence(
      (identityFields.available / identityFields.total) * 0.7
      + Math.min(1, (buckets.directorNodes.length + buckets.shareholderNodes.length) / 4) * 0.3,
    );

    const corporateProfileSignal = createSignal({
      institutionId: graph.institutionId,
      type: BusinessSignalType.CorporateProfile,
      title: "Corporate Profile",
      description: `Identity coverage: ${identityFields.available}/${identityFields.total} fields with ${buckets.directorNodes.length} directors and ${buckets.shareholderNodes.length} shareholders represented in the graph.`,
      score: corporateProfileScore,
      supportingFactIds: supportingIds(buckets.identityNodes, buckets.directorNodes, buckets.shareholderNodes),
    });

    const geographicKnowledge = knowledgeNodesMatching(buckets.knowledgeFactNodes, ["country", "jurisdiction", "region", "market"]);
    const geographicSignals = [
      ...buckets.activityNodes,
      ...geographicKnowledge,
    ];
    const geographicPresenceScore = clampConfidence(
      Math.min(1, geographicSignals.length / 6) * 0.8
      + (identityFields.available > 0 ? 0.2 : 0),
    );

    const geographicPresenceSignal = createSignal({
      institutionId: graph.institutionId,
      type: BusinessSignalType.GeographicPresence,
      title: "Geographic Presence",
      description: `${geographicSignals.length} geography-related facts and activities are available for regional footprint interpretation.`,
      score: geographicPresenceScore,
      supportingFactIds: supportingIds(buckets.activityNodes, geographicKnowledge, buckets.identityNodes),
    });

    const operationalKnowledge = knowledgeNodesMatching(buckets.knowledgeFactNodes, ["employee", "operations", "turnover", "process", "facility", "branch"]);
    const operationalMaturityScore = clampConfidence(
      Math.min(1, buckets.activityNodes.length / 4) * 0.5
      + Math.min(1, operationalKnowledge.length / 5) * 0.3
      + Math.min(1, buckets.documentNodes.length / 6) * 0.2,
    );

    const operationalMaturitySignal = createSignal({
      institutionId: graph.institutionId,
      type: BusinessSignalType.OperationalMaturity,
      title: "Operational Maturity",
      description: `${buckets.activityNodes.length} activity nodes, ${operationalKnowledge.length} operational knowledge facts, and ${buckets.documentNodes.length} documents contribute to operational context depth.`,
      score: operationalMaturityScore,
      supportingFactIds: supportingIds(buckets.activityNodes, operationalKnowledge, buckets.documentNodes),
    });

    const documentationStrengthScore = clampConfidence(
      Math.min(1, buckets.documentNodes.length / 6) * 0.5
      + Math.min(1, buckets.evidenceNodes.length / 6) * 0.3
      + Math.min(1, buckets.evidenceReferenceNodes.length / 20) * 0.2,
    );

    const documentationStrengthSignal = createSignal({
      institutionId: graph.institutionId,
      type: BusinessSignalType.DocumentationStrength,
      title: "Documentation Strength",
      description: `${buckets.documentNodes.length} documents, ${buckets.evidenceNodes.length} evidence records, and ${buckets.evidenceReferenceNodes.length} evidence references are linked in the graph.`,
      score: documentationStrengthScore,
      supportingFactIds: supportingIds(buckets.documentNodes, buckets.evidenceNodes, buckets.evidenceReferenceNodes),
    });

    const coreKnowledgeGroups = [
      knowledgeNodesMatching(buckets.knowledgeFactNodes, ["legalname", "legal_name", "registration", "incorporation"]),
      knowledgeNodesMatching(buckets.knowledgeFactNodes, ["director", "board"]),
      knowledgeNodesMatching(buckets.knowledgeFactNodes, ["shareholder", "beneficial", "owner"]),
      knowledgeNodesMatching(buckets.knowledgeFactNodes, ["licence", "license", "permit"]),
      knowledgeNodesMatching(buckets.knowledgeFactNodes, ["activity", "business_activity", "industry"]),
    ];

    const representedCoreGroups = coreKnowledgeGroups.filter((group) => group.length > 0).length;
    const verifiedKnowledge = buckets.knowledgeFactNodes.filter((node) => isKnowledgeNode(node) && node.attributes.verified);
    const verifiedRatio = buckets.knowledgeFactNodes.length > 0
      ? verifiedKnowledge.length / buckets.knowledgeFactNodes.length
      : 0;

    const knowledgeCompletenessScore = clampConfidence(
      (representedCoreGroups / coreKnowledgeGroups.length) * 0.6
      + verifiedRatio * 0.2
      + clampConfidence(averageKnowledgeConfidence(buckets.knowledgeFactNodes)) * 0.2,
    );

    const knowledgeCompletenessSignal = createSignal({
      institutionId: graph.institutionId,
      type: BusinessSignalType.KnowledgeCompleteness,
      title: "Knowledge Completeness",
      description: `${representedCoreGroups}/${coreKnowledgeGroups.length} core knowledge dimensions are represented with ${verifiedKnowledge.length}/${buckets.knowledgeFactNodes.length} facts verified.`,
      score: knowledgeCompletenessScore,
      supportingFactIds: supportingIds(buckets.knowledgeFactNodes),
    });

    const bankingKnowledge = knowledgeNodesMatching(buckets.knowledgeFactNodes, ["bank", "banking", "relationship", "facility", "account"]);
    const bankingRelationshipsScore = clampConfidence(
      Math.min(1, bankingKnowledge.length / 4) * 0.7
      + clampConfidence(averageKnowledgeConfidence(bankingKnowledge)) * 0.3,
    );

    const bankingRelationshipsSignal = createSignal({
      institutionId: graph.institutionId,
      type: BusinessSignalType.BankingRelationships,
      title: "Banking Relationships",
      description: `${bankingKnowledge.length} banking-related knowledge facts are available for relationship interpretation.`,
      score: bankingRelationshipsScore,
      supportingFactIds: supportingIds(bankingKnowledge),
    });

    const licensingKnowledge = knowledgeNodesMatching(buckets.knowledgeFactNodes, ["licence", "license", "permit", "registration"]);
    const licensingProfileScore = clampConfidence(
      Math.min(1, buckets.licenceNodes.length / 3) * 0.6
      + Math.min(1, licensingKnowledge.length / 4) * 0.4,
    );

    const licensingProfileSignal = createSignal({
      institutionId: graph.institutionId,
      type: BusinessSignalType.LicensingProfile,
      title: "Licensing Profile",
      description: `${buckets.licenceNodes.length} licence nodes and ${licensingKnowledge.length} licensing knowledge facts are connected to the institution.`,
      score: licensingProfileScore,
      supportingFactIds: supportingIds(buckets.licenceNodes, licensingKnowledge),
    });

    return deepFreeze([
      corporateProfileSignal,
      geographicPresenceSignal,
      operationalMaturitySignal,
      documentationStrengthSignal,
      knowledgeCompletenessSignal,
      bankingRelationshipsSignal,
      licensingProfileSignal,
    ] as const);
  }
}

export const businessSignalEngine: BusinessSignalEngine = new DefaultBusinessSignalEngine();
