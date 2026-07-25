import type { ExecutiveRelationshipDashboardViewModel } from "@/lib/customer/ExecutiveRelationshipDashboardViewModel";
import type {
  RelationshipActionCategory,
  RelationshipActionCenterCategoryGroupViewModel,
  RelationshipActionCenterItemViewModel,
  RelationshipActionCenterViewModel,
  RelationshipActionPriority,
  RelationshipActionSource,
} from "@/lib/customer/RelationshipActionCenterViewModel";
import type { RelationshipWorkspaceIntelligenceViewModel } from "@/lib/customer/RelationshipWorkspaceIntelligenceViewModel";
import type { RelationshipInsightsReport } from "@/lib/intelligence/RelationshipInsightsTypes";
import type { RelationshipReadinessReport } from "@/lib/intelligence/RelationshipReadinessTypes";

export interface RelationshipActionCenterInput {
  readonly intelligence: RelationshipWorkspaceIntelligenceViewModel;
  readonly dashboard?: ExecutiveRelationshipDashboardViewModel;
  readonly insightsReport?: RelationshipInsightsReport;
  readonly readinessReport?: RelationshipReadinessReport;
}

export interface RelationshipActionCenter {
  buildViewModel(input: RelationshipActionCenterInput): RelationshipActionCenterViewModel;
}

interface MutableAction {
  readonly category: RelationshipActionCategory;
  readonly item: RelationshipActionCenterItemViewModel;
}

const CATEGORY_ORDER: readonly RelationshipActionCategory[] = [
  "missing-documents",
  "outstanding-information",
  "compliance-follow-up",
  "trade-documentation",
  "financial-updates",
  "recommended-relationship-manager-actions",
] as const;

const CATEGORY_TITLES: Record<RelationshipActionCategory, RelationshipActionCenterCategoryGroupViewModel["title"]> = {
  "missing-documents": "Missing Documents",
  "outstanding-information": "Outstanding Information",
  "compliance-follow-up": "Compliance Follow-up",
  "trade-documentation": "Trade Documentation",
  "financial-updates": "Financial Updates",
  "recommended-relationship-manager-actions": "Recommended Relationship Manager Actions",
};

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function toRelatedDocuments(input: RelationshipActionCenterInput): readonly { id: string; label: string }[] {
  return (
    input.dashboard?.recentDocuments.map((document) => ({
      id: document.id,
      label: document.title,
    })) ?? []
  );
}

function withPriorityGroups(items: readonly RelationshipActionCenterItemViewModel[]): {
  readonly high: readonly RelationshipActionCenterItemViewModel[];
  readonly medium: readonly RelationshipActionCenterItemViewModel[];
  readonly low: readonly RelationshipActionCenterItemViewModel[];
} {
  const high = items.filter((item) => item.priority === "high");
  const medium = items.filter((item) => item.priority === "medium");
  const low = items.filter((item) => item.priority === "low");

  return {
    high,
    medium,
    low,
  };
}

function stableSort(items: readonly RelationshipActionCenterItemViewModel[]): RelationshipActionCenterItemViewModel[] {
  const priorityWeight: Record<RelationshipActionPriority, number> = {
    high: 0,
    medium: 1,
    low: 2,
  };

  return [...items].sort((left, right) => {
    if (left.priority !== right.priority) {
      return priorityWeight[left.priority] - priorityWeight[right.priority];
    }

    return left.title.localeCompare(right.title);
  });
}

function toSourceModel(source: RelationshipActionSource):
  | "relationship-workspace-intelligence"
  | "relationship-insights-report"
  | "relationship-readiness-report" {
  if (source === "readiness") {
    return "relationship-readiness-report";
  }

  if (source === "insight") {
    return "relationship-insights-report";
  }

  return "relationship-workspace-intelligence";
}

function createAction(params: {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly priority: RelationshipActionPriority;
  readonly relatedCustomer: string;
  readonly relatedDocuments: readonly { id: string; label: string }[];
  readonly source: RelationshipActionSource;
  readonly suggestedNextStep: string;
  readonly reference: string;
}): RelationshipActionCenterItemViewModel {
  return {
    id: params.id,
    title: params.title,
    description: params.description,
    priority: params.priority,
    relatedCustomer: params.relatedCustomer,
    relatedDocuments: params.relatedDocuments,
    source: params.source,
    suggestedNextStep: params.suggestedNextStep,
    supportingIntelligence: {
      sourceModel: toSourceModel(params.source),
      reference: params.reference,
    },
  };
}

