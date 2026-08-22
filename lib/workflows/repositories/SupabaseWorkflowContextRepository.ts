import { getSupabaseServerClient } from '@/lib/supabase/server';
import type {
  BusinessContext,
  WorkflowContextRepository,
} from '@/lib/workflows/WorkflowContext';
import { createBusinessContext } from '@/lib/workflows/WorkflowContext';
import { OpportunityLifecycle } from '@/lib/workflows/WorkflowTransition';

const BUSINESS_WORKSPACES = new Set([
  'institution',
  'commercial',
  'executive',
  'treasury',
  'forfaitting',
]);

const OPPORTUNITY_LIFECYCLES = new Set(Object.values(OpportunityLifecycle));

type WorkflowContextRow = {
  workflow_id: string;
  institution_id: string;
  opportunity_id: string;
  receivable_id: string | null;
  opportunity_lifecycle: string;
  current_owner: string;
  current_workspace: string;
  payload: unknown;
};

export type SupabaseWorkflowContextRepositoryOptions = {
  readonly tableName?: string;
  readonly onPersistenceError?: (error: Error) => void;
};

function normalizeWorkflowId(workflowId: string): string {
  return workflowId.trim();
}

function normalizeContext(context: BusinessContext): BusinessContext {
  return createBusinessContext(context);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function toBusinessWorkspace(value: unknown): BusinessContext['currentWorkspace'] {
  if (typeof value !== 'string' || !BUSINESS_WORKSPACES.has(value)) {
    throw new Error('Failed to map workflow context row: current_workspace is invalid.');
  }

  return value as BusinessContext['currentWorkspace'];
}

function toOpportunityLifecycle(value: unknown): OpportunityLifecycle {
  if (typeof value !== 'string' || !OPPORTUNITY_LIFECYCLES.has(value as OpportunityLifecycle)) {
    throw new Error('Failed to map workflow context row: opportunity_lifecycle is invalid.');
  }

  return value as OpportunityLifecycle;
}

function toOptionalString(value: unknown): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new Error('Failed to map workflow context row: optional string field is invalid.');
  }

  return value;
}

function toRequiredString(value: unknown, fieldName: string): string {
  if (typeof value !== 'string') {
    throw new Error(`Failed to map workflow context row: ${fieldName} is invalid.`);
  }

  return value;
}

function toWorkflowContextRow(context: BusinessContext): WorkflowContextRow {
  return {
    workflow_id: context.workflowId,
    institution_id: context.institutionId,
    opportunity_id: context.opportunityId,
    receivable_id: context.receivableId ?? null,
    opportunity_lifecycle: context.opportunityLifecycle,
    current_owner: context.currentOwner,
    current_workspace: context.currentWorkspace,
    payload: context,
  };
}

function toBusinessContext(row: WorkflowContextRow): BusinessContext {
  const fromPayload = row.payload;

  if (!isPlainObject(fromPayload)) {
    throw new Error('Failed to map workflow context row: payload must be an object.');
  }

  const payload = fromPayload as Record<string, unknown>;

  const contextFromPayload = normalizeContext({
    workflowId: toRequiredString(payload.workflowId, 'payload.workflowId'),
    institutionId: toRequiredString(payload.institutionId, 'payload.institutionId'),
    opportunityId: toRequiredString(payload.opportunityId, 'payload.opportunityId'),
    receivableId: toOptionalString(payload.receivableId),
    opportunityLifecycle: toOpportunityLifecycle(payload.opportunityLifecycle),
    currentOwner: toRequiredString(payload.currentOwner, 'payload.currentOwner'),
    currentWorkspace: toBusinessWorkspace(payload.currentWorkspace),
  });

  const contextFromColumns = normalizeContext({
    workflowId: toRequiredString(row.workflow_id, 'workflow_id'),
    institutionId: toRequiredString(row.institution_id, 'institution_id'),
    opportunityId: toRequiredString(row.opportunity_id, 'opportunity_id'),
    receivableId: toOptionalString(row.receivable_id),
    opportunityLifecycle: toOpportunityLifecycle(row.opportunity_lifecycle),
    currentOwner: toRequiredString(row.current_owner, 'current_owner'),
    currentWorkspace: toBusinessWorkspace(row.current_workspace),
  });

  if (
    contextFromPayload.workflowId !== contextFromColumns.workflowId
    || contextFromPayload.institutionId !== contextFromColumns.institutionId
    || contextFromPayload.opportunityId !== contextFromColumns.opportunityId
    || contextFromPayload.receivableId !== contextFromColumns.receivableId
    || contextFromPayload.opportunityLifecycle !== contextFromColumns.opportunityLifecycle
    || contextFromPayload.currentOwner !== contextFromColumns.currentOwner
    || contextFromPayload.currentWorkspace !== contextFromColumns.currentWorkspace
  ) {
    throw new Error('Failed to map workflow context row: payload does not match canonical columns.');
  }

  return contextFromPayload;
}

