import type { DecisionPackageStatus } from "@/lib/orchestration/decision-package/DecisionPackageStatus";

export interface DecisionPackageMetadata {
  readonly packageId: string;
  readonly generatedAt: string;
  readonly pipelineVersion: string;
  readonly overallConfidence: number;
  readonly packageStatus: DecisionPackageStatus;
}
