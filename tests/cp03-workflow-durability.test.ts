import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createCanonicalReleaseOneRuntimeComposition,
  createInstitutionRuntimeComposition,
} from '../lib/application/InstitutionRuntimeComposition.ts';
import {
  createBusinessContext,
  createInMemoryWorkflowContextRepository,
  parseBusinessContext,
  serializeBusinessContext,
  transitionBusinessContext,
} from '../lib/workflows/WorkflowContext.ts';
import { createWorkflowRepositoryProvider } from '../lib/workflows/repositories/WorkflowRepositoryFactory.ts';
import { OpportunityLifecycle } from '../lib/workflows/WorkflowTransition.ts';

const workflowId = 'CP03-RELEASE-1-0001';

const originalSupabaseUrl = process.env.SUPABASE_URL;
const originalServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const originalWorkflowBackend = process.env.WORKFLOW_CONTEXT_REPOSITORY_BACKEND;

function restoreSupabaseEnv(): void {
  if (originalSupabaseUrl === undefined) {
    delete process.env.SUPABASE_URL;
  } else {
    process.env.SUPABASE_URL = originalSupabaseUrl;
  }

  if (originalServiceRoleKey === undefined) {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  } else {
    process.env.SUPABASE_SERVICE_ROLE_KEY = originalServiceRoleKey;
  }

  if (originalWorkflowBackend === undefined) {
    delete process.env.WORKFLOW_CONTEXT_REPOSITORY_BACKEND;
  } else {
    process.env.WORKFLOW_CONTEXT_REPOSITORY_BACKEND = originalWorkflowBackend;
  }
}

test('A. Default repository selection remains in-memory for unrelated consumers', async () => {
  delete process.env.WORKFLOW_CONTEXT_REPOSITORY_BACKEND;
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;

  const repository = createWorkflowRepositoryProvider().createWorkflowContextRepository();
  const context = createBusinessContext({
    institutionId: 'INS-DEFAULT-001',
    opportunityId: 'OPP-DEFAULT-001',
    workflowId,
    opportunityLifecycle: OpportunityLifecycle.DRAFT,
    currentOwner: 'Relationship Manager',
    currentWorkspace: 'commercial',
  });

  await repository.save(context);
  assert.deepEqual(repository.findByWorkflowId(workflowId), context);
  restoreSupabaseEnv();
});

test('B. Canonical Release-1 composition selects the explicit durable repository path', async () => {
  process.env.SUPABASE_URL = 'http://127.0.0.1:1';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
  delete process.env.WORKFLOW_CONTEXT_REPOSITORY_BACKEND;

  const composition = createCanonicalReleaseOneRuntimeComposition();
  const context = createBusinessContext({
    institutionId: 'INS-DURABLE-001',
    opportunityId: 'OPP-DURABLE-001',
    workflowId: `${workflowId}-durable`,
    opportunityLifecycle: OpportunityLifecycle.UNDER_REVIEW,
    currentOwner: 'Executive Desk',
    currentWorkspace: 'executive',
  });

  await assert.rejects(
    () => composition.workflowContextRepository.save(context),
    /Missing Supabase server configuration|fetch|Failed to persist|Failed to hydrate|connect/i,
  );

  restoreSupabaseEnv();
});

test('C1. Durable save contract is async and completion is observed by awaiting the promise', async () => {
  process.env.SUPABASE_URL = 'http://127.0.0.1:1';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
  delete process.env.WORKFLOW_CONTEXT_REPOSITORY_BACKEND;

  const repository = createWorkflowRepositoryProvider({
    workflowContext: {
      backend: 'supabase',
    },
  }).createWorkflowContextRepository();

  const context = createBusinessContext({
    institutionId: 'INS-SAVE-CONTRACT-001',
    opportunityId: 'OPP-SAVE-CONTRACT-001',
    workflowId: `${workflowId}-save-contract`,
    opportunityLifecycle: OpportunityLifecycle.APPROVED,
    currentOwner: 'Treasury Desk',
    currentWorkspace: 'treasury',
  });

  const savePromise = repository.save(context);
  assert.ok(savePromise instanceof Promise);
  await assert.rejects(
    () => savePromise,
    /Missing Supabase server configuration|fetch|Failed to persist|connect/i,
  );

  restoreSupabaseEnv();
});

test('C2. Durable persistence failure is propagated to the caller and is not silently swallowed', async () => {
  process.env.SUPABASE_URL = 'http://127.0.0.1:1';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
  delete process.env.WORKFLOW_CONTEXT_REPOSITORY_BACKEND;

  const repository = createWorkflowRepositoryProvider({
    workflowContext: {
      backend: 'supabase',
    },
  }).createWorkflowContextRepository();

  const context = createBusinessContext({
    institutionId: 'INS-SAVE-FAILURE-001',
    opportunityId: 'OPP-SAVE-FAILURE-001',
    workflowId: `${workflowId}-save-failure`,
    opportunityLifecycle: OpportunityLifecycle.UNDER_REVIEW,
    currentOwner: 'Executive Desk',
    currentWorkspace: 'executive',
  });

  await assert.rejects(
    () => repository.save(context),
    /Missing Supabase server configuration|fetch|Failed to persist|connect/i,
  );

  restoreSupabaseEnv();
});

