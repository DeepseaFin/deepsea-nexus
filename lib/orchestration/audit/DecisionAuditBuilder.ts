import {
  DecisionAuditActorType,
  type DecisionAuditActor,
} from "@/lib/orchestration/audit/DecisionAuditActor";
import { DecisionAuditEventType } from "@/lib/orchestration/audit/DecisionAuditEventType";
import type { DecisionAuditRecord } from "@/lib/orchestration/audit/DecisionAuditRecord";
import { workflowContractService, type WorkflowContractService } from "@/lib/orchestration/workflow/WorkflowContractService";
import type { InstitutionalDecisionPackage } from "@/lib/orchestration/decision-package/InstitutionalDecisionPackage";

export interface DecisionAuditBuilder {
  build(decisionPackage: InstitutionalDecisionPackage): DecisionAuditRecord;
}

export interface DecisionAuditBuilderOptions {
  readonly actor?: DecisionAuditActor;
  readonly eventType?: DecisionAuditEventType;
  readonly workflowContractService?: WorkflowContractService;
  readonly engineVersions?: Readonly<Record<string, string>>;
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

function clampUnit(value: number): number {
  if (value < 0) {
    return 0;
  }

  if (value > 1) {
    return 1;
  }

  return value;
}

function withTwoDecimals(value: number): number {
  return Number(value.toFixed(2));
}

function defaultEngineVersions(pipelineVersion: string): Readonly<Record<string, string>> {
  return {
    businessPassport: pipelineVersion,
    evidence: pipelineVersion,
    knowledge: pipelineVersion,
    institutionalFactGraph: pipelineVersion,
    businessSignals: pipelineVersion,
    institutionalProfile: pipelineVersion,
    institutionHealth: pipelineVersion,
    riskSignals: pipelineVersion,
    recommendations: pipelineVersion,
    explainability: pipelineVersion,
    decisionPackage: pipelineVersion,
  };
}

function createAuditId(decisionPackageId: string): string {
  return `decision-audit:${decisionPackageId}`;
}

const DEFAULT_ACTOR: DecisionAuditActor = {
  actorId: "orchestration.audit",
  actorType: DecisionAuditActorType.System,
  displayName: "Orchestration Audit",
};

export class DefaultDecisionAuditBuilder implements DecisionAuditBuilder {
  private readonly actor: DecisionAuditActor;

  private readonly eventType: DecisionAuditEventType;

  private readonly workflowContracts: WorkflowContractService;

  private readonly engineVersionOverrides?: Readonly<Record<string, string>>;

  constructor(options: DecisionAuditBuilderOptions = {}) {
    this.actor = options.actor ?? DEFAULT_ACTOR;
    this.eventType = options.eventType ?? DecisionAuditEventType.DecisionPackaged;
    this.workflowContracts = options.workflowContractService ?? workflowContractService;
    this.engineVersionOverrides = options.engineVersions;
  }

  build(decisionPackage: InstitutionalDecisionPackage): DecisionAuditRecord {
    const workflowVersion = this.workflowContracts.getWorkflowContract().workflowVersion;
    const pipelineVersion = decisionPackage.metadata.pipelineVersion;
    const recommendationIds = decisionPackage.artifacts.recommendations.map((item) => item.id);

    return deepFreeze({
      auditId: createAuditId(decisionPackage.metadata.packageId),
      decisionPackageId: decisionPackage.metadata.packageId,
      journeyId: decisionPackage.artifacts.journeyResult.journeyId,
      createdAt: new Date().toISOString(),
      pipelineVersion,
      workflowVersion,
      engineVersions: this.engineVersionOverrides ?? defaultEngineVersions(pipelineVersion),
      actor: this.actor,
      eventType: this.eventType,
      overallConfidence: withTwoDecimals(clampUnit(decisionPackage.metadata.overallConfidence)),
      recommendationIds,
      explainabilityReference: decisionPackage.artifacts.explainabilityResult.recommendation.id,
      metadata: {
        packageStatus: decisionPackage.metadata.packageStatus,
        recommendationCount: recommendationIds.length,
        completedStageCount: decisionPackage.artifacts.journeyResult.completedStages.length,
      },
    });
  }
}

export const decisionAuditBuilder: DecisionAuditBuilder = new DefaultDecisionAuditBuilder();