function buildMappedActions(input: RelationshipActionCenterInput): readonly MutableAction[] {
  const relatedCustomer = input.dashboard?.customerSnapshot.customerName ?? "Customer";
  const relatedDocuments = toRelatedDocuments(input);
  const actions: MutableAction[] = [];

  for (const documentName of input.intelligence.missingDocuments) {
    const normalized = normalize(documentName);
    const category: RelationshipActionCategory = normalized.includes("trade")
      ? "trade-documentation"
      : "missing-documents";

    actions.push({
      category,
      item: createAction({
        id: `missing-document-${normalized || "item"}`,
        title: "Missing document submission",
        description: `Required document is missing: ${documentName}.`,
        priority: "high",
        relatedCustomer,
        relatedDocuments,
        source: "readiness",
        suggestedNextStep: `Collect and upload ${documentName}.`,
        reference: `missingDocuments:${documentName}`,
      }),
    });
  }

  for (const requirement of input.intelligence.outstandingRequirements) {
    actions.push({
      category: "outstanding-information",
      item: createAction({
        id: `outstanding-requirement-${normalize(requirement.requirement)}`,
        title: requirement.requirement,
        description: requirement.details,
        priority: "medium",
        relatedCustomer,
        relatedDocuments,
        source: "readiness",
        suggestedNextStep: "Resolve the outstanding requirement and refresh readiness.",
        reference: `outstandingRequirements:${requirement.requirement}`,
      }),
    });
  }

  for (const gap of input.intelligence.keyInsights.informationGaps) {
    actions.push({
      category: "outstanding-information",
      item: createAction({
        id: `information-gap-${normalize(gap.code)}`,
        title: "Information gap requires closure",
        description: gap.message,
        priority: "medium",
        relatedCustomer,
        relatedDocuments,
        source: "insight",
        suggestedNextStep: "Gather missing information and validate updates.",
        reference: `informationGaps:${gap.code}`,
      }),
    });
  }

  for (const inconsistency of input.intelligence.keyInsights.inconsistencies) {
    actions.push({
      category: "compliance-follow-up",
      item: createAction({
        id: `inconsistency-${normalize(inconsistency.code)}`,
        title: "Resolve potential inconsistency",
        description: inconsistency.message,
        priority: "high",
        relatedCustomer,
        relatedDocuments,
        source: "insight",
        suggestedNextStep: "Review conflicting evidence and confirm canonical value.",
        reference: `inconsistencies:${inconsistency.code}`,
      }),
    });
  }

  for (const issue of input.intelligence.readinessStatus.blockingIssues) {
    actions.push({
      category: "compliance-follow-up",
      item: createAction({
        id: `blocking-issue-${normalize(issue)}`,
        title: "Address readiness blocker",
        description: issue,
        priority: "high",
        relatedCustomer,
        relatedDocuments,
        source: "readiness",
        suggestedNextStep: "Clear blocker to move relationship to ready state.",
        reference: `blockingIssues:${issue}`,
      }),
    });
  }

  for (const driver of input.intelligence.relationshipConfidence.keyDrivers) {
    if (driver.kind !== "negative") {
      continue;
    }

    let category: RelationshipActionCategory = "recommended-relationship-manager-actions";
    if (driver.category === "documents") {
      category = "trade-documentation";
    } else if (driver.category === "compliance") {
      category = "compliance-follow-up";
    } else if (driver.category === "passport") {
      category = "financial-updates";
    } else if (driver.category === "evidence" || driver.category === "knowledge") {
      category = "outstanding-information";
    }

    actions.push({
      category,
      item: createAction({
        id: `confidence-driver-${normalize(driver.category)}-${normalize(driver.message)}`,
        title: "Confidence risk follow-up",
        description: driver.message,
        priority: category === "financial-updates" ? "medium" : "high",
        relatedCustomer,
        relatedDocuments,
        source: driver.category === "evidence" ? "evidence" : "insight",
        suggestedNextStep: "Apply corrective updates and re-evaluate confidence.",
        reference: `confidenceDrivers:${driver.category}`,
      }),
    });
  }

  const nextSteps = input.readinessReport?.recommendedNextSteps ?? input.intelligence.recommendedNextActions.map((action) => action.label);
  for (const step of nextSteps) {
    actions.push({
      category: "recommended-relationship-manager-actions",
      item: createAction({
        id: `recommended-action-${normalize(step)}`,
        title: "Relationship manager action",
        description: step,
        priority: "medium",
        relatedCustomer,
        relatedDocuments,
        source: "readiness",
        suggestedNextStep: step,
        reference: `recommendedNextSteps:${step}`,
      }),
    });
  }

  const insightSteps = input.insightsReport?.recommendedNextSteps ?? [];
  for (const step of insightSteps) {
    actions.push({
      category: "recommended-relationship-manager-actions",
      item: createAction({
        id: `insight-next-step-${normalize(step)}`,
        title: "Insight-recommended action",
        description: step,
        priority: "medium",
        relatedCustomer,
        relatedDocuments,
        source: "insight",
        suggestedNextStep: step,
        reference: `insightsRecommendedNextSteps:${step}`,
      }),
    });
  }

  return actions;
}

function dedupeActions(items: readonly MutableAction[]): readonly MutableAction[] {
  const byId = new Map<string, MutableAction>();
  for (const item of items) {
    byId.set(item.item.id, item);
  }

  return [...byId.values()];
}

export function createRelationshipActionCenter(): RelationshipActionCenter {
  return {
    buildViewModel(input: RelationshipActionCenterInput): RelationshipActionCenterViewModel {
      const relatedCustomer = input.dashboard?.customerSnapshot.customerName ?? "Customer";
      const mapped = dedupeActions(buildMappedActions(input));

      const groupedByCategory = new Map<RelationshipActionCategory, RelationshipActionCenterItemViewModel[]>();
      for (const category of CATEGORY_ORDER) {
        groupedByCategory.set(category, []);
      }

      for (const entry of mapped) {
        const bucket = groupedByCategory.get(entry.category);
        if (!bucket) {
          continue;
        }

        bucket.push(entry.item);
      }

      const categories: RelationshipActionCenterCategoryGroupViewModel[] = CATEGORY_ORDER.map((key) => {
        const sorted = stableSort(groupedByCategory.get(key) ?? []);
        return {
          key,
          title: CATEGORY_TITLES[key],
          totalActions: sorted.length,
          priorities: withPriorityGroups(sorted),
        };
      });

      const all = stableSort(categories.flatMap((category) => [
        ...category.priorities.high,
        ...category.priorities.medium,
        ...category.priorities.low,
      ]));

      return {
        generatedAt: new Date().toISOString(),
        relatedCustomer,
        totalActions: all.length,
        categories,
        priorities: withPriorityGroups(all),
      };
    },
  };
}
