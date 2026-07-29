import { Activity, AlertTriangle, BookCheck, CheckCircle2, Layers3, Wallet } from "lucide-react";
import StatCard from "@/components/ui/StatCard";

export interface BusinessMetric {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly note?: string;
  readonly icon?: "exposure" | "activity" | "coverage" | "alerts" | "compliance" | "workflow";
}

export interface BusinessMetricsProps {
  readonly metrics: readonly BusinessMetric[];
}

function resolveIcon(icon: BusinessMetric["icon"]) {
  if (icon === "exposure") {
    return Wallet;
  }

  if (icon === "activity") {
    return Activity;
  }

  if (icon === "coverage") {
    return Layers3;
  }

  if (icon === "alerts") {
    return AlertTriangle;
  }

  if (icon === "compliance") {
    return BookCheck;
  }

  if (icon === "workflow") {
    return CheckCircle2;
  }

  return undefined;
}

export default function BusinessMetrics({ metrics }: BusinessMetricsProps) {
  return (
    <section aria-label="Business metrics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {metrics.map((metric) => (
        <StatCard
          key={metric.id}
          label={metric.label}
          value={metric.value}
          delta={metric.note}
          icon={resolveIcon(metric.icon)}
        />
      ))}
    </section>
  );
}
