"use client";

import React from "react";
import { PanelEmptyState } from "@/components/customer/shared/PanelFeedback";
import SectionCard from "@/components/ui/SectionCard";
import type { BusinessPassportPresentationViewModel } from "@/lib/presentation/presenters/BusinessPassportPresenter";

function renderText(value?: string | number): string {
  if (typeof value === "number") {
    return `${value}`;
  }

  if (value && value.trim().length > 0) {
    return value;
  }

  return "Not available";
}

export interface BusinessPassportSectionsProps {
  readonly viewModel?: BusinessPassportPresentationViewModel;
}

export default function BusinessPassportSections({ viewModel }: BusinessPassportSectionsProps) {
  if (!viewModel) {
    return (
      <SectionCard title="Business Passport Details" subtitle="Presenter-backed sections are unavailable.">
        <PanelEmptyState message="No Business Passport section data is available." />
      </SectionCard>
    );
  }

  return (
    <div className="space-y-4">
      {viewModel.sections?.map((section) => (
        <SectionCard key={section.id} title={section.title} subtitle={section.description}>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {section.items.map((item) => (
              <article key={item.label} className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{item.label}</p>
                <p className="mt-1 text-sm font-medium text-slate-100">{renderText(item.value)}</p>
              </article>
            ))}
          </div>
        </SectionCard>
      ))}
    </div>
  );
}
