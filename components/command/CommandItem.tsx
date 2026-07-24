"use client";

import React from "react";
import { Command as CommandPrimitive } from "cmdk";
import type { LucideIcon } from "lucide-react";

export interface CommandItemProps {
  readonly title: string;
  readonly description: string;
  readonly shortcutHint?: string;
  readonly icon?: LucideIcon;
  readonly disabled?: boolean;
  readonly onSelect?: () => void;
}

export default function CommandItem({
  title,
  description,
  shortcutHint,
  icon: Icon,
  disabled,
  onSelect,
}: CommandItemProps) {
  return (
    <CommandPrimitive.Item
      disabled={disabled}
      onSelect={onSelect}
      className="group flex cursor-pointer items-start justify-between gap-3 rounded-lg border border-transparent px-3 py-2 text-left aria-selected:border-slate-700 aria-selected:bg-slate-800 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50"
    >
      <div className="flex min-w-0 items-start gap-2">
        {Icon ? <Icon className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" /> : null}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-100">{title}</p>
          <p className="mt-0.5 text-xs text-slate-400">{description}</p>
        </div>
      </div>
      {shortcutHint ? (
        <span className="shrink-0 rounded border border-slate-700 px-1.5 py-0.5 text-[10px] text-slate-500">
          {shortcutHint}
        </span>
      ) : null}
    </CommandPrimitive.Item>
  );
}
