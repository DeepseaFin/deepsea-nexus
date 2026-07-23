import {
  businessOnboardingPipeline,
  type BusinessOnboardingPipeline,
} from "@/lib/business-onboarding/BusinessOnboardingPipeline";
import type { BusinessPassportService } from "@/lib/business-passport/services/BusinessPassportService";
import {
  institutionalGraphBuilder,
  type InstitutionalGraphBuilder,
} from "@/lib/institutional-intelligence/services/InstitutionalGraphBuilder";
import {
  businessSignalEngine,
  type BusinessSignalEngine,
} from "@/lib/institutional-intelligence/signals/BusinessSignalEngine";
import {
  institutionalProfileEngine,
  type InstitutionalProfileEngine,
} from "@/lib/institutional-intelligence/profile/InstitutionalProfileEngine";
import {
  institutionHealthEngine,
  type InstitutionHealthEngine,
} from "@/lib/institutional-intelligence/health/InstitutionHealthEngine";
import {
  riskSignalEngine,
  type RiskSignalEngine,
} from "@/lib/institutional-intelligence/risk/RiskSignalEngine";
import {
  recommendationEngine,
  type RecommendationEngine,
} from "@/lib/institutional-intelligence/recommendations/RecommendationEngine";
import type { JourneyContext } from "@/lib/orchestration/JourneyContext";
import type { JourneyOrchestrator } from "@/lib/orchestration/JourneyOrchestrator";
import type { JourneyResult } from "@/lib/orchestration/JourneyResult";
import { JourneyStage } from "@/lib/orchestration/JourneyStage";

export interface JourneyOrchestratorServiceDependencies {
  readonly businessPassportService: BusinessPassportService;
  readonly onboardingPipeline?: BusinessOnboardingPipeline;
  readonly graphBuilder?: InstitutionalGraphBuilder;
  readonly businessSignalEngine?: BusinessSignalEngine;
  readonly profileEngine?: InstitutionalProfileEngine;
  readonly healthEngine?: InstitutionHealthEngine;
  readonly riskEngine?: RiskSignalEngine;
  readonly recommendationEngine?: RecommendationEngine;
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

export class DefaultJourneyOrchestratorService implements JourneyOrchestrator {
  private readonly businessPassportService: BusinessPassportService;

  private readonly onboardingPipeline: BusinessOnboardingPipeline;

  private readonly graphBuilder: InstitutionalGraphBuilder;

  private readonly signalEngine: BusinessSignalEngine;

  private readonly profileEngine: InstitutionalProfileEngine;

  private readonly healthEngine: InstitutionHealthEngine;

  private readonly riskEngine: RiskSignalEngine;

  private readonly suggestionEngine: RecommendationEngine;

  constructor(dependencies: JourneyOrchestratorServiceDependencies) {
    this.businessPassportService = dependencies.businessPassportService;
    this.onboardingPipeline = dependencies.onboardingPipeline ?? businessOnboardingPipeline;
    this.graphBuilder = dependencies.graphBuilder ?? institutionalGraphBuilder;
    this.signalEngine = dependencies.businessSignalEngine ?? businessSignalEngine;
    this.profileEngine = dependencies.profileEngine ?? institutionalProfileEngine;
    this.healthEngine = dependencies.healthEngine ?? institutionHealthEngine;
    this.riskEngine = dependencies.riskEngine ?? riskSignalEngine;
    this.suggestionEngine = dependencies.recommendationEngine ?? recommendationEngine;
  }

  async orchestrate(context: JourneyContext): Promise<JourneyResult> {
    // Stage 1: Business Passport
    const createdBusinessPassport = await this.businessPassportService.create(context.passportInput);

    // Stage 2 + 3: Evidence + Knowledge
    const onboardingResults = [] as ReturnType<BusinessOnboardingPipeline["run"]>[];
    let projectedBusinessPassport = createdBusinessPassport;

    for (const evidenceInput of context.evidenceInputs) {
      const onboardingResult = this.onboardingPipeline.run({
        oracleDocument: evidenceInput.oracleDocument,
        passport: projectedBusinessPassport,
        evidenceReferences: evidenceInput.evidenceReferences,
      });

      onboardingResults.push(onboardingResult);
      projectedBusinessPassport = onboardingResult.passport;
    }

    const evidence = onboardingResults.map((result) => result.evidence);
    const knowledgeFacts = onboardingResults.flatMap((result) => result.knowledge.facts);

    // Stage 4: Institutional Fact Graph
    const institutionalFactGraph = this.graphBuilder.build({
      passport: projectedBusinessPassport,
      evidence,
      knowledgeFacts,
      onboardingResults,
    });

    // Stage 5: Business Signals
    const businessSignals = this.signalEngine.evaluate(institutionalFactGraph);

    // Stage 6: Institutional Profile
    const institutionalProfile = this.profileEngine.evaluate(businessSignals);

    // Stage 7: Institution Health
    const institutionHealth = this.healthEngine.evaluate(institutionalProfile);

    // Stage 8: Risk Signals
    const riskSignals = this.riskEngine.evaluate(institutionHealth);

    // Stage 9: Recommendations
    const recommendations = this.suggestionEngine.evaluate(riskSignals);

    return deepFreeze({
      journeyId: context.journeyId,
      completedStages: [
        JourneyStage.BusinessPassport,
        JourneyStage.Evidence,
        JourneyStage.Knowledge,
        JourneyStage.InstitutionalFactGraph,
        JourneyStage.BusinessSignals,
        JourneyStage.InstitutionalProfile,
        JourneyStage.InstitutionHealth,
        JourneyStage.RiskSignals,
        JourneyStage.Recommendations,
      ],
      artifacts: {
        createdBusinessPassport,
        projectedBusinessPassport,
        onboardingResults,
        evidence,
        knowledgeFacts,
        institutionalFactGraph,
        businessSignals,
        institutionalProfile,
        institutionHealth,
        riskSignals,
        recommendations,
      },
    });
  }
}

export function createJourneyOrchestratorService(
  dependencies: JourneyOrchestratorServiceDependencies,
): JourneyOrchestrator {
  return new DefaultJourneyOrchestratorService(dependencies);
}
