import React from "react";
import DashboardSection from "@/components/dashboard/DashboardSection";
import EmptyState from "@/components/ui/EmptyState";
import StatCard from "@/components/ui/StatCard";
import StatusChip from "@/components/ui/StatusChip";
import type { DashboardKpiItem } from "@/lib/dashboard/dashboard.types";

export interface InstitutionalKpiPanelProps {
  readonly title?: string;
  readonly subtitle?: string;
  readonly items: readonly DashboardKpiItem[];
}

export default function InstitutionalKpiPanel({
  title = "Institutional KPIs",
  subtitle = "Cross-role indicators configured by capability integrations",
  items,
}: InstitutionalKpiPanelProps) {
  return (
    <DashboardSection title={title} subtitle={subtitle}>
      {items.length === 0 ? (
        <EmptyState
          title="No KPI entries"
          description="KPI widgets will appear here once connected capability projections are provided."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="space-y-2">
              <StatCard
                label={item.title}
                value={item.value}
                delta={item.trend}
                icon={item.icon}
              />
              <div className="flex items-center justify-between gap-2 px-1">
                <StatusChip label={item.status ?? "default"} variant={item.status ?? "default"} />
                {item.footer ? <span className="text-xs text-slate-500">{item.footer}</span> : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardSection>
  );
}
