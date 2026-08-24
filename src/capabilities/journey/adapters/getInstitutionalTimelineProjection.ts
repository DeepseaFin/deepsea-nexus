import type { JourneyResult } from "@/lib/orchestration/JourneyResult";
import type { DecisionAuditRecord } from "@/lib/orchestration/audit/DecisionAuditRecord";

export type InstitutionalTimelineEventStatus = "completed" | "pending";

export interface InstitutionalTimelineEventViewModel {
  readonly timestamp: string;
  readonly title:
    | "Journey Created"
    | "Evidence Added"
    | "Knowledge Extracted"
    | "Intelligence Evaluated"
    | "Decision Generated"
    | "Explainability Generated"
    | "Audit Recorded";
  readonly description: string;
  readonly status: InstitutionalTimelineEventStatus;
  readonly artifactReference: string;
}

export interface InstitutionalTimelineProjection {
  readonly currentJourneyStatus: string;
  readonly events: readonly InstitutionalTimelineEventViewModel[];
}

const MISSING_TIMESTAMP = "Timestamp unavailable";

function toTimestampOrFallback(input?: string): string {
  if (!input) {
    return MISSING_TIMESTAMP;
  }

  return input;
}

function getEarliestTimestamp(timestamps: readonly string[]): string | undefined {
  if (timestamps.length === 0) {
    return undefined;
  }

  return [...timestamps].sort()[0];
}

function toCurrentJourneyStatus(journeyResult: JourneyResult): string {
  if (journeyResult.completedStages.length === 0) {
    return "No completed stages recorded";
  }

  const latestStage = journeyResult.completedStages[journeyResult.completedStages.length - 1];

  return `Completed ${journeyResult.completedStages.length} stages. Latest: ${latestStage}.`;
}

export function getInstitutionalTimelineProjection(
  journeyResult: JourneyResult,
  decisionAuditRecord: DecisionAuditRecord,
): InstitutionalTimelineProjection {
  const passport = journeyResult.artifacts.projectedBusinessPassport;
  const journeyCreatedAt = passport.metadata.audit.createdAt;

  const evidenceTimestamps = journeyResult.artifacts.evidence.map((item) => item.metadata.uploadedAt);
  const knowledgeTimestamps = journeyResult.artifacts.knowledgeFacts.map((item) => item.metadata.createdAt);

  const evidenceAddedAt = getEarliestTimestamp(evidenceTimestamps);
  const knowledgeExtractedAt = getEarliestTimestamp(knowledgeTimestamps);

  const intelligenceEvaluatedAt =
    journeyResult.artifacts.institutionHealth.generatedAt || journeyResult.artifacts.institutionalProfile.generatedAt;

  const events: readonly InstitutionalTimelineEventViewModel[] = [
    {
      timestamp: toTimestampOrFallback(journeyCreatedAt),
      title: "Journey Created",
      description: "Institutional journey was initialized from the canonical business passport audit trail.",
      status: journeyCreatedAt ? "completed" : "pending",
      artifactReference: journeyResult.journeyId,
    },
    {
      timestamp: toTimestampOrFallback(evidenceAddedAt),
      title: "Evidence Added",
      description: "Evidence artifacts were attached to the institutional journey context.",
      status: journeyResult.artifacts.evidence.length > 0 ? "completed" : "pending",
      artifactReference: journeyResult.artifacts.evidence[0]?.evidenceId.toString() ?? "No evidence reference",
    },
    {
      timestamp: toTimestampOrFallback(knowledgeExtractedAt),
      title: "Knowledge Extracted",
      description: "Knowledge facts were extracted and attached to the institutional record.",
      status: journeyResult.artifacts.knowledgeFacts.length > 0 ? "completed" : "pending",
      artifactReference: journeyResult.artifacts.knowledgeFacts[0]?.knowledgeId.toString() ?? "No knowledge reference",
    },
    {
      timestamp: toTimestampOrFallback(intelligenceEvaluatedAt),
      title: "Intelligence Evaluated",
      description: "Institutional profile, health, risk, and recommendation artifacts were evaluated.",
      status: journeyResult.completedStages.length > 0 ? "completed" : "pending",
      artifactReference: journeyResult.artifacts.institutionHealth.id,
    },
    {
      timestamp: toTimestampOrFallback(decisionAuditRecord.createdAt),
      title: "Decision Generated",
      description: "Decision package output was generated and linked to journey intelligence artifacts.",
      status: decisionAuditRecord.decisionPackageId ? "completed" : "pending",
      artifactReference: decisionAuditRecord.decisionPackageId,
    },
    {
      timestamp: toTimestampOrFallback(decisionAuditRecord.createdAt),
      title: "Explainability Generated",
      description: "Explainability reference was produced for recommendation traceability.",
      status: decisionAuditRecord.explainabilityReference ? "completed" : "pending",
      artifactReference: decisionAuditRecord.explainabilityReference,
    },
    {
      timestamp: toTimestampOrFallback(decisionAuditRecord.createdAt),
      title: "Audit Recorded",
      description: "Canonical audit record captured decision event metadata and confidence.",
      status: decisionAuditRecord.auditId ? "completed" : "pending",
      artifactReference: decisionAuditRecord.auditId,
    },
  ];

  return {
    currentJourneyStatus: toCurrentJourneyStatus(journeyResult),
    events,
  };
}
