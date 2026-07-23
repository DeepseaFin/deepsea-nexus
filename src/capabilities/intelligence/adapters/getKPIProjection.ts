import type { KPI } from "@/lib/intelligence/kpi/KPI";
import type {
  KPIProjection,
  KPIProjectionSummaryMetadata,
} from "@/src/capabilities/intelligence/projections/KPIProjection";

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toISOString();
}

function toSummaryMetadata(kpi: KPI): KPIProjectionSummaryMetadata {
  return {
    sourceSystem: kpi.metadata.sourceSystem ?? "Unknown source",
    sourceReference: kpi.metadata.sourceReference ?? "Unavailable reference",
    tags: kpi.metadata.tags ?? [],
    attributeCount: Object.keys(kpi.metadata.attributes ?? {}).length,
  };
}

export function getKPIProjection(kpi: KPI): KPIProjection {
  return {
    kpiId: kpi.kpiId.toString(),
    name: kpi.name,
    description: kpi.description,
    type: kpi.type,
    status: kpi.status,
    value: kpi.value,
    unit: kpi.unit,
    target: kpi.target,
    trend: kpi.trend,
    measuredAt: formatTimestamp(kpi.measuredAt),
    summaryMetadata: toSummaryMetadata(kpi),
  };
}