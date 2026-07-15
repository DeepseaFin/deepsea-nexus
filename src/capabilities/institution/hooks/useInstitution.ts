"use client";

import { useState } from "react";
import type {
  InstitutionNavigationKey,
  InstitutionWorkspaceState,
} from "@/src/capabilities/institution/types/InstitutionWorkspaceState";

export interface UseInstitutionResult {
  readonly workspace: InstitutionWorkspaceState;
  readonly activeView: InstitutionNavigationKey;
  readonly setActiveView: (view: InstitutionNavigationKey) => void;
}

export function useInstitution(initialState: InstitutionWorkspaceState): UseInstitutionResult {
  const [activeView, setActiveView] = useState<InstitutionNavigationKey>(
    initialState.navigation[0]?.key ?? "dashboard",
  );

  return {
    workspace: initialState,
    activeView,
    setActiveView,
  };
}
