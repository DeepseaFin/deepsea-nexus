import React from "react";

export interface ActionBarProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

export default function ActionBar({ children, className }: ActionBarProps) {
  return (
    <div
      className={`flex w-full flex-wrap items-center justify-end gap-2 ${className ?? ""}`.trim()}
      aria-label="Page actions"
    >
      {children}
    </div>
  );
}
