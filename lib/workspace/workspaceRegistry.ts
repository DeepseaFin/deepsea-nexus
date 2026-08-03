import type { WorkspaceContext } from '@/lib/workspace/WorkspaceContext';
import {
  creditManagerDemo,
  operationsManagerDemo,
  relationshipManagerDemo,
} from '@/lib/workspace/workspaceDemoData';

export type WorkspaceRole =
  | 'relationshipManager'
  | 'creditManager'
  | 'operationsManager'
  | 'treasuryManager'
  | 'executive';

const treasuryManagerContext: WorkspaceContext = {
  ...operationsManagerDemo,
  role: 'Treasury Manager',
  institution: 'Treasury Operations',
  user: {
    name: 'Leila',
  },
  greeting: {
    ...operationsManagerDemo.greeting,
    attentionMessage: 'Today focuses on funding dispatch and settlement liquidity checks.',
  },
  hero: {
    ...operationsManagerDemo.hero,
    subtitle: 'Treasury Release Dispatch',
    lastActivity: 'Last activity 40 minutes ago',
  },
};

const executiveContext: WorkspaceContext = {
  ...relationshipManagerDemo,
  role: 'Executive',
  institution: 'Executive Oversight',
  user: {
    name: 'Ariane',
  },
  greeting: {
    ...relationshipManagerDemo.greeting,
    attentionMessage: 'Today focuses on portfolio priorities and approval posture.',
  },
  hero: {
    ...relationshipManagerDemo.hero,
    subtitle: 'Executive Portfolio Priority',
  },
};

export const workspaceRegistry: Record<WorkspaceRole, WorkspaceContext> = {
  relationshipManager: relationshipManagerDemo,
  creditManager: creditManagerDemo,
  operationsManager: operationsManagerDemo,
  treasuryManager: treasuryManagerContext,
  executive: executiveContext,
};
