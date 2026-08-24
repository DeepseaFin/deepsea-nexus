"use client";

import React from "react";
import { PanelEmptyState } from "@/components/customer/shared/PanelFeedback";
import SectionCard from "@/components/ui/SectionCard";
import type { MissingDocumentItem } from "@/lib/customer/documents/documents-panel.types";

export interface MissingDocumentsCardProps {
  readonly title: string;
  readonly subtitle: string;
  readonly items: readonly MissingDocumentItem[];
}

export default function MissingDocumentsCard({ title, subtitle, items }: MissingDocumentsCardProps) {
  return (
    <SectionCard title={title} subtitle={subtitle}>
      <div className="space-y-2.5">
        {items.map((item) => (
          <article key={item.id} className="rounded-lg border border-rose-800/45 bg-rose-950/20 p-3">
            <p className="text-sm font-semibold text-rose-100">{item.documentName}</p>
            <p className="mt-1 text-sm text-rose-200/90">{item.reason}</p>
            {item.dueLabel ? (
              <p className="mt-2 text-xs uppercase tracking-[0.12em] text-rose-300/90">{item.dueLabel}</p>
            ) : null}
          </article>
        ))}

        {items.length === 0 ? <PanelEmptyState message="No missing documents in this context." /> : null}
      </div>
    </SectionCard>
  );
}
