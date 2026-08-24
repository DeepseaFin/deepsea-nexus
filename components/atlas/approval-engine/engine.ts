export type ApprovalPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type ApprovalStatus = 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Escalated';
export type ApprovalAction = 'Approve' | 'Reject' | 'Return' | 'Request Information' | 'Escalate';

export type ApprovalRecord = {
  approvalId: string;
  module: string;
  deal: string;
  client: string;
  requestedBy: string;
  approvalType: string;
  priority: ApprovalPriority;
  requestedDate: string;
  dueDate: string;
  currentLevel: string;
  status: ApprovalStatus;
  decisionRequired: string;
  amount: number;
  country: string;
  product: string;
  riskRating: 'Low' | 'Medium' | 'High';
  relationshipManager: string;
  department: string;
  currency: string;
  clientCategory: 'Corporate' | 'SME' | 'Strategic';
};

export type WorkflowStage = {
  key: string;
  name: string;
  mode: 'Sequential' | 'Parallel' | 'Conditional' | 'Multi-level';
};

export type ApprovalRule = {
  id: string;
  minAmount: number;
  maxAmount: number;
  country: string | 'Any';
  product: string | 'Any';
  riskRating: 'Low' | 'Medium' | 'High' | 'Any';
  relationshipManager: string | 'Any';
  department: string | 'Any';
  currency: string | 'Any';
  clientCategory: 'Corporate' | 'SME' | 'Strategic' | 'Any';
  levels: string[];
};

export type EscalationRule = {
  id: string;
  slaHours: number;
  managerEscalationHours: number;
  departmentEscalationHours: number;
  executiveEscalationHours: number;
  reminderScheduleHours: number[];
};

function matchesRule(record: ApprovalRecord, rule: ApprovalRule): boolean {
  const amountOk = record.amount >= rule.minAmount && record.amount <= rule.maxAmount;
  const countryOk = rule.country === 'Any' || rule.country === record.country;
  const productOk = rule.product === 'Any' || rule.product === record.product;
  const riskOk = rule.riskRating === 'Any' || rule.riskRating === record.riskRating;
  const rmOk = rule.relationshipManager === 'Any' || rule.relationshipManager === record.relationshipManager;
  const departmentOk = rule.department === 'Any' || rule.department === record.department;
  const currencyOk = rule.currency === 'Any' || rule.currency === record.currency;
  const categoryOk = rule.clientCategory === 'Any' || rule.clientCategory === record.clientCategory;

  return amountOk && countryOk && productOk && riskOk && rmOk && departmentOk && currencyOk && categoryOk;
}

export function resolveApprovalLevels(record: ApprovalRecord, rules: ApprovalRule[]): string[] {
  const matched = rules.find((rule) => matchesRule(record, rule));
  if (!matched) {
    return ['Submission', 'Review', 'Management', 'Final Approval'];
  }
  return matched.levels;
}

export function buildWorkflowStages(record: ApprovalRecord, rules: ApprovalRule[]): WorkflowStage[] {
  const levels = resolveApprovalLevels(record, rules);
  return levels.map((level, index) => {
    if (level === 'Committee') return { key: `lvl-${index}`, name: level, mode: 'Parallel' };
    if (level === 'Risk') return { key: `lvl-${index}`, name: level, mode: 'Conditional' };
    if (level === 'Management') return { key: `lvl-${index}`, name: level, mode: 'Multi-level' };
    return { key: `lvl-${index}`, name: level, mode: 'Sequential' };
  });
}

function hoursBetween(startIso: string, end: Date): number {
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) return 0;
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
}

export function computeEscalationState(record: ApprovalRecord, rule: EscalationRule, now = new Date()): ApprovalStatus {
  if (record.status === 'Approved' || record.status === 'Rejected') return record.status;

  const ageHours = hoursBetween(record.requestedDate, now);
  if (ageHours > rule.executiveEscalationHours) return 'Escalated';
  if (ageHours > rule.departmentEscalationHours) return 'Escalated';
  if (ageHours > rule.managerEscalationHours) return 'Escalated';
  if (ageHours > rule.slaHours) return 'Escalated';

  return record.status;
}

export function applyApprovalAction(record: ApprovalRecord, action: ApprovalAction): ApprovalRecord {
  if (action === 'Approve') {
    return { ...record, status: 'Approved', decisionRequired: 'None' };
  }
  if (action === 'Reject') {
    return { ...record, status: 'Rejected', decisionRequired: 'Closure' };
  }
  if (action === 'Escalate') {
    return { ...record, status: 'Escalated', currentLevel: 'Executive Escalation', decisionRequired: 'Executive Decision' };
  }
  if (action === 'Return') {
    return { ...record, status: 'Pending', currentLevel: 'Submission', decisionRequired: 'Resubmission Required' };
  }
  return { ...record, status: 'Under Review', decisionRequired: 'Information Requested' };
}

export function computeApprovalHealth(records: ApprovalRecord[]): string {
  if (records.length === 0) return '100%';
  const escalated = records.filter((record) => record.status === 'Escalated').length;
  const rejected = records.filter((record) => record.status === 'Rejected').length;
  const health = Math.max(85, 100 - escalated * 3 - rejected * 2);
  return `${health}%`;
}
