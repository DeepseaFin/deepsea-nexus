import type { ReactNode } from "react";

export interface JourneyHeaderProps {
  readonly journeyTitle: ReactNode;
  readonly journeySubtitle?: ReactNode;
  readonly heartbeatSlot?: ReactNode;
  readonly confidenceSlot?: ReactNode;
  readonly primaryActionsSlot?: ReactNode;
  readonly className?: string;
}

export interface JourneySidebarProps {
  readonly navigationSlot?: ReactNode;
  readonly className?: string;
}

export interface JourneyCanvasProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export interface JourneyContextPanelProps {
  readonly evidenceSlot?: ReactNode;
  readonly knowledgeSlot?: ReactNode;
  readonly advisorSlot?: ReactNode;
  readonly timelineSlot?: ReactNode;
  readonly className?: string;
}

export interface JourneyFooterProps {
  readonly workflowStateSlot?: ReactNode;
  readonly secondaryActionsSlot?: ReactNode;
  readonly className?: string;
}

export interface JourneyWorkspaceProps {
  readonly header: JourneyHeaderProps;
  readonly sidebar: JourneySidebarProps;
  readonly canvas: JourneyCanvasProps;
  readonly contextPanel?: JourneyContextPanelProps;
  readonly footer?: JourneyFooterProps;
  readonly className?: string;
}