"use client";

import { memo } from "react";
import ActionCard from "@/components/customer/actions/ActionCard";
import type { RelationshipActionCenterItemViewModel } from "@/lib/customer/RelationshipActionCenterViewModel";

export type ActionPriorityGroupKey = "critical" | "high" | "medium" | "low";

export interface ActionPrioritySectionProps {
  readonly title: string;
  readonly priority: ActionPriorityGroupKey;
  readonly items: readonly RelationshipActionCenterItemViewModel[];
  readonly dueDatesByActionId?: Readonly<Record<string, string>>;
}

function borderTone(priority: ActionPriorityGroupKey): string {
  if (priority === "critical") {
    return "border-rose-700/60 bg-rose-950/20";
  }

  if (priority === "high") {
    return "border-rose-800/40 bg-rose-950/10";
  }

  if (priority === "medium") {
    return "border-amber-700/40 bg-amber-950/10";
  }

  return "border-cyan-700/40 bg-cyan-950/10";
}

function ActionPrioritySection({
  title,
  priority,
  items,
  dueDatesByActionId,
}: ActionPrioritySectionProps) {
  return (
    <section className="space-y-3" aria-label={`${title} actions`}>
      <div className={`flex items-center justify-between rounded-lg border px-3 py-2 ${borderTone(priority)}`}>
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">{items.length} actions</span>
      </div>

      {items.length > 0 ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {items.map((item) => (
            <ActionCard key={item.id} item={item} dueDate={dueDatesByActionId?.[item.id]} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-500">
          No actions in this priority group.
        </div>
      )}
    </section>
  );
}

const MemoizedActionPrioritySection = memo(ActionPrioritySection);
MemoizedActionPrioritySection.displayName = "ActionPrioritySection";

export default MemoizedActionPrioritySection;
