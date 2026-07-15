"use client";

import { useState } from "react";
import type { TreasuryViewKey, TreasuryWorkspaceState } from "@/src/capabilities/treasury/types/TreasuryWorkspaceState";

export interface UseTreasuryResult {
  readonly workspace: TreasuryWorkspaceState;
  readonly activeView: TreasuryViewKey;
  readonly setActiveView: (view: TreasuryViewKey) => void;
}

export function useTreasury(initialState: TreasuryWorkspaceState): UseTreasuryResult {
  const [activeView, setActiveView] = useState<TreasuryViewKey>(
    initialState.sidebar[0]?.key ?? "liquidity",
  );

  return {
    workspace: initialState,
    activeView,
    setActiveView,
  };
}
