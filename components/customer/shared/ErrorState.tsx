"use client";

import { memo, type ReactNode } from "react";

export interface ErrorStateProps {
  readonly title?: string;
  readonly message: string;
  readonly actions?: ReactNode;
  readonly className?: string;
}

function ErrorState({ title = "Something went wrong", message, actions, className = "" }: ErrorStateProps) {
  return (
    <div
      className={`rounded-lg border border-rose-800/45 bg-rose-950/20 p-4 ${className}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <p className="text-sm font-semibold text-rose-200">{title}</p>
      <p className="mt-1 text-sm text-rose-100/90">{message}</p>
      {actions ? <div className="mt-3 flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}

const MemoizedErrorState = memo(ErrorState);
MemoizedErrorState.displayName = "ErrorState";

export default MemoizedErrorState;
