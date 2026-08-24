import type { JourneyRecommendation, JourneyState, JourneyStep, JourneyTimelineEvent } from "@/lib/journey";
import type { JourneyBusinessPassportViewModel } from "@/src/capabilities/journey/adapters/getJourneyBusinessPassportProjection";
import type { JourneyWorkspaceEvidenceViewModel } from "@/src/capabilities/journey/adapters/getJourneyWorkspacePipelineProjection";
import type { JourneyKnowledgeInsightsViewModel } from "@/src/capabilities/journey/adapters/getJourneyKnowledgeInsightsProjection";
import type { ExecutiveDecisionProjection } from "@/src/capabilities/journey/adapters/getExecutiveDecisionProjection";
import type { ExplainabilityProjection } from "@/src/capabilities/journey/adapters/getExplainabilityProjection";
import type { InstitutionalTimelineProjection } from "@/src/capabilities/journey/adapters/getInstitutionalTimelineProjection";
import type { InstitutionalHealthProjection } from "@/src/capabilities/journey/adapters/getInstitutionalHealthProjection";

export interface JourneyWorkspaceProjection {
  readonly journeyState: JourneyState;
  readonly steps: readonly JourneyStep[];
  readonly recommendations: readonly JourneyRecommendation[];
  readonly missingItems: readonly string[];
  readonly nextAction: string;
  readonly actions: readonly string[];
  readonly timeline: readonly JourneyTimelineEvent[];
  readonly businessPassport: JourneyBusinessPassportViewModel;
  readonly evidence: JourneyWorkspaceEvidenceViewModel;
  readonly knowledgeInsights: JourneyKnowledgeInsightsViewModel;
  readonly executiveDecision: ExecutiveDecisionProjection;
  readonly explainability: ExplainabilityProjection;
  readonly institutionalTimeline: InstitutionalTimelineProjection;
  readonly institutionalHealth: InstitutionalHealthProjection;
}
