import type { OpportunityLifecycle } from "@/lib/workflows/WorkflowTransition";

export type InstitutionHomeIntelligenceType =
  | "guidance"
  | "warning"
  | "suggestion"
  | "summary"
  | "context"
  | "explanation";

export type InstitutionHomeIntelligencePriority = "high" | "medium" | "low";

export type InstitutionHomeIntelligenceSourceType =
  | "workflow"
  | "documents"
  | "approvals"
  | "relationship"
  | "operations"
  | "system";

export interface InstitutionHomeUserContext {
  readonly actorId: string;
  readonly experienceContext: "employee" | "client";
  readonly roleLabel: string;
  readonly workspace: string;
}

export interface InstitutionHomeIntelligenceContext {
  readonly route: string;
  readonly generatedAt: string;
  readonly activeOpportunityCount: number;
  readonly opportunityId?: string;
  readonly lifecycle?: OpportunityLifecycle;
}

export interface InstitutionHomeActionTarget {
  readonly label: string;
  readonly target: string;
}

export interface InstitutionHomeSourceReference {
  readonly type: InstitutionHomeIntelligenceSourceType;
  readonly label: string;
  readonly reference?: string;
}

export interface InstitutionHomeIntelligenceResult {
  readonly id: string;
  readonly type: InstitutionHomeIntelligenceType;
  readonly title: string;
  readonly explanation: string;
  readonly priority: InstitutionHomeIntelligencePriority;
  readonly confidence?: number;
  readonly source?: InstitutionHomeSourceReference;
  readonly recommendedAction?: InstitutionHomeActionTarget;
}

export interface InstitutionHomeIntelligenceSurface {
  readonly userContext: InstitutionHomeUserContext;
  readonly intelligenceContext: InstitutionHomeIntelligenceContext;
  readonly results: readonly InstitutionHomeIntelligenceResult[];
}

export interface InstitutionHomeInsightViewModel {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly confidence: number;
  readonly tags: readonly string[];
}

function normalizeConfidence(value: number | undefined): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 72;
  }

  if (value < 0) {
    return 0;
  }

  if (value > 100) {
    return 100;
  }

  return Math.round(value);
}

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function summarize(result: InstitutionHomeIntelligenceResult): string {
  const action = result.recommendedAction ? ` Next action: ${result.recommendedAction.label}.` : "";
  const source = result.source ? ` Source: ${result.source.label}.` : "";
  return `${result.explanation}${source}${action}`;
}

export function toInstitutionHomeInsightViewModel(
  surface: InstitutionHomeIntelligenceSurface,
): readonly InstitutionHomeInsightViewModel[] {
  return surface.results.map((result) => ({
    id: result.id,
    title: result.title,
    summary: summarize(result),
    confidence: normalizeConfidence(result.confidence),
    tags: [titleCase(result.type), titleCase(result.priority)],
  }));
}
