"use client";

import { useState } from "react";
import type { ForfaittingViewKey, ForfaittingWorkspaceState } from "@/src/capabilities/forfaiting/types/ForfaittingWorkspaceState";

export interface UseForfaittingResult {
  readonly workspace: ForfaittingWorkspaceState;
  readonly activeView: ForfaittingViewKey;
  readonly setActiveView: (view: ForfaittingViewKey) => void;
}

export function useForfaitting(initialState: ForfaittingWorkspaceState): UseForfaittingResult {
  const [activeView, setActiveView] = useState<ForfaittingViewKey>(
    initialState.sidebar[0]?.key ?? "queue",
  );

  return {
    workspace: initialState,
    activeView,
    setActiveView,
  };
}
