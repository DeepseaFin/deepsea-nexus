import type { ShellContext } from "@/lib/application/shell/ShellContext";
import { USER_ROLE_LABELS } from "@/lib/design/roles";

export interface ShellQuickAction {
  readonly actionId: string;
  readonly label: string;
}

export interface ShellExperience {
  readonly title: string;
  readonly subtitle: string;
  readonly quickActions: readonly ShellQuickAction[];
}

export interface ShellExperienceInput {
  readonly pathname: string;
  readonly currentItemLabel?: string;
  readonly shellContext: ShellContext;
}

function toTitle(segment: string): string {
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function createShellExperience(input: ShellExperienceInput): ShellExperience {
  const title = input.currentItemLabel ?? toTitle(input.pathname.split("/").filter(Boolean).at(-1) ?? "workspace");

  return {
    title,
    subtitle: `Role context: ${USER_ROLE_LABELS[input.shellContext.role]}`,
    quickActions: [
      { actionId: "new-case", label: "New Case" },
      { actionId: "new-note", label: "New Note" },
    ],
  };
}