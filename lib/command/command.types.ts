import type { LucideIcon } from "lucide-react";

export const COMMAND_CATEGORIES = [
  "Customers",
  "Deals",
  "Documents",
  "Approvals",
  "Tasks",
  "Reports",
  "Funding",
] as const;

export type CommandCategory = (typeof COMMAND_CATEGORIES)[number];

export interface CommandDescriptor {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: CommandCategory;
  readonly keywords?: readonly string[];
  readonly icon?: LucideIcon;
  readonly shortcutHint?: string;
  readonly disabled?: boolean;
  readonly onSelect?: () => void;
}

export interface QuickActionDescriptor {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon?: LucideIcon;
  readonly commandId?: string;
  readonly disabled?: boolean;
  readonly onSelect?: () => void;
}

export interface SearchProviderResult {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: CommandCategory;
}

export interface CommandSearchProvider {
  readonly id: string;
  readonly category: CommandCategory;
  search(query: string): readonly SearchProviderResult[];
}

export interface CommandRegistry {
  readonly commands: readonly CommandDescriptor[];
  readonly quickActions: readonly QuickActionDescriptor[];
  readonly searchProviders: readonly CommandSearchProvider[];
}
