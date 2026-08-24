import type { BusinessPassport } from "@/lib/business-passport/domain/BusinessPassport";
import type { BusinessPassportRepository } from "@/lib/business-passport/repositories/BusinessPassportRepository";
import { ConfidenceBand } from "@/lib/business-passport/types/Confidence";
import { PassportId } from "@/lib/business-passport/value-objects/PassportId";
import type { DocumentsRepository } from "@/lib/documents/repositories/DocumentsRepository";
import { EvidenceStatus } from "@/lib/evidence/constants/EvidenceStatus";
import type { Evidence } from "@/lib/evidence/domain/Evidence";
import type { EvidenceRepository } from "@/lib/evidence/services/EvidenceRepository";
import { KnowledgeStatus } from "@/lib/knowledge/constants/KnowledgeStatus";
import type { KnowledgeFact } from "@/lib/knowledge/domain/KnowledgeFact";
import type { KnowledgeRepository } from "@/lib/knowledge/repositories/KnowledgeRepository";
import type { WorkspaceIntelligenceModel } from "@/lib/application/WorkspaceIntelligence";
import type {
  DocumentCoverageSummary,
  EvidenceSummary,
  FinancialSummary,
  InstitutionalAlert,
  KnowledgeSummary,
  RelationshipConfidenceSummary,
  RelationshipIntelligenceInput,
  RelationshipIntelligenceReport,
  RelationshipRequiredDocument,
  TradeActivitySummary,
} from "@/lib/intelligence/RelationshipIntelligenceTypes";

const DEFAULT_KNOWLEDGE_FACT_NAMES: readonly string[] = [
  "legalName",
  "registrationNumber",
  "jurisdiction",
  "entityType",
  "incorporationDate",
  "invoiceNumber",
  "billOfLadingNumber",
  "packingListNumber",
  "policyNumber",
  "coverageType",
  "coverageAmount",
];

export interface RelationshipIntelligenceEngineDependencies {
  readonly businessPassportRepository: BusinessPassportRepository;
  readonly evidenceRepository: EvidenceRepository;
  readonly knowledgeRepository: KnowledgeRepository;
  readonly documentsRepository?: DocumentsRepository;
  readonly workspaceIntelligenceProvider?: (customerId: string) => Promise<WorkspaceIntelligenceModel | null>;
}

