import type { WorkspaceContext } from '@/lib/workspace/WorkspaceContext';

export const relationshipManagerDemo: WorkspaceContext = {
  role: 'Relationship Manager',
  institution: 'Institutional Financing',
  user: {
    name: 'Deepak',
  },
  greeting: {
    greeting: 'Good Morning',
    date: 'Tuesday, August 3',
    welcomeMessage: 'Welcome back.',
    attentionMessage: 'Here is everything requiring your attention today.',
  },
  todaySummary: [
    { value: '3', title: 'Relationships', note: 'Need attention' },
    { value: '2', title: 'Credit Decisions', note: 'Awaiting approval' },
    { value: '1', title: 'Funding Release', note: 'Scheduled today' },
    { value: '4', title: 'Documents', note: 'Need review' },
  ],
  activityFeed: {
    subtitle: 'Changes requiring your attention since your last session.',
    items: [
      { iconName: 'fileUp', title: 'New KYC documents received', detail: 'Crescent Trade Holdings uploaded two compliance documents.', time: '12 minutes ago' },
      { iconName: 'check', title: 'Credit approval requested', detail: 'Blue Ocean Limited is awaiting your decision.', time: '35 minutes ago' },
      { iconName: 'messageCircle', title: 'Client message', detail: 'ABC Manufacturing replied to your facility proposal.', time: '1 hour ago' },
      { iconName: 'handCoins', title: 'Funding scheduled', detail: 'USD 2.4 Million scheduled for release today.', time: 'Today 4:00 PM' },
      { iconName: 'fileText', title: 'Legal review completed', detail: 'Trade Finance Agreement ready for signature.', time: 'Today' },
    ],
  },
  myWork: {
    subtitle: 'Everything that needs your attention today.',
    items: [
      {
        title: 'Customer Needs Attention',
        description: 'Crescent Trade Holdings',
        secondaryText: 'KYC expires in 5 days',
        priority: 'HIGH',
        ctaLabel: 'Continue ->',
      },
      {
        title: 'Credit Decision',
        description: 'Blue Ocean Ltd',
        secondaryText: 'Awaiting approval',
        priority: 'MEDIUM',
        ctaLabel: 'Review ->',
      },
      {
        title: 'Document Review',
        description: '4 Documents Pending',
        secondaryText: 'Compliance review required',
        priority: 'LOW',
        ctaLabel: 'Open ->',
      },
      {
        title: 'Funding Release',
        description: 'USD 2.4 Million',
        secondaryText: 'Scheduled today',
        priority: 'TODAY',
        ctaLabel: 'Execute ->',
      },
    ],
  },
  commandCenter: {
    subtitle: 'Everything requiring your attention right now.',
    items: [
      { title: 'Review Customers', count: '3', status: 'Need Attention', ctaLabel: 'Open Queue ->' },
      { title: 'Credit Decisions', count: '2', status: 'Awaiting Approval', ctaLabel: 'Review ->' },
      { title: 'Funding Releases', count: '1', status: 'Ready Today', ctaLabel: 'Execute ->' },
      { title: 'Compliance Review', count: '4', status: 'Documents Pending', ctaLabel: 'Open ->' },
    ],
    priorityFocus: {
      customer: 'Crescent Trade Holdings',
      stage: 'Trade Finance Renewal',
      nextTask: 'Approve revised facility.',
      actionLabel: 'Continue Working ->',
    },
  },
  quickActions: [
    { title: 'New Relationship', description: 'Start onboarding a new institutional client.', iconName: 'userPlus' },
    { title: 'New Financing', description: 'Create a new financing opportunity.', iconName: 'handCoins' },
    { title: 'Upload Documents', description: 'Add customer documents for review.', iconName: 'fileUp' },
    { title: 'Search Platform', description: 'Find customers, facilities or documents.', iconName: 'search' },
  ],
  resumeItems: [
    { customer: 'Crescent Trade Holdings', workstream: 'Trade Finance Renewal', lastOpened: '2 hours ago', status: 'Awaiting Credit Approval', actionLabel: 'Resume ->' },
    { customer: 'Blue Ocean Limited', workstream: 'Document Review', lastOpened: 'Yesterday', status: 'In Progress', actionLabel: 'Resume ->' },
    { customer: 'ABC Manufacturing', workstream: 'Funding Release', lastOpened: 'Yesterday', status: 'Pending Release Confirmation', actionLabel: 'Resume ->' },
  ],
  hero: {
    title: 'Crescent Trade Holdings',
    subtitle: 'Trade Finance Renewal',
    badges: [
      { label: 'Relationship Status', value: 'Healthy', valueClassName: 'text-emerald-200' },
      { label: 'Facility', value: 'USD 6.2 Million' },
      { label: 'Pending Items', value: '2' },
    ],
    primaryAction: { label: 'Continue Working ->' },
    lastActivity: 'Last activity 2 hours ago',
  },
};

