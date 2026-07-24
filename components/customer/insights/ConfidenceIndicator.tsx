"use client";

import React from "react";

export interface ConfidenceIndicatorProps {
  readonly value: string;
}

export default function ConfidenceIndicator({ value }: ConfidenceIndicatorProps) {
  return (
    <span className="inline-flex rounded-full border border-cyan-700/50 bg-cyan-900/25 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-200">
      Confidence {value}
    </span>
  );
}
