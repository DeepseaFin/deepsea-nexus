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

function toBusinessContext(row: WorkflowContextRow): BusinessContext | undefined {
  const fromPayload = row.payload;

  if (fromPayload && typeof fromPayload === 'object') {
    const payload = fromPayload as Partial<BusinessContext>;

    if (
      typeof payload.workflowId === 'string'
      && typeof payload.institutionId === 'string'
      && typeof payload.opportunityId === 'string'
      && typeof payload.currentOwner === 'string'
      && typeof payload.currentWorkspace === 'string'
      && typeof payload.opportunityLifecycle === 'string'
      && BUSINESS_WORKSPACES.has(payload.currentWorkspace)
      && OPPORTUNITY_LIFECYCLES.has(payload.opportunityLifecycle as OpportunityLifecycle)
    ) {
      return normalizeContext({
        workflowId: payload.workflowId,
        institutionId: payload.institutionId,
        opportunityId: payload.opportunityId,
        receivableId: payload.receivableId,
        opportunityLifecycle: payload.opportunityLifecycle as OpportunityLifecycle,
        currentOwner: payload.currentOwner,
        currentWorkspace: payload.currentWorkspace as BusinessContext['currentWorkspace'],
      });
    }
  }

  if (
    typeof row.workflow_id !== 'string'
    || typeof row.institution_id !== 'string'
    || typeof row.opportunity_id !== 'string'
    || typeof row.current_owner !== 'string'
    || typeof row.current_workspace !== 'string'
    || typeof row.opportunity_lifecycle !== 'string'
    || !BUSINESS_WORKSPACES.has(row.current_workspace)
    || !OPPORTUNITY_LIFECYCLES.has(row.opportunity_lifecycle as OpportunityLifecycle)
  ) {
    return undefined;
  }

  return normalizeContext({
    workflowId: row.workflow_id,
    institutionId: row.institution_id,
    opportunityId: row.opportunity_id,
    receivableId: row.receivable_id ?? undefined,
    opportunityLifecycle: row.opportunity_lifecycle as OpportunityLifecycle,
    currentOwner: row.current_owner,
    currentWorkspace: row.current_workspace as BusinessContext['currentWorkspace'],
  });
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
      if (!context) {
        continue;
      }

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
      }
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
