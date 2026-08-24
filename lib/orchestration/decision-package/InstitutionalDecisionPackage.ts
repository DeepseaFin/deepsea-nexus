import type { BusinessPassport } from "@/lib/business-passport/domain/BusinessPassport";
import type { Evidence } from "@/lib/evidence/domain/Evidence";
import type { InstitutionHealth } from "@/lib/institutional-intelligence/health/InstitutionHealth";
import type { InstitutionalFactGraph } from "@/lib/institutional-intelligence/domain/InstitutionalFactGraph";
import type { InstitutionalProfile } from "@/lib/institutional-intelligence/profile/InstitutionalProfile";
import type { Recommendation } from "@/lib/institutional-intelligence/recommendations/Recommendation";
import type { RiskSignal } from "@/lib/institutional-intelligence/risk/RiskSignal";
import type { BusinessSignal } from "@/lib/institutional-intelligence/signals/BusinessSignal";
import type { KnowledgeFact } from "@/lib/knowledge/domain/KnowledgeFact";
import type { DecisionPackageMetadata } from "@/lib/orchestration/decision-package/DecisionPackageMetadata";
import type { ExplainabilityResult } from "@/lib/orchestration/explainability/ExplainabilityResult";
import type { JourneyResult } from "@/lib/orchestration/JourneyResult";

export interface InstitutionalDecisionPackageArtifacts {
  readonly journeyResult: JourneyResult;
  readonly businessPassport: BusinessPassport;
  readonly evidence: readonly Evidence[];
  readonly knowledge: readonly KnowledgeFact[];
  readonly institutionalFactGraph: InstitutionalFactGraph;
  readonly businessSignals: readonly BusinessSignal[];
  readonly institutionalProfile: InstitutionalProfile;
  readonly institutionHealth: InstitutionHealth;
  readonly riskSignals: readonly RiskSignal[];
  readonly recommendations: readonly Recommendation[];
  readonly explainabilityResult: ExplainabilityResult;
}

export interface InstitutionalDecisionPackage {
  readonly metadata: DecisionPackageMetadata;
  readonly artifacts: InstitutionalDecisionPackageArtifacts;
}