export const creditManagerDemo: WorkspaceContext = {
  role: 'Credit Manager',
  institution: 'Credit Underwriting',
  user: {
    name: 'Nadia',
  },
  greeting: {
    greeting: 'Good Morning',
    date: 'Tuesday, August 3',
    welcomeMessage: 'Welcome back.',
    attentionMessage: 'Today prioritizes approvals and exception reviews.',
  },
  todaySummary: [
    { value: '5', title: 'Credit Files', note: 'Need decision' },
    { value: '3', title: 'Escalations', note: 'Need assessment' },
    { value: '2', title: 'Policy Exceptions', note: 'Need approval' },
    { value: '7', title: 'Documents', note: 'Need review' },
  ],
  activityFeed: {
    subtitle: 'Changes requiring your attention since your last session.',
    items: [
      { iconName: 'check', title: 'Approval packet submitted', detail: 'Northwind Maritime moved to final credit decision.', time: '15 minutes ago' },
      { iconName: 'fileText', title: 'Risk memo revised', detail: 'Blue Ocean Limited includes updated counterparty exposure.', time: '42 minutes ago' },
      { iconName: 'messageCircle', title: 'Analyst comment added', detail: 'ABC Manufacturing has a new covenant recommendation.', time: '1 hour ago' },
      { iconName: 'fileUp', title: 'Financial statements received', detail: 'Crescent Trade Holdings uploaded audited statements.', time: 'Today 9:05 AM' },
      { iconName: 'handCoins', title: 'Funding waiting on approval', detail: 'One release is paused pending your sign-off.', time: 'Today' },
    ],
  },
  myWork: {
    subtitle: 'Everything that needs your attention today.',
    items: [
      {
        title: 'Customer Needs Attention',
        description: 'Northwind Maritime',
        secondaryText: 'Exception memo added for review',
        priority: 'HIGH',
        ctaLabel: 'Continue ->',
      },
      {
        title: 'Credit Decision',
        description: 'Blue Ocean Ltd',
        secondaryText: 'Awaiting committee approval',
        priority: 'MEDIUM',
        ctaLabel: 'Review ->',
      },
      {
        title: 'Document Review',
        description: '7 Documents Pending',
        secondaryText: 'Financial statements need validation',
        priority: 'LOW',
        ctaLabel: 'Open ->',
      },
      {
        title: 'Funding Release',
        description: 'USD 1.8 Million',
        secondaryText: 'Pending final credit sign-off',
        priority: 'TODAY',
        ctaLabel: 'Execute ->',
      },
    ],
  },
  commandCenter: {
    subtitle: 'Everything requiring your attention right now.',
    items: [
      { title: 'Review Customers', count: '3', status: 'Need Attention', ctaLabel: 'Open Queue ->' },
      { title: 'Credit Decisions', count: '2', status: 'Awaiting Approval', ctaLabel: 'Review ->' },
      { title: 'Funding Releases', count: '1', status: 'Ready Today', ctaLabel: 'Execute ->' },
      { title: 'Compliance Review', count: '4', status: 'Documents Pending', ctaLabel: 'Open ->' },
    ],
    priorityFocus: {
      customer: 'Northwind Maritime',
      stage: 'Committee Credit Approval',
      nextTask: 'Approve revised risk recommendation.',
      actionLabel: 'Continue Working ->',
    },
  },
  quickActions: [
    { title: 'New Relationship', description: 'Open a relationship profile for underwriting.', iconName: 'userPlus' },
    { title: 'New Financing', description: 'Start credit assessment for a new facility.', iconName: 'handCoins' },
    { title: 'Upload Documents', description: 'Attach memos, statements and covenants.', iconName: 'fileUp' },
    { title: 'Search Platform', description: 'Find institutions, proposals or approvals.', iconName: 'search' },
  ],
  resumeItems: [
    { customer: 'Northwind Maritime', workstream: 'Credit Approval', lastOpened: '1 hour ago', status: 'Committee Review Pending', actionLabel: 'Resume ->' },
    { customer: 'Blue Ocean Limited', workstream: 'Risk Review', lastOpened: 'Yesterday', status: 'Awaiting Exception Decision', actionLabel: 'Resume ->' },
    { customer: 'ABC Manufacturing', workstream: 'Covenant Validation', lastOpened: 'Yesterday', status: 'Analyst Follow-up Pending', actionLabel: 'Resume ->' },
  ],
  hero: {
    title: 'Northwind Maritime',
    subtitle: 'Committee Credit Approval',
    badges: [
      { label: 'Decision Status', value: 'Pending', valueClassName: 'text-amber-200' },
      { label: 'Facility', value: 'USD 4.8 Million' },
      { label: 'Pending Items', value: '3' },
    ],
    primaryAction: { label: 'Continue Working ->' },
    lastActivity: 'Last activity 1 hour ago',
  },
};

