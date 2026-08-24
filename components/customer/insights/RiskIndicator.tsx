"use client";

import React from "react";
import type { InsightRiskLevel } from "@/lib/customer/insights/insights.types";

function tone(level: InsightRiskLevel): string {
  if (level === "Low") {
    return "border-emerald-700/50 bg-emerald-900/25 text-emerald-200";
  }

  if (level === "Medium") {
    return "border-amber-700/50 bg-amber-900/25 text-amber-200";
  }

  if (level === "High") {
    return "border-orange-700/50 bg-orange-900/25 text-orange-200";
  }

  return "border-rose-700/50 bg-rose-900/25 text-rose-200";
}

export interface RiskIndicatorProps {
  readonly level: InsightRiskLevel;
}

export default function RiskIndicator({ level }: RiskIndicatorProps) {
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${tone(level)}`}>
      Risk {level}
    </span>
  );
}
