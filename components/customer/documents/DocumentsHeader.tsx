"use client";

import React from "react";
import { FileStack } from "lucide-react";
import SectionCard from "@/components/ui/SectionCard";
import type { DocumentsPanelHeaderModel } from "@/lib/customer/documents/documents-panel.types";

export interface DocumentsHeaderProps {
  readonly model: DocumentsPanelHeaderModel;
}

export default function DocumentsHeader({ model }: DocumentsHeaderProps) {
  return (
    <SectionCard title={model.title} subtitle={model.subtitle}>
      <div className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs uppercase tracking-[0.12em] text-slate-300">
        <FileStack className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
        {model.workspaceLabel ?? "Documents Workspace"}
      </div>
    </SectionCard>
  );
}
