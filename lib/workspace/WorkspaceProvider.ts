'use client';

import { createContext, createElement, useContext } from 'react';
import type { ReactNode } from 'react';
import type { WorkspaceContext } from '@/lib/workspace/WorkspaceContext';

const WorkspaceContextState = createContext<WorkspaceContext | null>(null);

export function WorkspaceProvider({ context, children }: { context: WorkspaceContext; children: ReactNode }) {
  return createElement(WorkspaceContextState.Provider, { value: context }, children);
}

export function useWorkspaceContext(): WorkspaceContext {
  const context = useContext(WorkspaceContextState);
  if (!context) {
    throw new Error('useWorkspaceContext must be used within WorkspaceProvider.');
  }

  return context;
}
