import type { WorkspaceContext } from '@/lib/workspace/WorkspaceContext';
import { workspaceRegistry, type WorkspaceRole } from '@/lib/workspace/workspaceRegistry';

export const WorkspaceEngine = {
  getWorkspace(role: WorkspaceRole): WorkspaceContext {
    return workspaceRegistry[role];
  },
};
