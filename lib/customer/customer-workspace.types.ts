import type { LucideIcon } from "lucide-react";
import type { StatusChipProps } from "@/components/ui/StatusChip";

export type CustomerWorkspaceTabId =
  | "overview"
  | "business-passport"
  | "documents"
  | "relationship"
  | "approvals"
  | "funding"
  | "timeline";

export interface CustomerWorkspaceTab {
  readonly id: CustomerWorkspaceTabId;
  readonly label: string;
  readonly description?: string;
  readonly disabled?: boolean;
}

export interface CustomerSummaryModel {
  readonly customerName: string;
  readonly status: {
    readonly label: string;
    readonly variant?: StatusChipProps["variant"];
  };
  readonly relationshipManager: string;
  readonly industry: string;
  readonly country: string;
  readonly risk: {
    readonly label: string;
    readonly variant?: StatusChipProps["variant"];
  };
  readonly fundingPotential: string;
}

export interface CustomerWorkspaceAction {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly icon?: LucideIcon;
  readonly disabled?: boolean;
  readonly onClick?: () => void;
}

export interface CustomerSidebarItem {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly description?: string;
}

export interface CustomerSidebarSection {
  readonly id: string;
  readonly title: string;
  readonly items: readonly CustomerSidebarItem[];
}

export interface CustomerTabContentConfig {
  readonly id: CustomerWorkspaceTabId;
  readonly heading: string;
  readonly description: string;
  readonly readinessLabel?: string;
}

export interface CustomerWorkspaceLayoutConfig {
  readonly tabs: readonly CustomerWorkspaceTab[];
  readonly defaultTabId: CustomerWorkspaceTabId;
  readonly tabContent: Readonly<Record<CustomerWorkspaceTabId, CustomerTabContentConfig>>;
  readonly sidebarSections: Readonly<Record<CustomerWorkspaceTabId, readonly CustomerSidebarSection[]>>;
}
