"use client";

import { useState } from "react";
import type { CommercialViewKey, CommercialWorkspaceState } from "@/src/capabilities/commercial/types/CommercialWorkspaceState";

export interface UseCommercialResult {
  readonly workspace: CommercialWorkspaceState;
  readonly activeView: CommercialViewKey;
  readonly setActiveView: (view: CommercialViewKey) => void;
}

export function useCommercial(initialState: CommercialWorkspaceState): UseCommercialResult {
  const [activeView, setActiveView] = useState<CommercialViewKey>(
    initialState.sidebar[0]?.key ?? "pipeline",
  );

  return {
    workspace: initialState,
    activeView,
    setActiveView,
  };
}
