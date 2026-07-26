"use client";

import { memo, type ReactNode } from "react";

export interface LoadingStateProps {
  readonly title?: string;
  readonly message?: string;
  readonly lines?: number;
  readonly className?: string;
}

function SkeletonLine() {
  return <div className="h-4 animate-pulse rounded bg-slate-800/80" />;
}

function LoadingState({
  title,
  message = "Loading...",
  lines = 3,
  className = "",
}: LoadingStateProps) {
  const skeletons: ReactNode[] = Array.from({ length: lines }, (_, index) => <SkeletonLine key={index} />);

  return (
    <div
      className={`rounded-lg border border-slate-800 bg-slate-950/70 p-4 ${className}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-busy="true"
    >
      {title ? <p className="text-sm font-semibold text-slate-100">{title}</p> : null}
      <p className={`${title ? "mt-1" : ""} text-sm text-slate-400`}>{message}</p>
      <div className="mt-4 space-y-2">{skeletons}</div>
    </div>
  );
}

const MemoizedLoadingState = memo(LoadingState);
MemoizedLoadingState.displayName = "LoadingState";

export default MemoizedLoadingState;