test('C. Durable rehydration contract preserves workflow identity and state', async () => {
  const repository = createInMemoryWorkflowContextRepository();
  const initial = createBusinessContext({
    institutionId: 'INS-REHYDRATE-001',
    opportunityId: 'OPP-REHYDRATE-001',
    workflowId: `${workflowId}-rehydrate`,
    opportunityLifecycle: OpportunityLifecycle.FUNDING_ALLOCATED,
    currentOwner: 'Treasury Desk',
    currentWorkspace: 'treasury',
  });

  await repository.save(initial);
  const serialized = serializeBusinessContext(initial);
  const parsed = parseBusinessContext(serialized);
  assert.ok(parsed);
  assert.equal(parsed?.workflowId, initial.workflowId);
  assert.equal(parsed?.institutionId, initial.institutionId);
  assert.equal(parsed?.opportunityId, initial.opportunityId);
  assert.equal(parsed?.currentWorkspace, initial.currentWorkspace);

  const transitioned = transitionBusinessContext({
    context: initial,
    toLifecycle: OpportunityLifecycle.RELEASED_FOR_PURCHASE,
    toWorkspace: 'forfaiting',
    nextOwner: 'Forfaiting Desk',
    receivableId: 'RCV-REHYDRATE-001',
  });

  await repository.save(transitioned);
  assert.equal(repository.findByWorkflowId(initial.workflowId)?.workflowId, initial.workflowId);
  assert.equal(repository.findByWorkflowId(initial.workflowId)?.receivableId, 'RCV-REHYDRATE-001');
  assert.equal(repository.findByWorkflowId(initial.workflowId)?.currentWorkspace, 'forfaiting');
});

test('D. Canonical journey continuity uses one stable workflowId through route stages', async () => {
  const repository = createInMemoryWorkflowContextRepository();
  const commercial = createBusinessContext({
    institutionId: 'INS-JOURNEY-001',
    opportunityId: 'OPP-JOURNEY-001',
    workflowId,
    opportunityLifecycle: OpportunityLifecycle.SUBMITTED,
    currentOwner: 'Relationship Manager',
    currentWorkspace: 'commercial',
  });
  const executive = transitionBusinessContext({
    context: commercial,
    toLifecycle: OpportunityLifecycle.UNDER_REVIEW,
    toWorkspace: 'executive',
    nextOwner: 'Executive Desk',
  });
  const approved = transitionBusinessContext({
    context: executive,
    toLifecycle: OpportunityLifecycle.APPROVED,
    toWorkspace: 'executive',
    nextOwner: 'Executive Committee',
  });
  const treasury = transitionBusinessContext({
    context: approved,
    toLifecycle: OpportunityLifecycle.FUNDING_ALLOCATED,
    toWorkspace: 'treasury',
    nextOwner: 'Treasury Desk',
  });
  const forfaiting = transitionBusinessContext({
    context: treasury,
    toLifecycle: OpportunityLifecycle.RELEASED_FOR_PURCHASE,
    toWorkspace: 'forfaiting',
    nextOwner: 'Forfaiting Desk',
    receivableId: 'RCV-JOURNEY-001',
  });

  await repository.saveMany([commercial, executive, approved, treasury, forfaiting]);

  const byWorkflowId = repository.findByWorkflowId(workflowId);
  assert.ok(byWorkflowId);
  assert.equal(byWorkflowId?.workflowId, workflowId);
  assert.equal(byWorkflowId?.currentWorkspace, 'forfaiting');
  assert.equal(byWorkflowId?.receivableId, 'RCV-JOURNEY-001');
  assert.equal(byWorkflowId?.opportunityLifecycle, OpportunityLifecycle.RELEASED_FOR_PURCHASE);

  const runtime = createInstitutionRuntimeComposition();
  assert.equal(typeof runtime.workflowContextRepository.save, 'function');
});

test('E. Missing persisted workflow remains explicit and does not silently replace a valid context', async () => {
  const repository = createInMemoryWorkflowContextRepository();
  const existing = createBusinessContext({
    institutionId: 'INS-MISSING-001',
    opportunityId: 'OPP-MISSING-001',
    workflowId: `${workflowId}-missing`,
    opportunityLifecycle: OpportunityLifecycle.APPROVED,
    currentOwner: 'Executive Committee',
    currentWorkspace: 'executive',
  });

  await repository.save(existing);
  const missing = repository.findByWorkflowId(`${workflowId}-not-found`);
  assert.equal(missing, undefined);
  assert.equal(repository.findByWorkflowId(existing.workflowId)?.workflowId, existing.workflowId);
});

process.on('exit', restoreSupabaseEnv);
