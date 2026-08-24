import type { KPIId } from "@/lib/intelligence/kpi/KPIId";
import type { Scorecard } from "@/lib/intelligence/scorecard/Scorecard";
import type { ScorecardId } from "@/lib/intelligence/scorecard/ScorecardId";
import type { ScorecardMetadata } from "@/lib/intelligence/scorecard/ScorecardMetadata";
import type { ScorecardStatus } from "@/lib/intelligence/scorecard/ScorecardStatus";
import type { ScorecardType } from "@/lib/intelligence/scorecard/ScorecardType";

export interface CreateScorecardInput {
  readonly scorecardId: ScorecardId;
  readonly name: string;
  readonly description: string;
  readonly type: ScorecardType;
  readonly status: ScorecardStatus;
  readonly kpiIds: readonly KPIId[];
  readonly measuredAt: string;
  readonly metadata: ScorecardMetadata;
}

export interface ScorecardService {
  create(input: CreateScorecardInput): Promise<Scorecard>;
  get(scorecardId: ScorecardId): Promise<Scorecard | null>;
  listByType(type: ScorecardType): Promise<readonly Scorecard[]>;
  listByStatus(status: ScorecardStatus): Promise<readonly Scorecard[]>;
}