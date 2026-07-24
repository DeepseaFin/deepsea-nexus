import React from "react";
import DashboardSection from "@/components/dashboard/DashboardSection";
import EmptyState from "@/components/ui/EmptyState";
import type { DashboardActivityItem } from "@/lib/dashboard/dashboard.types";

export interface RecentActivityPanelProps {
  readonly items: readonly DashboardActivityItem[];
}

export default function RecentActivityPanel({ items }: RecentActivityPanelProps) {
  return (
    <DashboardSection
      title="Recent Activity"
      subtitle="Role and workflow events from connected capabilities"
    >
      {items.length === 0 ? (
        <EmptyState
          title="No recent activity"
          description="Activity events will appear here when integrated sources publish timeline entries."
        />
      ) : (
        <ol className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="relative rounded-xl border border-slate-800 bg-slate-950/70 p-3 pl-5">
              <span
                className="absolute left-2 top-4 h-2 w-2 rounded-full bg-cyan-400"
                aria-hidden="true"
              />
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-100">{item.title}</h3>
                <span className="text-xs text-slate-500">{item.timestamp}</span>
              </div>
              <p className="mt-1 text-sm text-slate-400">{item.description}</p>
              {item.actor ? <p className="mt-1 text-xs text-slate-500">Actor: {item.actor}</p> : null}
            </li>
          ))}
        </ol>
      )}
    </DashboardSection>
  );
}
