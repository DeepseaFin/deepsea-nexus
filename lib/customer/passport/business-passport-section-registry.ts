import { createWorkspaceRegistry } from "@/lib/workspaces/workspace-registry";
import type { WorkspaceSectionDefinition } from "@/lib/workspaces/workspace.types";

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

export interface BusinessPassportSectionRegistryItem extends WorkspaceSectionDefinition<BusinessPassportSectionId> {
  readonly icon: BusinessPassportSectionIconId;
  readonly completionStrategy: BusinessPassportCompletionStrategyId;
  readonly validationStrategy: BusinessPassportValidationStrategyId;
  readonly anchorId: string;
}

const BUSINESS_PASSPORT_SECTION_REGISTRY: readonly BusinessPassportSectionRegistryItem[] = [
  {
    id: "identity",
    title: "Identity",
    description: "Legal and registration identity context.",
    order: 1,
    workflowOrder: 1,
    enabled: true,
    icon: "identity",
    completionStrategy: "identity",
    validationStrategy: "identity",
    navigationVisible: true,
    anchorId: "passport-identity",
    prerequisites: [],
    recommended: true,
  },
  {
    id: "ownership",
    title: "Ownership",
    description: "Ownership structure and institution profile context.",
    order: 2,
    workflowOrder: 2,
    enabled: true,
    icon: "ownership",
    completionStrategy: "ownership",
    validationStrategy: "ownership",
    navigationVisible: true,
    anchorId: "passport-identity",
    prerequisites: ["identity"],
  },
  {
    id: "documents",
    title: "Documents",
    description: "Document readiness and lifecycle coverage.",
    order: 3,
    workflowOrder: 3,
    enabled: true,
    icon: "documents",
    completionStrategy: "documents",
    validationStrategy: "documents",
    navigationVisible: true,
    anchorId: "passport-documents",
    prerequisites: ["ownership"],
  },
  {
    id: "relationships",
    title: "Relationships",
    description: "Relationship strength and engagement signals.",
    order: 4,
    workflowOrder: 4,
    enabled: true,
    icon: "relationships",
    completionStrategy: "relationships",
    validationStrategy: "relationships",
    navigationVisible: true,
    anchorId: "passport-health",
    prerequisites: ["documents"],
  },
  {
    id: "compliance",
    title: "Compliance",
    description: "Compliance and governance control posture.",
    order: 5,
    workflowOrder: 5,
    enabled: true,
    icon: "compliance",
    completionStrategy: "compliance",
    validationStrategy: "compliance",
    navigationVisible: true,
    anchorId: "passport-evidence",
    prerequisites: ["relationships"],
  },
  {
    id: "financials",
    title: "Financials",
    description: "Financial profile completeness and validation.",
    order: 6,
    workflowOrder: 6,
    enabled: true,
    icon: "financials",
    completionStrategy: "financials",
    validationStrategy: "financials",
    navigationVisible: true,
    anchorId: "passport-metrics",
    prerequisites: ["compliance"],
  },
  {
    id: "evidence",
    title: "Evidence",
    description: "Evidence verification and outstanding artifacts.",
    order: 7,
    workflowOrder: 7,
    enabled: true,
    icon: "evidence",
    completionStrategy: "evidence",
    validationStrategy: "evidence",
    navigationVisible: true,
    anchorId: "passport-evidence",
    prerequisites: ["financials"],
  },
  {
    id: "knowledge",
    title: "Knowledge",
    description: "Knowledge confidence and coverage signals.",
    order: 8,
    workflowOrder: 8,
    enabled: true,
    icon: "knowledge",
    completionStrategy: "knowledge",
    validationStrategy: "knowledge",
    navigationVisible: true,
    anchorId: "passport-knowledge",
    prerequisites: ["evidence"],
  },
  {
    id: "workflow",
    title: "Workflow",
    description: "Workflow stage progress and blockers.",
    order: 9,
    workflowOrder: 9,
    enabled: true,
    icon: "workflow",
    completionStrategy: "workflow",
    validationStrategy: "workflow",
    navigationVisible: true,
    anchorId: "passport-workflow",
    prerequisites: ["knowledge"],
  },
  {
    id: "activity",
    title: "Activity",
    description: "Recent operational activity and execution cadence.",
    order: 10,
    workflowOrder: 10,
    enabled: true,
    icon: "activity",
    completionStrategy: "activity",
    validationStrategy: "activity",
    navigationVisible: true,
    anchorId: "passport-activity",
    prerequisites: ["workflow"],
  },
];

const sectionRegistry = createWorkspaceRegistry<BusinessPassportSectionId, BusinessPassportSectionRegistryItem>(
  BUSINESS_PASSPORT_SECTION_REGISTRY,
);

export function getAllSections(): readonly BusinessPassportSectionRegistryItem[] {
  return sectionRegistry.getAllSections();
}

export function getSection(id: BusinessPassportSectionId): BusinessPassportSectionRegistryItem | undefined {
  return sectionRegistry.getSection(id);
}

export function getEnabledSections(): readonly BusinessPassportSectionRegistryItem[] {
  return sectionRegistry.getEnabledSections();
}

export function getNextSection(id: BusinessPassportSectionId): BusinessPassportSectionRegistryItem | undefined {
  return sectionRegistry.getNextSection(id);
}

export function getPreviousSection(id: BusinessPassportSectionId): BusinessPassportSectionRegistryItem | undefined {
  return sectionRegistry.getPreviousSection(id);
}