export const operationsManagerDemo: WorkspaceContext = {
  role: 'Operations Manager',
  institution: 'Funding Operations',
  user: {
    name: 'Ravi',
  },
  greeting: {
    greeting: 'Good Morning',
    date: 'Tuesday, August 3',
    welcomeMessage: 'Welcome back.',
    attentionMessage: 'Today focuses on release execution and settlement checkpoints.',
  },
  todaySummary: [
    { value: '4', title: 'Funding Releases', note: 'Scheduled today' },
    { value: '2', title: 'Settlement Blocks', note: 'Need resolution' },
    { value: '6', title: 'Document Packs', note: 'Need validation' },
    { value: '3', title: 'Client Follow-ups', note: 'Need confirmation' },
  ],
  activityFeed: {
    subtitle: 'Changes requiring your attention since your last session.',
    items: [
      { iconName: 'handCoins', title: 'Release window opened', detail: 'USD 2.4 Million is ready for treasury execution.', time: '10 minutes ago' },
      { iconName: 'fileText', title: 'Settlement checklist complete', detail: 'Blue Ocean Limited package is clear for release.', time: '30 minutes ago' },
      { iconName: 'messageCircle', title: 'Client confirmation received', detail: 'ABC Manufacturing confirmed release terms.', time: '55 minutes ago' },
      { iconName: 'fileUp', title: 'Supporting documents uploaded', detail: 'Northwind Maritime posted revised invoice set.', time: 'Today 8:40 AM' },
      { iconName: 'check', title: 'Compliance sign-off recorded', detail: 'Crescent Trade Holdings file is fully validated.', time: 'Today' },
    ],
  },
  myWork: {
    subtitle: 'Everything that needs your attention today.',
    items: [
      {
        title: 'Customer Needs Attention',
        description: 'Crescent Trade Holdings',
        secondaryText: 'Funding confirmation needed',
        priority: 'HIGH',
        ctaLabel: 'Continue ->',
      },
      {
        title: 'Credit Decision',
        description: 'Blue Ocean Ltd',
        secondaryText: 'Awaiting release dependency approval',
        priority: 'MEDIUM',
        ctaLabel: 'Review ->',
      },
      {
        title: 'Document Review',
        description: '6 Documents Pending',
        secondaryText: 'Settlement packet verification required',
        priority: 'LOW',
        ctaLabel: 'Open ->',
      },
      {
        title: 'Funding Release',
        description: 'USD 2.4 Million',
        secondaryText: 'Scheduled today',
        priority: 'TODAY',
        ctaLabel: 'Execute ->',
      },
    ],
  },
  commandCenter: {
    subtitle: 'Everything requiring your attention right now.',
    items: [
      { title: 'Review Customers', count: '3', status: 'Need Attention', ctaLabel: 'Open Queue ->' },
      { title: 'Credit Decisions', count: '2', status: 'Awaiting Approval', ctaLabel: 'Review ->' },
      { title: 'Funding Releases', count: '1', status: 'Ready Today', ctaLabel: 'Execute ->' },
      { title: 'Compliance Review', count: '4', status: 'Documents Pending', ctaLabel: 'Open ->' },
    ],
    priorityFocus: {
      customer: 'Crescent Trade Holdings',
      stage: 'Funding Release Execution',
      nextTask: 'Approve revised facility.',
      actionLabel: 'Continue Working ->',
    },
  },
  quickActions: [
    { title: 'New Relationship', description: 'Create a new operations-facing client thread.', iconName: 'userPlus' },
    { title: 'New Financing', description: 'Open a release workflow for new funding.', iconName: 'handCoins' },
    { title: 'Upload Documents', description: 'Add settlement and release documents.', iconName: 'fileUp' },
    { title: 'Search Platform', description: 'Find releases, facilities or files quickly.', iconName: 'search' },
  ],
  resumeItems: [
    { customer: 'Crescent Trade Holdings', workstream: 'Funding Release Execution', lastOpened: '45 minutes ago', status: 'Awaiting Treasury Dispatch', actionLabel: 'Resume ->' },
    { customer: 'Blue Ocean Limited', workstream: 'Settlement Validation', lastOpened: 'Yesterday', status: 'Operations Review Pending', actionLabel: 'Resume ->' },
    { customer: 'ABC Manufacturing', workstream: 'Client Confirmation', lastOpened: 'Yesterday', status: 'Release Confirmation Logged', actionLabel: 'Resume ->' },
  ],
  hero: {
    title: 'Crescent Trade Holdings',
    subtitle: 'Funding Release Execution',
    badges: [
      { label: 'Release Status', value: 'Ready', valueClassName: 'text-emerald-200' },
      { label: 'Facility', value: 'USD 2.4 Million' },
      { label: 'Pending Items', value: '2' },
    ],
    primaryAction: { label: 'Continue Working ->' },
    lastActivity: 'Last activity 45 minutes ago',
  },
};
