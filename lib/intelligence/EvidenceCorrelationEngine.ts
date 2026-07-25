import { ConfidenceBand } from "@/lib/business-passport/types/Confidence";
import type { DocumentsRepository } from "@/lib/documents/repositories/DocumentsRepository";
import { EvidenceStatus } from "@/lib/evidence/constants/EvidenceStatus";
import type { Evidence } from "@/lib/evidence/domain/Evidence";
import type { EvidenceRepository } from "@/lib/evidence/services/EvidenceRepository";
import type { KnowledgeFact } from "@/lib/knowledge/domain/KnowledgeFact";
import type { KnowledgeRepository } from "@/lib/knowledge/repositories/KnowledgeRepository";
import type { RelationshipIntelligenceEngine } from "@/lib/intelligence/RelationshipIntelligenceEngine";
import type {
  EvidenceConflictValue,
  EvidenceCorrelationFactReport,
  EvidenceCorrelationInput,
  EvidenceCorrelationReport,
} from "@/lib/intelligence/EvidenceCorrelationTypes";

const DEFAULT_FACT_NAMES: readonly string[] = [
  "legalName",
  "registrationNumber",
  "jurisdiction",
  "entityType",
  "invoiceNumber",
  "billOfLadingNumber",
  "packingListNumber",
  "policyNumber",
  "coverageType",
  "coverageAmount",
  "shipmentDate",
  "dueDate",
  "grossWeight",
  "netWeight",
];

interface EvidenceReferenceTrace {
  readonly fact: string;
  readonly value: string;
  readonly documentId: string;
  readonly source: string;
  readonly status: EvidenceStatus;
}

export interface EvidenceCorrelationEngineDependencies {
  readonly evidenceRepository: EvidenceRepository;
  readonly knowledgeRepository: KnowledgeRepository;
  readonly documentsRepository?: DocumentsRepository;
  readonly relationshipIntelligenceEngine?: RelationshipIntelligenceEngine;
}

