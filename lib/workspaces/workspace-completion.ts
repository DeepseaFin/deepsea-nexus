import type { WorkspaceCompletionStatus } from "@/lib/workspaces/workspace.types";

export function clampWorkspacePercentage(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function ratioToWorkspacePercentage(completed: number, total: number): number {
  if (total <= 0) {
    return 0;
  }

  return clampWorkspacePercentage((completed / total) * 100);
}

export function completionStatusFromPercentage(percent: number): WorkspaceCompletionStatus {
  if (percent <= 0) {
    return "not_started";
  }

  if (percent >= 100) {
    return "completed";
  }

  return "in_progress";
}
