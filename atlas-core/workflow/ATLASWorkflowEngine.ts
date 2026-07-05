export type AtlasWorkflowStateName =
  | 'Lead'
  | 'Opportunity'
  | 'Origination'
  | 'Evaluation'
  | 'Structuring'
  | 'Approval'
  | 'Documentation'
  | 'Funding'
  | 'Monitoring'
  | 'Closed';

export interface AtlasWorkflowStateDefinition {
  state: AtlasWorkflowStateName;
  owner: string;
  entryCriteria: string[];
  exitCriteria: string[];
  allowedActions: string[];
  nextStates: AtlasWorkflowStateName[];
}

export interface AtlasWorkflowState {
  currentState: AtlasWorkflowStateName;
  completedStates: AtlasWorkflowStateName[];
  progress: number;
  lastUpdated: string;
}

export const ATLAS_WORKFLOW_SEQUENCE: AtlasWorkflowStateName[] = [
  'Lead',
  'Opportunity',
  'Origination',
  'Evaluation',
  'Structuring',
  'Approval',
  'Documentation',
  'Funding',
  'Monitoring',
  'Closed',
];

export const ATLAS_WORKFLOW_DEFINITIONS: AtlasWorkflowStateDefinition[] = [
  {
    state: 'Lead',
    owner: 'Relationship Manager',
    entryCriteria: ['Client enquiry received'],
    exitCriteria: ['Basic interest confirmed'],
    allowedActions: ['Log enquiry', 'Capture initial context'],
    nextStates: ['Opportunity'],
  },
  {
    state: 'Opportunity',
    owner: 'Relationship Manager',
    entryCriteria: ['Initial interest confirmed'],
    exitCriteria: ['Opportunity deemed viable for setup'],
    allowedActions: ['Qualify opportunity', 'Capture participants'],
    nextStates: ['Origination'],
  },
  {
    state: 'Origination',
    owner: 'Relationship Manager',
    entryCriteria: ['Opportunity accepted for processing'],
    exitCriteria: ['Case record created'],
    allowedActions: ['Create case', 'Collect core details'],
    nextStates: ['Evaluation'],
  },
  {
    state: 'Evaluation',
    owner: 'Credit Analyst',
    entryCriteria: ['Core case data available'],
    exitCriteria: ['Risk assessment completed'],
    allowedActions: ['Review risk', 'Request evidence'],
    nextStates: ['Structuring'],
  },
  {
    state: 'Structuring',
    owner: 'Relationship Manager',
    entryCriteria: ['Evaluation inputs available'],
    exitCriteria: ['Commercial structure agreed'],
    allowedActions: ['Set commercial terms', 'Refine request'],
    nextStates: ['Approval'],
  },
  {
    state: 'Approval',
    owner: 'Investment Committee',
    entryCriteria: ['Structured recommendation ready'],
    exitCriteria: ['Approval outcome recorded'],
    allowedActions: ['Approve', 'Decline', 'Condition'],
    nextStates: ['Documentation'],
  },
  {
    state: 'Documentation',
    owner: 'Operations',
    entryCriteria: ['Approval outcome available'],
    exitCriteria: ['Required documents complete'],
    allowedActions: ['Collect documents', 'Confirm readiness'],
    nextStates: ['Funding'],
  },
  {
    state: 'Funding',
    owner: 'Operations',
    entryCriteria: ['Documentation complete'],
    exitCriteria: ['Capital deployed'],
    allowedActions: ['Prepare funding', 'Confirm disbursement'],
    nextStates: ['Monitoring'],
  },
  {
    state: 'Monitoring',
    owner: 'Portfolio Management',
    entryCriteria: ['Funding completed'],
    exitCriteria: ['Case outcome stabilized'],
    allowedActions: ['Monitor performance', 'Track exceptions'],
    nextStates: ['Closed'],
  },
  {
    state: 'Closed',
    owner: 'Portfolio Management',
    entryCriteria: ['Monitoring complete'],
    exitCriteria: ['Case archived'],
    allowedActions: ['Archive case', 'Capture lessons learned'],
    nextStates: [],
  },
];

const workflowDefinitionMap = new Map(
  ATLAS_WORKFLOW_DEFINITIONS.map((definition) => [definition.state, definition]),
);

export function getWorkflowDefinition(state: AtlasWorkflowStateName): AtlasWorkflowStateDefinition {
  return workflowDefinitionMap.get(state) ?? ATLAS_WORKFLOW_DEFINITIONS[0];
}

export function getWorkflowProgress(state: AtlasWorkflowStateName): number {
  const index = ATLAS_WORKFLOW_SEQUENCE.indexOf(state);
  if (index < 0) {
    return 0;
  }

  return Math.round((index / (ATLAS_WORKFLOW_SEQUENCE.length - 1)) * 100);
}

export function createWorkflowState(
  currentState: AtlasWorkflowStateName = 'Lead',
): AtlasWorkflowState {
  const currentIndex = ATLAS_WORKFLOW_SEQUENCE.indexOf(currentState);
  return {
    currentState,
    completedStates: currentIndex > 0 ? ATLAS_WORKFLOW_SEQUENCE.slice(0, currentIndex) : [],
    progress: getWorkflowProgress(currentState),
    lastUpdated: new Date().toISOString(),
  };
}