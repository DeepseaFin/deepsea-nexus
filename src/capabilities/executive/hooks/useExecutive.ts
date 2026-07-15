"use client";

import { useState } from "react";
import type { ExecutiveViewKey, ExecutiveWorkspaceState } from "@/src/capabilities/executive/types/ExecutiveWorkspaceState";

export interface UseExecutiveResult {
  readonly workspace: ExecutiveWorkspaceState;
  readonly activeView: ExecutiveViewKey;
  readonly setActiveView: (view: ExecutiveViewKey) => void;
}

export function useExecutive(initialState: ExecutiveWorkspaceState): UseExecutiveResult {
  const [activeView, setActiveView] = useState<ExecutiveViewKey>(
    initialState.sidebar[0]?.key ?? "dashboard",
  );

  return {
    workspace: initialState,
    activeView,
    setActiveView,
  };
}
