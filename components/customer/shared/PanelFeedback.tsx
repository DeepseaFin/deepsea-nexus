"use client";

import React from "react";
import SectionCard from "@/components/ui/SectionCard";

export interface PanelLoadingStateProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly message?: string;
}

export function PanelLoadingState({
  title,
  subtitle,
  message = "Loading workspace data...",
}: PanelLoadingStateProps) {
  return (
    <SectionCard title={title} subtitle={subtitle}>
      <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3" role="status" aria-live="polite">
        <p className="text-sm text-slate-300">{message}</p>
      </div>
    </SectionCard>
  );
}

export interface PanelErrorStateProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly message?: string;
}

export function PanelErrorState({
  title,
  subtitle,
  message = "Unable to load this section right now.",
}: PanelErrorStateProps) {
  return (
    <SectionCard title={title} subtitle={subtitle}>
      <div className="rounded-lg border border-rose-800/45 bg-rose-950/20 p-3" role="alert" aria-live="assertive">
        <p className="text-sm text-rose-200">{message}</p>
      </div>
    </SectionCard>
  );
}

export interface PanelEmptyStateProps {
  readonly message: string;
  readonly asListItem?: boolean;
}

export function PanelEmptyState({ message, asListItem = false }: PanelEmptyStateProps) {
  if (asListItem) {
    return (
      <li className="text-sm text-slate-400" role="status" aria-live="polite">
        {message}
      </li>
    );
  }

  return (
    <p className="text-sm text-slate-400" role="status" aria-live="polite">
      {message}
    </p>
  );
}
