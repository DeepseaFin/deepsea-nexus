import type { UIButtonVariant } from "@/components/ui/Button";
import type { BusinessPassportSectionId } from "@/lib/customer/passport/business-passport-section-registry";

export type { BusinessPassportSectionId };

export type BusinessPassportSectionCompletionStatus = "not_started" | "in_progress" | "completed";

export type BusinessPassportValidationStatus = "success" | "warning" | "error";

export interface BusinessPassportWorkspaceSectionConfig {
  readonly id: BusinessPassportSectionId;
  readonly label: string;
  readonly anchorId?: string;
  readonly disabled?: boolean;
}

export interface BusinessPassportWorkspaceSectionComputedState extends BusinessPassportWorkspaceSectionConfig {
  readonly completionPercentage: number;
  readonly completionStatus: BusinessPassportSectionCompletionStatus;
  readonly validationStatus: BusinessPassportValidationStatus;
  readonly missingRequiredFields: readonly string[];
}

export interface BusinessPassportWorkspaceSectionState extends BusinessPassportWorkspaceSectionComputedState {
  readonly dirty: boolean;
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
  readonly overallPercentage: number;
  readonly completedSections: number;
  readonly totalSections: number;
  readonly inProgressSections: number;
  readonly notStartedSections: number;
}

export interface BusinessPassportValidationState {
  readonly bySection: Readonly<Record<BusinessPassportSectionId, BusinessPassportValidationStatus>>;
  readonly successSections: number;
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

export type BusinessPassportWorkspaceFilters = Readonly<Record<string, string | number | boolean | readonly string[]>>;

export interface BusinessPassportWorkspaceViewState {
  readonly expandedSections: Readonly<Record<BusinessPassportSectionId, boolean>>;
  readonly selectedTab: string;
  readonly filters: BusinessPassportWorkspaceFilters;
  readonly lastVisitedAt: string | null;
}

export interface UseBusinessPassportWorkspaceOrchestratorInput {
  readonly sectionStates: readonly BusinessPassportWorkspaceSectionComputedState[];
  readonly initialActiveSection?: BusinessPassportSectionId;
  readonly actions?: readonly Omit<BusinessPassportWorkspaceAction, "execute">[];
  readonly initialDirtyBySectionId?: Partial<Record<BusinessPassportSectionId, boolean>>;
  readonly persistenceKey?: string;
  readonly isLoading?: boolean;
}

export interface BusinessPassportWorkspaceOrchestrator {
  readonly loadingState: BusinessPassportWorkspaceLoadingState;
  readonly activeSection: BusinessPassportSectionId;
  readonly sections: readonly BusinessPassportWorkspaceSectionState[];
  readonly completion: BusinessPassportCompletionState;
  readonly validation: BusinessPassportValidationState;
  readonly dirtyState: BusinessPassportDirtyState;
  readonly viewState: BusinessPassportWorkspaceViewState;
  readonly workspaceActions: readonly BusinessPassportWorkspaceAction[];
  readonly setActiveSection: (sectionId: BusinessPassportSectionId) => void;
  readonly jumpToSection: (sectionId: BusinessPassportSectionId) => void;
  readonly goToPreviousSection: () => void;
  readonly goToNextSection: () => void;
  readonly setSectionExpanded: (sectionId: BusinessPassportSectionId, expanded: boolean) => void;
  readonly toggleSectionExpanded: (sectionId: BusinessPassportSectionId) => void;
  readonly setSelectedTab: (tabId: string) => void;
  readonly setFilters: (filters: BusinessPassportWorkspaceFilters) => void;
  readonly mergeFilters: (filters: Partial<BusinessPassportWorkspaceFilters>) => void;
  readonly clearFilters: () => void;
  readonly markSectionCompleted: (sectionId: BusinessPassportSectionId, completed: boolean) => void;
  readonly setSectionValidation: (sectionId: BusinessPassportSectionId, status: BusinessPassportValidationStatus) => void;
  readonly setSectionDirty: (sectionId: BusinessPassportSectionId, dirty: boolean) => void;
}
