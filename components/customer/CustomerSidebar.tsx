"use client";

import React from "react";
import SectionCard from "@/components/ui/SectionCard";
import type { CustomerSidebarSection } from "@/lib/customer/customer-workspace.types";

export interface CustomerSidebarProps {
  readonly sections: readonly CustomerSidebarSection[];
}

export default function CustomerSidebar({ sections }: CustomerSidebarProps) {
  return (
    <aside className="space-y-3" aria-label="Contextual workspace sidebar">
      {sections.map((section) => (
        <SectionCard key={section.id} title={section.title}>
          <dl className="space-y-3">
            {section.items.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                <dt className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{item.label}</dt>
                <dd className="mt-1 text-sm text-slate-100">{item.value}</dd>
                {item.description ? <p className="mt-1 text-xs text-slate-400">{item.description}</p> : null}
              </div>
            ))}
          </dl>
        </SectionCard>
      ))}
    </aside>
  );
}
