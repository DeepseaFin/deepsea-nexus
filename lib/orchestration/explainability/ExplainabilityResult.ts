import type { Evidence } from "@/lib/evidence/domain/Evidence";
import type { InstitutionHealthDimension } from "@/lib/institutional-intelligence/health/InstitutionHealthDimension";
import type { InstitutionalNode } from "@/lib/institutional-intelligence/domain/InstitutionalNode";
import type { InstitutionalProfileDimension } from "@/lib/institutional-intelligence/profile/InstitutionalProfileDimension";
import type { Recommendation } from "@/lib/institutional-intelligence/recommendations/Recommendation";
import type { RiskSignal } from "@/lib/institutional-intelligence/risk/RiskSignal";
import type { BusinessSignal } from "@/lib/institutional-intelligence/signals/BusinessSignal";
import type { KnowledgeFact } from "@/lib/knowledge/domain/KnowledgeFact";
import type { ExplainabilityPath } from "@/lib/orchestration/explainability/ExplainabilityPath";

export interface ExplainabilityResult {
  readonly recommendation: Recommendation;
  readonly supportingRisks: readonly RiskSignal[];
  readonly supportingHealthDimensions: readonly InstitutionHealthDimension[];
  readonly supportingProfileDimensions: readonly InstitutionalProfileDimension[];
  readonly supportingBusinessSignals: readonly BusinessSignal[];
  readonly supportingFacts: readonly InstitutionalNode[];
  readonly supportingKnowledge: readonly KnowledgeFact[];
  readonly supportingEvidence: readonly Evidence[];
  readonly confidence: number;
  readonly explanationPath: ExplainabilityPath;
}