export interface EvidenceCorrelationEngine {
  correlateEvidence(input: EvidenceCorrelationInput): Promise<EvidenceCorrelationReport>;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
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

function unique(values: readonly string[]): readonly string[] {
  return [...new Set(values)];
}

function toReferenceTraces(evidence: readonly Evidence[]): readonly EvidenceReferenceTrace[] {
  return evidence.flatMap((item) =>
    item.references.map((reference) => ({
      fact: reference.section,
      value: reference.fragment,
      documentId: item.metadata.documentId,
      source: item.source,
      status: item.status,
    }))
  );
}

function groupTracesByFact(traces: readonly EvidenceReferenceTrace[]): Map<string, EvidenceReferenceTrace[]> {
  const grouped = new Map<string, EvidenceReferenceTrace[]>();

  for (const trace of traces) {
    const existing = grouped.get(trace.fact) ?? [];
    existing.push(trace);
    grouped.set(trace.fact, existing);
  }

  return grouped;
}

function detectConflicts(traces: readonly EvidenceReferenceTrace[]): readonly EvidenceConflictValue[] {
  const valuesByNormalized = new Map<string, EvidenceReferenceTrace[]>();

  for (const trace of traces) {
    const key = normalize(trace.value);
    const bucket = valuesByNormalized.get(key) ?? [];
    bucket.push(trace);
    valuesByNormalized.set(key, bucket);
  }

  if (valuesByNormalized.size <= 1) {
    return [];
  }

  return [...valuesByNormalized.values()].map((bucket) => ({
    value: bucket[0]?.value ?? "",
    supportingDocuments: unique(bucket.map((item) => item.documentId)),
    occurrences: bucket.length,
  }));
}

function computeConfidenceScore(params: {
  readonly traces: readonly EvidenceReferenceTrace[];
  readonly conflicts: readonly EvidenceConflictValue[];
  readonly knowledgeFacts: readonly KnowledgeFact[];
}): number {
  if (params.traces.length === 0) {
    return 0;
  }

  const uniqueSources = unique(params.traces.map((trace) => trace.source)).length;
  const validCount = params.traces.filter((trace) => trace.status === EvidenceStatus.Valid).length;
  const pendingCount = params.traces.filter((trace) => trace.status === EvidenceStatus.PendingValidation).length;

  const sourceScore = Math.min(uniqueSources, 4) * 15;
  const qualityScore = ((validCount + pendingCount * 0.5) / params.traces.length) * 35;
  const conflictPenalty = params.conflicts.length > 0 ? 25 : 0;

  const verifiedKnowledge = params.knowledgeFacts.filter((fact) => fact.verified).length;
  const knowledgeBoost = params.knowledgeFacts.length === 0
    ? 0
    : Math.min(verifiedKnowledge / params.knowledgeFacts.length, 1) * 10;

  return Math.round(clamp(20 + sourceScore + qualityScore + knowledgeBoost - conflictPenalty, 0, 100));
}

async function collectDocumentIds(params: {
  readonly input: EvidenceCorrelationInput;
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

async function collectEvidence(params: {
  readonly evidenceRepository: EvidenceRepository;
  readonly documentIds: readonly string[];
}): Promise<readonly Evidence[]> {
  const groups = await Promise.all(
    params.documentIds.map((documentId) => params.evidenceRepository.listByDocumentId(documentId)),
  );

  const flattened = groups.flatMap((items) => items);
  const uniqueById = new Map<string, Evidence>();

  for (const item of flattened) {
    uniqueById.set(item.evidenceId.toString(), item);
  }

  return [...uniqueById.values()];
}

async function collectKnowledgeByFact(params: {
  readonly knowledgeRepository: KnowledgeRepository;
  readonly factName: string;
}): Promise<readonly KnowledgeFact[]> {
  return params.knowledgeRepository.listByFactName(params.factName);
}

export function createEvidenceCorrelationEngine(
  dependencies: EvidenceCorrelationEngineDependencies,
): EvidenceCorrelationEngine {
  return {
    async correlateEvidence(input: EvidenceCorrelationInput): Promise<EvidenceCorrelationReport> {
      const generatedAt = new Date().toISOString();
      const documentIds = await collectDocumentIds({
        input,
        documentsRepository: dependencies.documentsRepository,
      });

      const evidence = await collectEvidence({
        evidenceRepository: dependencies.evidenceRepository,
        documentIds,
      });

      const grouped = groupTracesByFact(toReferenceTraces(evidence));
      const factNames = unique([...(input.factNames ?? DEFAULT_FACT_NAMES), ...grouped.keys()]);

      const facts: EvidenceCorrelationFactReport[] = [];

      for (const factName of factNames) {
        const traces = grouped.get(factName) ?? [];
        if (traces.length === 0) {
          continue;
        }

        const supportingDocuments = unique(traces.map((trace) => trace.documentId));
        const numberOfSources = unique(traces.map((trace) => trace.source)).length;
        const conflicts = detectConflicts(traces);
        const knowledgeFacts = await collectKnowledgeByFact({
          knowledgeRepository: dependencies.knowledgeRepository,
          factName,
        });

        const confidenceScore = computeConfidenceScore({
          traces,
          conflicts,
          knowledgeFacts,
        });

        facts.push({
          fact: factName,
          supportingDocuments,
          numberOfSources,
          conflicts,
          confidenceLevel: toConfidenceBand(confidenceScore),
          confidenceScore,
        });
      }

      const relationshipContext = dependencies.relationshipIntelligenceEngine
        ? await dependencies.relationshipIntelligenceEngine.generateReport({
            passportId: input.passportId,
            customerId: input.customerId,
            documentIds,
            knowledgeFactNames: factNames,
          })
        : null;

      const sortedFacts = [...facts].sort((left, right) => left.fact.localeCompare(right.fact));

      return {
        generatedAt,
        passportId: input.passportId,
        facts: sortedFacts,
        totalFacts: sortedFacts.length,
        conflictingFacts: sortedFacts.filter((fact) => fact.conflicts.length > 0).length,
        relationshipContext: relationshipContext
          ? {
              relationshipConfidenceScore: relationshipContext.relationshipConfidence.score,
              relationshipConfidenceBand: relationshipContext.relationshipConfidence.band,
              missingDocuments: relationshipContext.missingDocuments,
            }
          : undefined,
      };
    },
  };
}