export interface RelationshipIntelligenceEngine {
  generateReport(input: RelationshipIntelligenceInput): Promise<RelationshipIntelligenceReport>;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function uniqueBy<T>(values: readonly T[], keyOf: (value: T) => string): readonly T[] {
  const map = new Map<string, T>();
  for (const value of values) {
    map.set(keyOf(value), value);
  }

  return [...map.values()];
}

function toConfidenceBand(score: number): ConfidenceBand {
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

function countEvidenceByStatus(evidence: readonly Evidence[]): Map<EvidenceStatus, number> {
  const counts = new Map<EvidenceStatus, number>();

  for (const item of evidence) {
    counts.set(item.status, (counts.get(item.status) ?? 0) + 1);
  }

  return counts;
}

function countKnowledgeByStatus(facts: readonly KnowledgeFact[]): Map<KnowledgeStatus, number> {
  const counts = new Map<KnowledgeStatus, number>();

  for (const fact of facts) {
    counts.set(fact.status, (counts.get(fact.status) ?? 0) + 1);
  }

  return counts;
}

function buildDocumentCoverageSummary(params: {
  readonly requiredDocuments: readonly RelationshipRequiredDocument[];
  readonly observedDocumentTypes: readonly string[];
}): DocumentCoverageSummary {
  const observed = params.observedDocumentTypes.map((value) => normalize(value));
  const matchedRequiredDocuments: string[] = [];
  const missingDocuments: string[] = [];

  for (const required of params.requiredDocuments) {
    const matched = required.matchers.some((matcher) => observed.includes(normalize(matcher)));
    if (matched) {
      matchedRequiredDocuments.push(required.label);
    } else {
      missingDocuments.push(required.label);
    }
  }

  return {
    totalDocuments: observed.length,
    matchedRequiredDocuments,
    missingDocuments,
  };
}

function buildEvidenceSummary(evidence: readonly Evidence[]): EvidenceSummary {
  const counts = countEvidenceByStatus(evidence);

  return {
    totalEvidence: evidence.length,
    validEvidence: counts.get(EvidenceStatus.Valid) ?? 0,
    pendingValidationEvidence: counts.get(EvidenceStatus.PendingValidation) ?? 0,
    invalidEvidence: counts.get(EvidenceStatus.Invalid) ?? 0,
    uniqueSources: new Set(evidence.map((item) => item.source)).size,
  };
}

function buildKnowledgeSummary(facts: readonly KnowledgeFact[]): KnowledgeSummary {
  const counts = countKnowledgeByStatus(facts);
  const averageConfidence = facts.length === 0
    ? 0
    : Math.round((facts.reduce((sum, fact) => sum + fact.confidence, 0) / facts.length) * 100) / 100;

  return {
    totalFacts: facts.length,
    verifiedFacts: counts.get(KnowledgeStatus.Verified) ?? 0,
    averageConfidence,
    factCoverage: uniqueBy(facts, (fact) => fact.factName).map((fact) => fact.factName),
  };
}

function buildTradeActivitySummary(evidence: readonly Evidence[]): TradeActivitySummary {
  const signals = evidence.flatMap((item) => item.references);
  const counterpartySections = new Set(["buyer", "seller", "shipper", "consignee", "beneficiary", "insuredParty"]);
  const counterparties = uniqueBy(
    signals.filter((reference) => counterpartySections.has(reference.section)).map((reference) => reference.fragment),
    (value) => value,
  );

  const recentSignals = signals
    .filter((reference) => ["tradeActivity", "shipmentCompletion", "shipmentContents", "shipmentRiskCoverage", "receivablesSignal"].includes(reference.section))
    .map((reference) => reference.fragment)
    .slice(0, 5);

  const invoiceCount = signals.filter((reference) => reference.section === "invoiceNumber").length;
  const shipmentDocumentCount = signals.filter((reference) =>
    ["billOfLadingNumber", "packingListNumber", "coveredShipmentReference"].includes(reference.section)
  ).length;

  return {
    invoiceCount,
    shipmentDocumentCount,
    counterparties,
    recentTradeSignals: recentSignals,
  };
}

function buildFinancialSummary(passport: BusinessPassport): FinancialSummary {
  return {
    revenueRange: passport.profiles.financialProfile.revenueRange,
    monthlyTurnover: passport.profiles.financialProfile.monthlyTurnover,
    profitabilitySignal: passport.profiles.financialProfile.profitabilitySignal,
    fundingNeed: passport.profiles.financialProfile.fundingNeed,
    bankingRelationshipCount: passport.profiles.financialProfile.bankingRelationships?.length ?? 0,
  };
}

function buildRelationshipConfidence(params: {
  readonly passport: BusinessPassport;
  readonly evidenceSummary: EvidenceSummary;
  readonly knowledgeSummary: KnowledgeSummary;
  readonly missingDocuments: readonly string[];
}): RelationshipConfidenceSummary {
  const baseScore = params.passport.confidence.score;
  const evidenceBoost = params.evidenceSummary.totalEvidence === 0
    ? 0
    : (params.evidenceSummary.validEvidence / params.evidenceSummary.totalEvidence) * 15;
  const knowledgeBoost = params.knowledgeSummary.totalFacts === 0
    ? 0
    : (params.knowledgeSummary.verifiedFacts / params.knowledgeSummary.totalFacts) * 15;
  const missingPenalty = params.missingDocuments.length * 5;

  const score = Math.max(0, Math.min(100, Math.round(baseScore + evidenceBoost + knowledgeBoost - missingPenalty)));

  const rationale: string[] = [
    `Base passport confidence score: ${baseScore}.`,
    `Evidence quality contribution: +${Math.round(evidenceBoost)}.`,
    `Knowledge verification contribution: +${Math.round(knowledgeBoost)}.`,
  ];

  if (missingPenalty > 0) {
    rationale.push(`Missing required documents penalty: -${missingPenalty}.`);
  }

  return {
    score,
    band: toConfidenceBand(score),
    rationale,
  };
}

function buildInstitutionalAlerts(params: {
  readonly documentCoverage: DocumentCoverageSummary;
  readonly evidenceSummary: EvidenceSummary;
  readonly knowledgeSummary: KnowledgeSummary;
  readonly workspaceIntelligence: WorkspaceIntelligenceModel | null;
  readonly passport: BusinessPassport;
}): readonly InstitutionalAlert[] {
  const alerts: InstitutionalAlert[] = [];

  if (params.documentCoverage.missingDocuments.length > 0) {
    alerts.push({
      severity: "high",
      code: "documents.missing_required",
      message: `Missing required documents: ${params.documentCoverage.missingDocuments.join(", ")}.`,
      source: "documents",
    });
  }

  if (params.evidenceSummary.invalidEvidence > 0) {
    alerts.push({
      severity: "high",
      code: "evidence.invalid_present",
      message: `${params.evidenceSummary.invalidEvidence} invalid evidence item(s) require attention.`,
      source: "evidence",
    });
  }

  if (params.knowledgeSummary.totalFacts > 0 && params.knowledgeSummary.verifiedFacts === 0) {
    alerts.push({
      severity: "medium",
      code: "knowledge.unverified",
      message: "Knowledge facts exist but none are verified.",
      source: "knowledge",
    });
  }

  if (params.passport.profiles.complianceProfile.sanctionsScreeningStatus
    && normalize(params.passport.profiles.complianceProfile.sanctionsScreeningStatus) !== "clear") {
    alerts.push({
      severity: "high",
      code: "compliance.sanctions_not_clear",
      message: `Sanctions screening status is ${params.passport.profiles.complianceProfile.sanctionsScreeningStatus}.`,
      source: "passport",
    });
  }

  if (params.workspaceIntelligence?.timelineAlerts.length) {
    alerts.push({
      severity: "low",
      code: "workspace.timeline_alerts",
      message: `${params.workspaceIntelligence.timelineAlerts.length} timeline alert(s) present in workspace intelligence.`,
      source: "documents",
    });
  }

  return alerts;
}

async function collectDocumentIds(params: {
  readonly input: RelationshipIntelligenceInput;
  readonly documentsRepository?: DocumentsRepository;
}): Promise<readonly string[]> {
  if (params.input.documentIds?.length) {
    return params.input.documentIds;
  }

  if (!params.documentsRepository || !params.input.customerId) {
    return [];
  }

  const documents = await params.documentsRepository.list({
    client_id: params.input.customerId,
  });

  return documents.map((document) => document.id);
}

async function collectObservedDocumentTypes(params: {
  readonly input: RelationshipIntelligenceInput;
  readonly documentsRepository?: DocumentsRepository;
  readonly documentIds: readonly string[];
}): Promise<readonly string[]> {
  if (!params.documentsRepository) {
    return [];
  }

  if (params.documentIds.length > 0) {
    const documents = await Promise.all(
      params.documentIds.map((id) => params.documentsRepository?.findById(id)),
    );

    return documents
      .filter((document): document is NonNullable<typeof document> => Boolean(document))
      .map((document) => document.document_type ?? "unknown");
  }

  if (params.input.customerId) {
    const documents = await params.documentsRepository.list({
      client_id: params.input.customerId,
    });

    return documents.map((document) => document.document_type ?? "unknown");
  }

  return [];
}

async function collectEvidence(params: {
  readonly evidenceRepository: EvidenceRepository;
  readonly documentIds: readonly string[];
}): Promise<readonly Evidence[]> {
  const evidenceGroups = await Promise.all(
    params.documentIds.map((documentId) => params.evidenceRepository.listByDocumentId(documentId)),
  );

  return uniqueBy(
    evidenceGroups.flatMap((items) => items),
    (item) => item.evidenceId.toString(),
  );
}

async function collectKnowledge(params: {
  readonly knowledgeRepository: KnowledgeRepository;
  readonly factNames: readonly string[];
}): Promise<readonly KnowledgeFact[]> {
  const factGroups = await Promise.all(
    params.factNames.map((factName) => params.knowledgeRepository.listByFactName(factName)),
  );

  return uniqueBy(
    factGroups.flatMap((items) => items),
    (item) => item.knowledgeId.toString(),
  );
}

export function createRelationshipIntelligenceEngine(
  dependencies: RelationshipIntelligenceEngineDependencies,
): RelationshipIntelligenceEngine {
  return {
    async generateReport(input: RelationshipIntelligenceInput): Promise<RelationshipIntelligenceReport> {
      const generatedAt = new Date().toISOString();
      const passportId = PassportId.fromString(input.passportId);
      const passport = await dependencies.businessPassportRepository.findById(passportId);

      if (!passport) {
        throw new Error(`Business Passport ${input.passportId} was not found.`);
      }

      const documentIds = await collectDocumentIds({
        input,
        documentsRepository: dependencies.documentsRepository,
      });

      const observedDocumentTypes = await collectObservedDocumentTypes({
        input,
        documentsRepository: dependencies.documentsRepository,
        documentIds,
      });

      const evidence = await collectEvidence({
        evidenceRepository: dependencies.evidenceRepository,
        documentIds,
      });

      const knowledge = await collectKnowledge({
        knowledgeRepository: dependencies.knowledgeRepository,
        factNames: input.knowledgeFactNames ?? DEFAULT_KNOWLEDGE_FACT_NAMES,
      });

      const workspaceIntelligence = input.customerId && dependencies.workspaceIntelligenceProvider
        ? await dependencies.workspaceIntelligenceProvider(input.customerId)
        : null;

      const documentCoverage = buildDocumentCoverageSummary({
        requiredDocuments: input.requiredDocuments ?? [],
        observedDocumentTypes,
      });
      const evidenceSummary = buildEvidenceSummary(evidence);
      const knowledgeSummary = buildKnowledgeSummary(knowledge);
      const relationshipConfidence = buildRelationshipConfidence({
        passport,
        evidenceSummary,
        knowledgeSummary,
        missingDocuments: documentCoverage.missingDocuments,
      });

      return {
        generatedAt,
        corporateIdentitySummary: {
          legalName: passport.profiles.identityProfile.legalName,
          registrationNumber: passport.profiles.identityProfile.registrationNumber,
          jurisdiction: passport.profiles.identityProfile.jurisdiction,
          entityType: passport.profiles.identityProfile.entityType,
          incorporationDate: passport.profiles.identityProfile.incorporationDate,
        },
        financialSummary: buildFinancialSummary(passport),
        tradeActivitySummary: buildTradeActivitySummary(evidence),
        complianceSummary: {
          jurisdictionalStatus: passport.profiles.complianceProfile.jurisdictionalStatus,
          sanctionsScreeningStatus: passport.profiles.complianceProfile.sanctionsScreeningStatus,
          complianceSignals: passport.profiles.complianceProfile.complianceSignals ?? [],
        },
        documentCoverage,
        evidenceSummary,
        knowledgeSummary,
        missingDocuments: documentCoverage.missingDocuments,
        relationshipConfidence,
        institutionalAlerts: buildInstitutionalAlerts({
          documentCoverage,
          evidenceSummary,
          knowledgeSummary,
          workspaceIntelligence,
          passport,
        }),
      };
    },
  };
}
