"use client";

import React from "react";
import { Command as CommandPrimitive } from "cmdk";
import type { QuickActionDescriptor } from "@/lib/command/command.types";

export interface QuickActionsProps {
  readonly actions: readonly QuickActionDescriptor[];
  readonly onSelect: (action: QuickActionDescriptor) => void;
}

export default function QuickActions({ actions, onSelect }: QuickActionsProps) {
  return (
    <section className="border-t border-slate-800 px-3 py-3 sm:px-4" aria-label="Quick actions">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        Quick Actions
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <CommandPrimitive.Item
              key={action.id}
              disabled={action.disabled}
              onSelect={() => onSelect(action)}
              className="group flex cursor-pointer items-start gap-2 rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2.5 transition hover:border-cyan-700/40 hover:bg-cyan-900/20 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50"
            >
              {Icon ? <Icon className="mt-0.5 h-4 w-4 text-cyan-300" aria-hidden="true" /> : null}
              <div>
                <p className="text-sm font-medium text-slate-100">{action.title}</p>
                <p className="mt-0.5 text-xs text-slate-400">{action.description}</p>
              </div>
            </CommandPrimitive.Item>
          );
        })}
      </div>
    </section>
  );
}
