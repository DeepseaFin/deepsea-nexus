import type { ObservationId } from "@/lib/intelligence/observation/ObservationId";
import type { Insight } from "@/lib/intelligence/insight/Insight";
import type { InsightId } from "@/lib/intelligence/insight/InsightId";
import type { InsightMetadata } from "@/lib/intelligence/insight/InsightMetadata";
import type { InsightStatus } from "@/lib/intelligence/insight/InsightStatus";
import type { InsightType } from "@/lib/intelligence/insight/InsightType";

export interface CreateInsightInput {
  readonly insightId: InsightId;
  readonly title: string;
  readonly description: string;
  readonly insightType: InsightType;
  readonly status: InsightStatus;
  readonly sourceObservationIds: readonly ObservationId[];
  readonly confidence: number;
  readonly generatedAt: string;
  readonly metadata: InsightMetadata;
}

export interface InsightService {
  create(input: CreateInsightInput): Promise<Insight>;
  get(insightId: InsightId): Promise<Insight | null>;
  listByType(insightType: InsightType): Promise<readonly Insight[]>;
  listByStatus(status: InsightStatus): Promise<readonly Insight[]>;
}