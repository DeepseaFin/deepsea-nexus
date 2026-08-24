import type { Insight } from "@/lib/intelligence/insight/Insight";
import type { InsightId } from "@/lib/intelligence/insight/InsightId";
import type { InsightStatus } from "@/lib/intelligence/insight/InsightStatus";
import type { InsightType } from "@/lib/intelligence/insight/InsightType";

export interface InsightRepository {
  findById(insightId: InsightId): Promise<Insight | null>;
  save(insight: Insight): Promise<void>;
  listByType(insightType: InsightType): Promise<readonly Insight[]>;
  listByStatus(status: InsightStatus): Promise<readonly Insight[]>;
}