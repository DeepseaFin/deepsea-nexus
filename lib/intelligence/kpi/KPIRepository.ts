import type { KPI } from "@/lib/intelligence/kpi/KPI";
import type { KPIId } from "@/lib/intelligence/kpi/KPIId";
import type { KPIStatus } from "@/lib/intelligence/kpi/KPIStatus";
import type { KPIType } from "@/lib/intelligence/kpi/KPIType";

export interface KPIRepository {
  findById(kpiId: KPIId): Promise<KPI | null>;
  save(kpi: KPI): Promise<void>;
  listByType(type: KPIType): Promise<readonly KPI[]>;
  listByStatus(status: KPIStatus): Promise<readonly KPI[]>;
}