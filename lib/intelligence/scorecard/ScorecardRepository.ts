import type { Scorecard } from "@/lib/intelligence/scorecard/Scorecard";
import type { ScorecardId } from "@/lib/intelligence/scorecard/ScorecardId";
import type { ScorecardStatus } from "@/lib/intelligence/scorecard/ScorecardStatus";
import type { ScorecardType } from "@/lib/intelligence/scorecard/ScorecardType";

export interface ScorecardRepository {
  findById(scorecardId: ScorecardId): Promise<Scorecard | null>;
  save(scorecard: Scorecard): Promise<void>;
  listByType(type: ScorecardType): Promise<readonly Scorecard[]>;
  listByStatus(status: ScorecardStatus): Promise<readonly Scorecard[]>;
}