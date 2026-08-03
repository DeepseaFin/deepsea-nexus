export type WorkspaceQuickActionIconName = 'userPlus' | 'handCoins' | 'fileUp' | 'search';

export type WorkspaceActivityIconName = 'fileUp' | 'check' | 'messageCircle' | 'handCoins' | 'fileText';

export type WorkspaceSectionIconName = 'sparkles' | 'bell' | 'handCoins' | 'folder';

export type WorkspaceSummaryItem = {
  value: string;
  title: string;
  note: string;
};

export type WorkspaceActivityItem = {
  iconName: WorkspaceActivityIconName;
  title: string;
  detail: string;
  time: string;
};

export type WorkspaceQuickActionItem = {
  title: string;
  description: string;
  iconName: WorkspaceQuickActionIconName;
};

export type WorkspaceMyWorkItem = {
  title: string;
  description: string;
  secondaryText: string;
  priority: string;
  ctaLabel: string;
};

export type WorkspaceResumeItem = {
  customer: string;
  workstream: string;
  lastOpened: string;
  status: string;
  actionLabel: string;
};

export type WorkspaceHeroBadge = {
  label: string;
  value: string;
  valueClassName?: string;
};

export type WorkspaceContext = {
  role: string;
  institution: string;
  user: {
    name: string;
  };
  greeting: {
    greeting: string;
    date: string;
    welcomeMessage: string;
    attentionMessage: string;
  };
  todaySummary: readonly WorkspaceSummaryItem[];
  activityFeed: {
    subtitle: string;
    items: readonly WorkspaceActivityItem[];
  };
  myWork: {
    subtitle: string;
    items: readonly WorkspaceMyWorkItem[];
  };
  quickActions: readonly WorkspaceQuickActionItem[];
  resumeItems: readonly WorkspaceResumeItem[];
  hero: {
    title: string;
    subtitle: string;
    badges: readonly WorkspaceHeroBadge[];
    primaryAction: {
      label: string;
    };
    lastActivity: string;
  };
};
