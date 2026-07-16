import {
  createInMemoryWorkflowContextRepository,
  type WorkflowContextRepository,
} from '@/lib/workflows/WorkflowContext';
import {
  createSupabaseWorkflowContextRepository,
  type SupabaseWorkflowContextRepositoryOptions,
} from '@/lib/workflows/repositories/SupabaseWorkflowContextRepository';

export type WorkflowRepositoryBackend = 'in-memory' | 'supabase';

export interface WorkflowContextRepositoryFactoryOptions {
  readonly backend?: WorkflowRepositoryBackend;
  readonly supabase?: SupabaseWorkflowContextRepositoryOptions;
}

export interface WorkflowRepositoryFactoryOptions {
  readonly workflowContext?: WorkflowContextRepositoryFactoryOptions;
}

export interface WorkflowRepositoryProvider {
  createWorkflowContextRepository(
    options?: WorkflowContextRepositoryFactoryOptions,
  ): WorkflowContextRepository;
}

const DEFAULT_BACKEND: WorkflowRepositoryBackend = 'in-memory';
const WORKFLOW_CONTEXT_BACKEND_ENV = 'WORKFLOW_CONTEXT_REPOSITORY_BACKEND';

function normalizeBackend(value?: string): WorkflowRepositoryBackend {
  if (!value) {
    return DEFAULT_BACKEND;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === 'supabase') {
    return 'supabase';
  }

  return 'in-memory';
}

function resolveWorkflowContextBackend(
  options?: WorkflowContextRepositoryFactoryOptions,
): WorkflowRepositoryBackend {
  return options?.backend
    ?? normalizeBackend(process.env[WORKFLOW_CONTEXT_BACKEND_ENV]);
}

function canUseSupabaseBackend(): boolean {
  return typeof window === 'undefined';
}

function createWorkflowContextRepositoryFromBackend(
  backend: WorkflowRepositoryBackend,
  options?: WorkflowContextRepositoryFactoryOptions,
): WorkflowContextRepository {
  if (backend === 'supabase' && canUseSupabaseBackend()) {
    return createSupabaseWorkflowContextRepository(options?.supabase);
  }

  return createInMemoryWorkflowContextRepository();
}

class DefaultWorkflowRepositoryProvider implements WorkflowRepositoryProvider {
  private readonly options: WorkflowRepositoryFactoryOptions;

  constructor(options: WorkflowRepositoryFactoryOptions = {}) {
    this.options = options;
  }

  createWorkflowContextRepository(
    options: WorkflowContextRepositoryFactoryOptions = {},
  ): WorkflowContextRepository {
    const mergedOptions: WorkflowContextRepositoryFactoryOptions = {
      ...(this.options.workflowContext ?? {}),
      ...options,
      supabase: {
        ...(this.options.workflowContext?.supabase ?? {}),
        ...(options.supabase ?? {}),
      },
    };

    const backend = resolveWorkflowContextBackend(mergedOptions);
    return createWorkflowContextRepositoryFromBackend(backend, mergedOptions);
  }
}

export function createWorkflowRepositoryProvider(
  options: WorkflowRepositoryFactoryOptions = {},
): WorkflowRepositoryProvider {
  return new DefaultWorkflowRepositoryProvider(options);
}

export function createWorkflowContextRepository(
  options: WorkflowContextRepositoryFactoryOptions = {},
): WorkflowContextRepository {
  return createWorkflowRepositoryProvider({ workflowContext: options })
    .createWorkflowContextRepository(options);
}

export const workflowRepositoryProvider: WorkflowRepositoryProvider =
  createWorkflowRepositoryProvider();
