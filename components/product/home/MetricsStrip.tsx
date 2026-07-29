import { Activity, CheckCircle2, Clock3, Layers3, ShieldCheck, TrendingUp } from "lucide-react";
import StatCard from "@/components/ui/StatCard";

export interface MetricItem {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly delta?: string;
  readonly icon?: "activity" | "trend" | "queue" | "checks" | "coverage" | "risk";
}

export interface MetricsStripProps {
  readonly metrics: readonly MetricItem[];
}

function iconFromKey(icon: MetricItem["icon"]) {
  if (icon === "activity") {
    return Activity;
  }

  if (icon === "trend") {
    return TrendingUp;
  }

  if (icon === "queue") {
    return Clock3;
  }

  if (icon === "checks") {
    return CheckCircle2;
  }

  if (icon === "coverage") {
    return Layers3;
  }

  if (icon === "risk") {
    return ShieldCheck;
  }

  return undefined;
}

export default function MetricsStrip({ metrics }: MetricsStripProps) {
  return (
    <section aria-label="Operational metrics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {metrics.map((metric) => (
        <StatCard
          key={metric.id}
          label={metric.label}
          value={metric.value}
          delta={metric.delta}
          icon={iconFromKey(metric.icon)}
        />
      ))}
    </section>
  );
}
