"use client";

import React from "react";
import { CalendarDays, Filter, LayoutGrid } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import DashboardGrid from "@/components/dashboard/DashboardGrid";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import PriorityActionsPanel from "@/components/dashboard/PriorityActionsPanel";
import type {
  DashboardHeaderModel,
  DashboardLayoutConfig,
  DashboardPriorityAction,
  DashboardWidgetConfig,
  DashboardWidgetId,
} from "@/lib/dashboard/dashboard.types";
import { designTokens } from "@/lib/design/tokens";

export interface DashboardShellProps {
  readonly header: DashboardHeaderModel;
  readonly priorityActions: readonly DashboardPriorityAction[];
  readonly layout: DashboardLayoutConfig;
  readonly widgets: Readonly<Record<DashboardWidgetId, React.ReactNode>>;
}

export default function DashboardShell({ header, priorityActions, layout, widgets }: DashboardShellProps) {
  return (
    <div className="space-y-4 sm:space-y-5">
      <DashboardHeader model={header} />

      <PriorityActionsPanel actions={priorityActions} />

      <AnimatePresence mode="wait">
        <motion.div
          key={layout.widgets.map((item) => item.id).join("-")}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: designTokens.duration.standard / 1000 }}
        >
          <DashboardGrid
            layout={layout}
            renderWidget={(widget: DashboardWidgetConfig) => (
              <section aria-label={widget.title}>
                {widgets[widget.id] ?? (
                  <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-5 text-sm text-slate-500">
                    <div className="inline-flex items-center gap-2 text-slate-400">
                      <LayoutGrid className="h-4 w-4" />
                      <span>{widget.title}</span>
                    </div>
                    <p className="mt-2">{widget.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-2 py-1">
                        <Filter className="h-3 w-3" />
                        Configurable widget slot
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-2 py-1">
                        <CalendarDays className="h-3 w-3" />
                        Ready for integration
                      </span>
                    </div>
                  </div>
                )}
              </section>
            )}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
