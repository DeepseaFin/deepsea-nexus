export const BUSINESS_PASSPORT_SECTION_IDS = [
  "identity",
  "ownership",
  "documents",
  "relationships",
  "compliance",
  "financials",
  "evidence",
  "knowledge",
  "workflow",
  "activity",
] as const;

export type BusinessPassportSectionId = (typeof BUSINESS_PASSPORT_SECTION_IDS)[number];

export type BusinessPassportSectionIconId =
  | "identity"
  | "ownership"
  | "documents"
  | "relationships"
  | "compliance"
  | "financials"
  | "evidence"
  | "knowledge"
  | "workflow"
  | "activity";

export type BusinessPassportCompletionStrategyId =
  | "identity"
  | "ownership"
  | "documents"
  | "relationships"
  | "compliance"
  | "financials"
  | "evidence"
  | "knowledge"
  | "workflow"
  | "activity";

export type BusinessPassportValidationStrategyId = BusinessPassportCompletionStrategyId;

export interface BusinessPassportSectionRegistryItem {
  readonly id: BusinessPassportSectionId;
  readonly title: string;
  readonly description: string;
  readonly order: number;
  readonly enabled: boolean;
  readonly icon: BusinessPassportSectionIconId;
  readonly completionStrategy: BusinessPassportCompletionStrategyId;
  readonly validationStrategy: BusinessPassportValidationStrategyId;
  readonly navigationVisible: boolean;
  readonly anchorId: string;
}

const BUSINESS_PASSPORT_SECTION_REGISTRY: readonly BusinessPassportSectionRegistryItem[] = [
  {
    id: "identity",
    title: "Identity",
    description: "Legal and registration identity context.",
    order: 1,
    enabled: true,
    icon: "identity",
    completionStrategy: "identity",
    validationStrategy: "identity",
    navigationVisible: true,
    anchorId: "passport-identity",
  },
  {
    id: "ownership",
    title: "Ownership",
    description: "Ownership structure and institution profile context.",
    order: 2,
    enabled: true,
    icon: "ownership",
    completionStrategy: "ownership",
    validationStrategy: "ownership",
    navigationVisible: true,
    anchorId: "passport-identity",
  },
  {
    id: "documents",
    title: "Documents",
    description: "Document readiness and lifecycle coverage.",
    order: 3,
    enabled: true,
    icon: "documents",
    completionStrategy: "documents",
    validationStrategy: "documents",
    navigationVisible: true,
    anchorId: "passport-documents",
  },
  {
    id: "relationships",
    title: "Relationships",
    description: "Relationship strength and engagement signals.",
    order: 4,
    enabled: true,
    icon: "relationships",
    completionStrategy: "relationships",
    validationStrategy: "relationships",
    navigationVisible: true,
    anchorId: "passport-health",
  },
  {
    id: "compliance",
    title: "Compliance",
    description: "Compliance and governance control posture.",
    order: 5,
    enabled: true,
    icon: "compliance",
    completionStrategy: "compliance",
    validationStrategy: "compliance",
    navigationVisible: true,
    anchorId: "passport-evidence",
  },
  {
    id: "financials",
    title: "Financials",
    description: "Financial profile completeness and validation.",
    order: 6,
    enabled: true,
    icon: "financials",
    completionStrategy: "financials",
    validationStrategy: "financials",
    navigationVisible: true,
    anchorId: "passport-metrics",
  },
  {
    id: "evidence",
    title: "Evidence",
    description: "Evidence verification and outstanding artifacts.",
    order: 7,
    enabled: true,
    icon: "evidence",
    completionStrategy: "evidence",
    validationStrategy: "evidence",
    navigationVisible: true,
    anchorId: "passport-evidence",
  },
  {
    id: "knowledge",
    title: "Knowledge",
    description: "Knowledge confidence and coverage signals.",
    order: 8,
    enabled: true,
    icon: "knowledge",
    completionStrategy: "knowledge",
    validationStrategy: "knowledge",
    navigationVisible: true,
    anchorId: "passport-knowledge",
  },
  {
    id: "workflow",
    title: "Workflow",
    description: "Workflow stage progress and blockers.",
    order: 9,
    enabled: true,
    icon: "workflow",
    completionStrategy: "workflow",
    validationStrategy: "workflow",
    navigationVisible: true,
    anchorId: "passport-workflow",
  },
  {
    id: "activity",
    title: "Activity",
    description: "Recent operational activity and execution cadence.",
    order: 10,
    enabled: true,
    icon: "activity",
    completionStrategy: "activity",
    validationStrategy: "activity",
    navigationVisible: true,
    anchorId: "passport-activity",
  },
] as const;

function sortedSections(): readonly BusinessPassportSectionRegistryItem[] {
  return [...BUSINESS_PASSPORT_SECTION_REGISTRY].sort((left, right) => left.order - right.order);
}

export function getAllSections(): readonly BusinessPassportSectionRegistryItem[] {
  return sortedSections();
}

export function getSection(id: BusinessPassportSectionId): BusinessPassportSectionRegistryItem | undefined {
  return BUSINESS_PASSPORT_SECTION_REGISTRY.find((section) => section.id === id);
}

export function getEnabledSections(): readonly BusinessPassportSectionRegistryItem[] {
  return sortedSections().filter((section) => section.enabled);
}

export function getNextSection(id: BusinessPassportSectionId): BusinessPassportSectionRegistryItem | undefined {
  const enabledSections = getEnabledSections();
  const currentIndex = enabledSections.findIndex((section) => section.id === id);
  if (currentIndex < 0) {
    return undefined;
  }

  return enabledSections[currentIndex + 1];
}

export function getPreviousSection(id: BusinessPassportSectionId): BusinessPassportSectionRegistryItem | undefined {
  const enabledSections = getEnabledSections();
  const currentIndex = enabledSections.findIndex((section) => section.id === id);
  if (currentIndex <= 0) {
    return undefined;
  }

  return enabledSections[currentIndex - 1];
}