class SupabaseWorkflowContextRepository implements WorkflowContextRepository {
  private readonly tableName: string;

  private readonly contexts = new Map<string, BusinessContext>();

  private readonly onPersistenceError?: (error: Error) => void;

  constructor(options: SupabaseWorkflowContextRepositoryOptions = {}) {
    this.tableName = options.tableName ?? 'workflow_contexts';
    this.onPersistenceError = options.onPersistenceError;
  }

  save(context: BusinessContext): void {
    const normalized = normalizeContext(context);
    const workflowId = normalizeWorkflowId(normalized.workflowId);
    this.contexts.set(workflowId, normalized);
    this.schedule(this.persistUpsert([normalized]));
  }

  saveMany(contexts: readonly BusinessContext[]): void {
    const normalizedBatch: BusinessContext[] = [];

    for (const context of contexts) {
      const normalized = normalizeContext(context);
      const workflowId = normalizeWorkflowId(normalized.workflowId);
      this.contexts.set(workflowId, normalized);
      normalizedBatch.push(normalized);
    }

    if (normalizedBatch.length > 0) {
      this.schedule(this.persistUpsert(normalizedBatch));
    }
  }

  findByWorkflowId(workflowId: string): BusinessContext | undefined {
    const normalizedWorkflowId = normalizeWorkflowId(workflowId);
    const context = this.contexts.get(normalizedWorkflowId);
    return context ? normalizeContext(context) : undefined;
  }

  hasWorkflowId(workflowId: string): boolean {
    return this.contexts.has(normalizeWorkflowId(workflowId));
  }

  deleteByWorkflowId(workflowId: string): boolean {
    const normalizedWorkflowId = normalizeWorkflowId(workflowId);
    const removed = this.contexts.delete(normalizedWorkflowId);

    if (removed) {
      this.schedule(this.persistDelete(normalizedWorkflowId));
    }

    return removed;
  }

  list(): readonly BusinessContext[] {
    return Object.freeze(
      Array.from(this.contexts.values(), (context) => normalizeContext(context)),
    );
  }

  count(): number {
    return this.contexts.size;
  }

  clear(): void {
    this.contexts.clear();
  }

  async hydrate(): Promise<void> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from(this.tableName)
      .select('workflow_id, institution_id, opportunity_id, receivable_id, opportunity_lifecycle, current_owner, current_workspace, payload');

    if (error) {
      throw new Error(`Failed to hydrate workflow contexts: ${error.message}`);
    }

    this.contexts.clear();

    for (const row of (data ?? []) as WorkflowContextRow[]) {
      const context = toBusinessContext(row);
      this.contexts.set(normalizeWorkflowId(context.workflowId), context);
    }
  }

  private schedule(task: Promise<void>): void {
    void task.catch((error: unknown) => {
      const normalized = error instanceof Error
        ? error
        : new Error(typeof error === 'string' ? error : 'Unknown persistence error.');

      if (this.onPersistenceError) {
        this.onPersistenceError(normalized);
        return;
      }

      throw normalized;
    });
  }

  private async persistUpsert(contexts: readonly BusinessContext[]): Promise<void> {
    if (contexts.length === 0) {
      return;
    }

    const supabase = getSupabaseServerClient();
    const payload = contexts.map((context) => toWorkflowContextRow(context));

    const { error } = await supabase
      .from(this.tableName)
      .upsert(payload, { onConflict: 'workflow_id' });

    if (error) {
      throw new Error(`Failed to persist workflow contexts: ${error.message}`);
    }
  }

  private async persistDelete(workflowId: string): Promise<void> {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('workflow_id', workflowId);

    if (error) {
      throw new Error(`Failed to delete workflow context: ${error.message}`);
    }
  }
}

export function createSupabaseWorkflowContextRepository(
  options: SupabaseWorkflowContextRepositoryOptions = {},
): WorkflowContextRepository {
  return new SupabaseWorkflowContextRepository(options);
}
