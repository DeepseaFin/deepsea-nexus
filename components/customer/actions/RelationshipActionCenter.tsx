"use client";

import { useMemo, useState } from "react";
import ActionPrioritySection from "@/components/customer/actions/ActionPrioritySection";
import ActionToolbar, { type ActionToolbarValue } from "@/components/customer/actions/ActionToolbar";
import SectionCard from "@/components/ui/SectionCard";
import type {
  RelationshipActionCategory,
  RelationshipActionCenterItemViewModel,
  RelationshipActionCenterViewModel,
  RelationshipActionPriority,
} from "@/lib/customer/RelationshipActionCenterViewModel";

export interface RelationshipActionCenterProps {
  readonly actionCenter: RelationshipActionCenterViewModel;
  readonly dueDatesByActionId?: Readonly<Record<string, string>>;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function isCritical(item: RelationshipActionCenterItemViewModel): boolean {
  if (item.priority !== "high") {
    return false;
  }

  const ref = normalize(item.supportingIntelligence.reference);
  return ref.includes("blockingissues") || ref.includes("missingdocuments");
}

function flattenUnique(center: RelationshipActionCenterViewModel): RelationshipActionCenterItemViewModel[] {
  const byId = new Map<string, RelationshipActionCenterItemViewModel>();

  for (const category of center.categories) {
    const all = [...category.priorities.high, ...category.priorities.medium, ...category.priorities.low];
    for (const item of all) {
      byId.set(item.id, item);
    }
  }

  return [...byId.values()];
}

function sortItems(
  items: readonly RelationshipActionCenterItemViewModel[],
  sortOrder: ActionToolbarValue["sortOrder"],
): RelationshipActionCenterItemViewModel[] {
  if (sortOrder === "title") {
    return [...items].sort((left, right) => left.title.localeCompare(right.title));
  }

  const order: Record<RelationshipActionPriority, number> = {
    high: 0,
    medium: 1,
    low: 2,
  };

  return [...items].sort((left, right) => {
    if (left.priority !== right.priority) {
      return order[left.priority] - order[right.priority];
    }

    return left.title.localeCompare(right.title);
  });
}

function matchesSearch(item: RelationshipActionCenterItemViewModel, query: string): boolean {
  if (!query) {
    return true;
  }

  const documents = item.relatedDocuments.map((document) => document.label).join(" ");
  const haystack = normalize(`${item.title} ${item.description} ${item.source} ${item.suggestedNextStep} ${documents}`);
  return haystack.includes(query);
}

function categoryForItem(
  item: RelationshipActionCenterItemViewModel,
  categories: readonly { key: RelationshipActionCategory; itemIds: readonly string[] }[],
): RelationshipActionCategory | null {
  for (const category of categories) {
    if (category.itemIds.includes(item.id)) {
      return category.key;
    }
  }

  return null;
}

export default function RelationshipActionCenter({
  actionCenter,
  dueDatesByActionId,
}: RelationshipActionCenterProps) {
  const [toolbarValue, setToolbarValue] = useState<ActionToolbarValue>({
    search: "",
    priority: "all",
    category: "all",
    sortOrder: "priority",
  });

  const categoryIndex = useMemo(() => {
    return actionCenter.categories.map((category) => ({
      key: category.key,
      itemIds: [
        ...category.priorities.high.map((item) => item.id),
        ...category.priorities.medium.map((item) => item.id),
        ...category.priorities.low.map((item) => item.id),
      ],
    }));
  }, [actionCenter.categories]);

  const categories = useMemo<readonly RelationshipActionCategory[]>(
    () => actionCenter.categories.map((category) => category.key),
    [actionCenter.categories],
  );

  const filtered = useMemo(() => {
    const query = normalize(toolbarValue.search);

    const all = flattenUnique(actionCenter)
      .filter((item) => matchesSearch(item, query))
      .filter((item) => {
        if (toolbarValue.priority === "all") {
          return true;
        }

        if (toolbarValue.priority === "critical") {
          return isCritical(item);
        }

        return item.priority === toolbarValue.priority;
      })
      .filter((item) => {
        if (toolbarValue.category === "all") {
          return true;
        }

        return categoryForItem(item, categoryIndex) === toolbarValue.category;
      });

    return sortItems(all, toolbarValue.sortOrder);
  }, [actionCenter, categoryIndex, toolbarValue.category, toolbarValue.priority, toolbarValue.search, toolbarValue.sortOrder]);

  const critical = filtered.filter((item) => isCritical(item));
  const high = filtered.filter((item) => item.priority === "high" && !isCritical(item));
  const medium = filtered.filter((item) => item.priority === "medium");
  const low = filtered.filter((item) => item.priority === "low");

  return (
    <div className="space-y-4">
      <SectionCard
        title="Relationship Action Center"
        subtitle={`${filtered.length} of ${actionCenter.totalActions} actions visible`}
      >
        <ActionToolbar value={toolbarValue} categories={categories} onChange={setToolbarValue} />
      </SectionCard>

      <SectionCard title="Priority Action Groups" subtitle="Critical, High, Medium, and Low">
        <div className="space-y-4">
          <ActionPrioritySection
            title="Critical"
            priority="critical"
            items={critical}
            dueDatesByActionId={dueDatesByActionId}
          />
          <ActionPrioritySection
            title="High"
            priority="high"
            items={high}
            dueDatesByActionId={dueDatesByActionId}
          />
          <ActionPrioritySection
            title="Medium"
            priority="medium"
            items={medium}
            dueDatesByActionId={dueDatesByActionId}
          />
          <ActionPrioritySection
            title="Low"
            priority="low"
            items={low}
            dueDatesByActionId={dueDatesByActionId}
          />
        </div>
      </SectionCard>
    </div>
  );
}
