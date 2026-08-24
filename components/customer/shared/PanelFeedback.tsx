"use client";

import { memo } from "react";
import EmptyState from "@/components/customer/shared/EmptyState";
import ErrorState from "@/components/customer/shared/ErrorState";
import LoadingState from "@/components/customer/shared/LoadingState";
import SectionCard from "@/components/ui/SectionCard";

export interface PanelLoadingStateProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly message?: string;
}

function PanelLoadingStateComponent({
  title,
  subtitle,
  message = "Loading workspace data...",
}: PanelLoadingStateProps) {
  return (
    <SectionCard title={title} subtitle={subtitle}>
      <LoadingState message={message} />
    </SectionCard>
  );
}

export const PanelLoadingState = memo(PanelLoadingStateComponent);
PanelLoadingState.displayName = "PanelLoadingState";

export interface PanelErrorStateProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly message?: string;
}

function PanelErrorStateComponent({
  title,
  subtitle,
  message = "Unable to load this section right now.",
}: PanelErrorStateProps) {
  return (
    <SectionCard title={title} subtitle={subtitle}>
      <ErrorState message={message} />
    </SectionCard>
  );
}

export const PanelErrorState = memo(PanelErrorStateComponent);
PanelErrorState.displayName = "PanelErrorState";

export interface PanelEmptyStateProps {
  readonly message: string;
  readonly asListItem?: boolean;
}

function PanelEmptyStateComponent({ message, asListItem = false }: PanelEmptyStateProps) {
  if (asListItem) {
    return (
      <li className="text-sm text-slate-400" role="status" aria-live="polite" aria-atomic="true">
        {message}
      </li>
    );
  }

  return <EmptyState message={message} className="p-3" />;
}

export const PanelEmptyState = memo(PanelEmptyStateComponent);
PanelEmptyState.displayName = "PanelEmptyState";
