import type { WorkspaceSectionDefinition } from "@/lib/workspaces/workspace.types";

export interface WorkspaceRegistry<TSectionId extends string, TSection extends WorkspaceSectionDefinition<TSectionId>> {
  getAllSections: () => readonly TSection[];
  getSection: (id: TSectionId) => TSection | undefined;
  getEnabledSections: () => readonly TSection[];
  getNextSection: (id: TSectionId) => TSection | undefined;
  getPreviousSection: (id: TSectionId) => TSection | undefined;
}

function sortSections<TSectionId extends string, TSection extends WorkspaceSectionDefinition<TSectionId>>(
  sections: readonly TSection[],
): readonly TSection[] {
  return [...sections].sort((left, right) => (left.workflowOrder ?? left.order) - (right.workflowOrder ?? right.order));
}

export function createWorkspaceRegistry<TSectionId extends string, TSection extends WorkspaceSectionDefinition<TSectionId>>(
  sections: readonly TSection[],
): WorkspaceRegistry<TSectionId, TSection> {
  const sorted = sortSections(sections);
  const enabled = sorted.filter((section) => section.enabled);

  return {
    getAllSections: () => sorted,
    getSection: (id) => sections.find((section) => section.id === id),
    getEnabledSections: () => enabled,
    getNextSection: (id) => {
      const currentIndex = enabled.findIndex((section) => section.id === id);
      if (currentIndex < 0) {
        return undefined;
      }

      return enabled[currentIndex + 1];
    },
    getPreviousSection: (id) => {
      const currentIndex = enabled.findIndex((section) => section.id === id);
      if (currentIndex <= 0) {
        return undefined;
      }

      return enabled[currentIndex - 1];
    },
  };
}
