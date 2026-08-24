import type { KPI } from "@/lib/intelligence/kpi/KPI";
import type { KPIId } from "@/lib/intelligence/kpi/KPIId";
import type { KPIMetadata } from "@/lib/intelligence/kpi/KPIMetadata";
import type { KPIStatus } from "@/lib/intelligence/kpi/KPIStatus";
import type { KPIType } from "@/lib/intelligence/kpi/KPIType";

export interface CreateKPIInput {
  readonly kpiId: KPIId;
  readonly name: string;
  readonly description: string;
  readonly type: KPIType;
  readonly status: KPIStatus;
  readonly value: number;
  readonly unit: string;
  readonly target: number;
  readonly trend: string;
  readonly measuredAt: string;
  readonly metadata: KPIMetadata;
}

export interface KPIService {
  create(input: CreateKPIInput): Promise<KPI>;
  get(kpiId: KPIId): Promise<KPI | null>;
  listByType(type: KPIType): Promise<readonly KPI[]>;
  listByStatus(status: KPIStatus): Promise<readonly KPI[]>;
}