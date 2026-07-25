"use client";

import { LayoutGrid, ScrollText, FolderKanban, ShieldCheck, BrainCircuit, ListChecks } from "lucide-react";

export type RelationshipWorkspaceSectionId =
  | "dashboard"
  | "timeline"
  | "documents"
  | "evidence"
  | "knowledge"
  | "actions";

export interface RelationshipWorkspaceNavigationItem {
  readonly id: RelationshipWorkspaceSectionId;
  readonly label: string;
}

export interface RelationshipWorkspaceNavigationProps {
  readonly items: readonly RelationshipWorkspaceNavigationItem[];
  readonly activeSection: RelationshipWorkspaceSectionId;
  readonly onSectionChange: (section: RelationshipWorkspaceSectionId) => void;
}

function iconForSection(section: RelationshipWorkspaceSectionId) {
  if (section === "dashboard") {
    return LayoutGrid;
  }

  if (section === "timeline") {
    return ScrollText;
  }

  if (section === "documents") {
    return FolderKanban;
  }

  if (section === "evidence") {
    return ShieldCheck;
  }

  if (section === "knowledge") {
    return BrainCircuit;
  }

  return ListChecks;
}

export default function RelationshipWorkspaceNavigation({
  items,
  activeSection,
  onSectionChange,
}: RelationshipWorkspaceNavigationProps) {
  return (
    <nav
      aria-label="Relationship workspace navigation"
      className="overflow-x-auto rounded-2xl border border-slate-800/90 bg-slate-950/70 p-2"
    >
      <div className="inline-flex min-w-full items-center gap-1">
        {items.map((item) => {
          const isActive = item.id === activeSection;
          const Icon = iconForSection(item.id);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                isActive
                  ? "border-cyan-600/50 bg-cyan-900/30 text-cyan-100"
                  : "border-transparent text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
