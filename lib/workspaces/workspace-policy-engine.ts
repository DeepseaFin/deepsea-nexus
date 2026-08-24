import type {
  WorkspaceAttributes,
  WorkspaceValidationIssue,
  WorkspaceValidationResult,
} from "@/lib/workspaces/types";
import type { WorkspaceCommandContext } from "@/lib/workspaces/workspace-command-engine";

export type WorkspacePolicyDecision = "allow" | "deny";

export interface WorkspacePolicyContext<TCommand = unknown, TState extends Record<string, unknown> = Record<string, unknown>> {
  readonly command: TCommand;
  readonly context: WorkspaceCommandContext;
  readonly state: TState;
}

export interface WorkspacePolicyResult {
  readonly decision: WorkspacePolicyDecision;
  readonly warnings: readonly string[];
  readonly advisoryMessages: readonly string[];
  readonly issues: readonly WorkspaceValidationIssue[];
}

export interface WorkspacePolicy<TCommand = unknown, TState extends Record<string, unknown> = Record<string, unknown>> {
  readonly id: string;
  evaluate: (input: WorkspacePolicyContext<TCommand, TState>) => WorkspacePolicyResult;
}

export interface WorkspacePolicyRegistry<TCommand = unknown, TState extends Record<string, unknown> = Record<string, unknown>> {
  registerPolicy: (policy: WorkspacePolicy<TCommand, TState>) => () => void;
  unregisterPolicy: (policyOrId: WorkspacePolicy<TCommand, TState> | string) => void;
  evaluate: (input: WorkspacePolicyContext<TCommand, TState>) => WorkspacePolicyEvaluationResult;
}

export interface WorkspacePolicyEvaluationResult {
  readonly allowed: boolean;
  readonly warnings: readonly string[];
  readonly advisoryMessages: readonly string[];
  readonly validation: WorkspaceValidationResult;
  readonly policyIds: readonly string[];
}

export interface CreateWorkspacePolicyRegistryOptions {
  readonly maxWarnings?: number;
}

function mergeValidationIssues(results: readonly WorkspacePolicyResult[]): WorkspaceValidationIssue[] {
  return results.flatMap((result) => result.issues);
}

function mergeStrings(results: readonly WorkspacePolicyResult[], selector: (result: WorkspacePolicyResult) => readonly string[]): string[] {
  return results.flatMap((result) => selector(result));
}

export function createWorkspacePolicyRegistry<
  TCommand = unknown,
  TState extends Record<string, unknown> = Record<string, unknown>,
>(options?: CreateWorkspacePolicyRegistryOptions): WorkspacePolicyRegistry<TCommand, TState> {
  const policies: WorkspacePolicy<TCommand, TState>[] = [];
  const maxWarnings = options?.maxWarnings ?? Number.POSITIVE_INFINITY;

  const registerPolicy: WorkspacePolicyRegistry<TCommand, TState>["registerPolicy"] = (policy) => {
    const existingIndex = policies.findIndex((registered) => registered.id === policy.id);
    if (existingIndex >= 0) {
      policies[existingIndex] = policy;
    } else {
      policies.push(policy);
    }

    return () => {
      unregisterPolicy(policy.id);
    };
  };

  const unregisterPolicy: WorkspacePolicyRegistry<TCommand, TState>["unregisterPolicy"] = (policyOrId) => {
    const policyId = typeof policyOrId === "string" ? policyOrId : policyOrId.id;
    const index = policies.findIndex((registered) => registered.id === policyId);
    if (index < 0) {
      return;
    }

    policies.splice(index, 1);
  };

  const evaluate: WorkspacePolicyRegistry<TCommand, TState>["evaluate"] = (input) => {
    const results = policies.map((policy) => policy.evaluate(input));
    const policyIds = policies.map((policy) => policy.id);
    const warnings = mergeStrings(results, (result) => result.warnings).slice(0, maxWarnings);
    const advisoryMessages = mergeStrings(results, (result) => result.advisoryMessages);
    const issues = mergeValidationIssues(results);
    const allowed = results.every((result) => result.decision === "allow") && issues.length === 0;

    return {
      allowed,
      warnings,
      advisoryMessages,
      validation: {
        valid: allowed,
        issues,
      },
      policyIds,
    };
  };

  return {
    registerPolicy,
    unregisterPolicy,
    evaluate,
  };
}

export function createAllowAllPolicyResult(
  warnings: readonly string[] = [],
  advisoryMessages: readonly string[] = [],
): WorkspacePolicyResult {
  return {
    decision: "allow",
    warnings,
    advisoryMessages,
    issues: [],
  };
}

export function createDenyPolicyResult(
  issue: WorkspaceValidationIssue,
  warnings: readonly string[] = [],
  advisoryMessages: readonly string[] = [],
): WorkspacePolicyResult {
  return {
    decision: "deny",
    warnings,
    advisoryMessages,
    issues: [issue],
  };
}

export function policyIssue(
  code: string,
  message: string,
  target?: string,
  metadata?: WorkspaceAttributes,
): WorkspaceValidationIssue {
  return {
    code,
    message,
    target,
    metadata,
  };
}
