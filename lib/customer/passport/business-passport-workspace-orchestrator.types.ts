import type { UIButtonVariant } from "@/components/ui/Button";

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

export type BusinessPassportValidationStatus = "valid" | "warning" | "error" | "unknown";

export interface BusinessPassportWorkspaceSectionConfig {
  readonly id: BusinessPassportSectionId;
  readonly label: string;
  readonly anchorId?: string;
  readonly disabled?: boolean;
  readonly completed?: boolean;
  readonly dirty?: boolean;
  readonly validation?: BusinessPassportValidationStatus;
}

export interface BusinessPassportWorkspaceSectionState extends BusinessPassportWorkspaceSectionConfig {
  readonly completed: boolean;
  readonly dirty: boolean;
  readonly validation: BusinessPassportValidationStatus;
  readonly disabled: boolean;
  readonly active: boolean;
}

export interface BusinessPassportWorkspaceAction {
  readonly id: string;
  readonly label: string;
  readonly variant?: UIButtonVariant;
  readonly disabled?: boolean;
  readonly execute?: () => void;
}

export interface BusinessPassportCompletionState {
  readonly completedSections: number;
  readonly totalSections: number;
  readonly percent: number;
}

export interface BusinessPassportValidationState {
  readonly bySection: Readonly<Record<BusinessPassportSectionId, BusinessPassportValidationStatus>>;
  readonly validSections: number;
  readonly warningSections: number;
  readonly errorSections: number;
}

export interface BusinessPassportDirtyState {
  readonly isDirty: boolean;
  readonly dirtySections: readonly BusinessPassportSectionId[];
}

export interface BusinessPassportWorkspaceLoadingState {
  readonly isLoading: boolean;
}

export interface UseBusinessPassportWorkspaceOrchestratorInput {
  readonly sections: readonly BusinessPassportWorkspaceSectionConfig[];
  readonly initialActiveSection?: BusinessPassportSectionId;
  readonly actions?: readonly Omit<BusinessPassportWorkspaceAction, "execute" | "disabled">[];
  readonly isLoading?: boolean;
}

export interface BusinessPassportWorkspaceOrchestrator {
  readonly loadingState: BusinessPassportWorkspaceLoadingState;
  readonly activeSection: BusinessPassportSectionId;
  readonly sections: readonly BusinessPassportWorkspaceSectionState[];
  readonly completion: BusinessPassportCompletionState;
  readonly validation: BusinessPassportValidationState;
  readonly dirtyState: BusinessPassportDirtyState;
  readonly workspaceActions: readonly BusinessPassportWorkspaceAction[];
  readonly setActiveSection: (sectionId: BusinessPassportSectionId) => void;
  readonly jumpToSection: (sectionId: BusinessPassportSectionId) => void;
  readonly goToPreviousSection: () => void;
  readonly goToNextSection: () => void;
  readonly markSectionCompleted: (sectionId: BusinessPassportSectionId, completed: boolean) => void;
  readonly setSectionValidation: (sectionId: BusinessPassportSectionId, status: BusinessPassportValidationStatus) => void;
  readonly setSectionDirty: (sectionId: BusinessPassportSectionId, dirty: boolean) => void;
}
