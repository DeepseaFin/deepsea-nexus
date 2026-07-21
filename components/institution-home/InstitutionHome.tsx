import { MissionLayout } from "@/components/mission-layout";
import { AttentionQueue } from "./AttentionQueue";
import { InstitutionHeader } from "./InstitutionHeader";
import { InstitutionSnapshot } from "./InstitutionSnapshot";
import { MissionFocusCard } from "./MissionFocusCard";
import { RecentActivity } from "./RecentActivity";
import { RecommendedActions } from "./RecommendedActions";
import type { InstitutionHomeProps } from "./types";

function withClassName(base: string, className?: string): string {
  return className ? `${base} ${className}` : base;
}

export function InstitutionHome({
  institutionName,
  institutionSubtitle,
  personaSlot,
  searchSlot,
  notificationsSlot,
  className,
}: InstitutionHomeProps) {
  const headerShell = (
    <InstitutionHeader
      institutionName={institutionName}
      institutionSubtitle={institutionSubtitle}
      personaSlot={personaSlot}
      searchSlot={searchSlot}
      notificationsSlot={notificationsSlot}
    />
  );

  return (
    <MissionLayout
      className={withClassName("min-h-screen", className)}
      header={{
        institutionTitle: headerShell,
        institutionSubtitle: "DNOS Mission Workspace",
      }}
      sidebar={{
        navigationSlot: <div className="text-sm text-slate-400">Mission Navigation Placeholder</div>,
        filtersSlot: <div className="text-sm text-slate-400">Mission Filters Placeholder</div>,
        categoriesSlot: <div className="text-sm text-slate-400">Mission Categories Placeholder</div>,
      }}
      content={{
        children: (
          <div className="space-y-4">
            <InstitutionSnapshot />
            <MissionFocusCard />
            <AttentionQueue />
          </div>
        ),
      }}
      rightPanel={{
        contextSlot: <div className="text-sm text-slate-400">Institution Context Placeholder</div>,
        recommendationsSlot: <RecommendedActions />,
        timelineSlot: <RecentActivity />,
        supportingInfoSlot: <div className="text-sm text-slate-400">Supporting Information Placeholder</div>,
      }}
      footer={{
        workspaceStatusSlot: <div className="text-sm text-slate-400">Workspace Status Placeholder</div>,
        secondaryActionsSlot: <div className="text-sm text-slate-400">Secondary Actions Placeholder</div>,
      }}
    />
  );
}