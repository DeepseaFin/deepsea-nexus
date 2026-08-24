import type { KPIId } from "@/lib/intelligence/kpi/KPIId";
import type { KPIMetadata } from "@/lib/intelligence/kpi/KPIMetadata";
import type { KPIStatus } from "@/lib/intelligence/kpi/KPIStatus";
import type { KPIType } from "@/lib/intelligence/kpi/KPIType";

export interface KPI {
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