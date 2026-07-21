import { ReactNode } from "react";

export interface MissionHeaderProps {
  readonly institutionTitle: ReactNode;
  readonly institutionSubtitle?: ReactNode;
  readonly searchSlot?: ReactNode;
  readonly personaSlot?: ReactNode;
  readonly notificationsSlot?: ReactNode;
  readonly advisorSlot?: ReactNode;
  readonly className?: string;
}

export interface MissionSidebarProps {
  readonly navigationSlot?: ReactNode;
  readonly filtersSlot?: ReactNode;
  readonly categoriesSlot?: ReactNode;
  readonly className?: string;
}

export interface MissionContentProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export interface MissionRightPanelProps {
  readonly contextSlot?: ReactNode;
  readonly recommendationsSlot?: ReactNode;
  readonly timelineSlot?: ReactNode;
  readonly supportingInfoSlot?: ReactNode;
  readonly className?: string;
}

export interface MissionFooterProps {
  readonly workspaceStatusSlot?: ReactNode;
  readonly secondaryActionsSlot?: ReactNode;
  readonly className?: string;
}

export interface MissionLayoutProps {
  readonly header: MissionHeaderProps;
  readonly sidebar: MissionSidebarProps;
  readonly content: MissionContentProps;
  readonly rightPanel?: MissionRightPanelProps;
  readonly footer?: MissionFooterProps;
  readonly className?: string;
}