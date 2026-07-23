import type { BusinessOnboardingResult } from "@/lib/business-onboarding/BusinessOnboardingResult";
import type { BusinessPassport } from "@/lib/business-passport/domain/BusinessPassport";
import type { Evidence } from "@/lib/evidence/domain/Evidence";
import type { InstitutionHealth } from "@/lib/institutional-intelligence/health/InstitutionHealth";
import type { InstitutionalFactGraph } from "@/lib/institutional-intelligence/domain/InstitutionalFactGraph";
import type { InstitutionalProfile } from "@/lib/institutional-intelligence/profile/InstitutionalProfile";
import type { Recommendation } from "@/lib/institutional-intelligence/recommendations/Recommendation";
import type { RiskSignal } from "@/lib/institutional-intelligence/risk/RiskSignal";
import type { BusinessSignal } from "@/lib/institutional-intelligence/signals/BusinessSignal";
import type { KnowledgeFact } from "@/lib/knowledge/domain/KnowledgeFact";
import type { JourneyStage } from "@/lib/orchestration/JourneyStage";

export interface JourneyArtifacts {
  readonly createdBusinessPassport: BusinessPassport;
  readonly projectedBusinessPassport: BusinessPassport;
  readonly onboardingResults: readonly BusinessOnboardingResult[];
  readonly evidence: readonly Evidence[];
  readonly knowledgeFacts: readonly KnowledgeFact[];
  readonly institutionalFactGraph: InstitutionalFactGraph;
  readonly businessSignals: readonly BusinessSignal[];
  readonly institutionalProfile: InstitutionalProfile;
  readonly institutionHealth: InstitutionHealth;
  readonly riskSignals: readonly RiskSignal[];
  readonly recommendations: readonly Recommendation[];
}

export interface JourneyResult {
  readonly journeyId: string;
  readonly completedStages: readonly JourneyStage[];
  readonly artifacts: JourneyArtifacts;
}
