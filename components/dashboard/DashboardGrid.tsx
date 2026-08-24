import React from "react";
import type { DashboardLayoutConfig, DashboardWidgetConfig } from "@/lib/dashboard/dashboard.types";

export interface DashboardGridProps {
  readonly layout: DashboardLayoutConfig;
  readonly renderWidget: (widget: DashboardWidgetConfig) => React.ReactNode;
}

export default function DashboardGrid({ layout, renderWidget }: DashboardGridProps) {
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5" aria-label="Dashboard widget grid">
      {layout.widgets.map((widget) => (
        <div key={widget.id} className={widget.width === "full" ? "lg:col-span-2" : "lg:col-span-1"}>
          {renderWidget(widget)}
        </div>
      ))}
    </section>
  );
}
