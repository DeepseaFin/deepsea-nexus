import { createWorkspace, type Workspace, type WorkspaceInput } from "@/lib/workspaces/Workspace";
import { createWorkspaceRegistry, type WorkspaceRegistry } from "@/lib/workspaces/WorkspaceRegistry";
import type { WorkspaceValidationIssue, WorkspaceValidationResult, WorkspaceTimestamp } from "@/lib/workspaces/types";

export class WorkspaceDomainError extends Error {
  readonly issues: readonly WorkspaceValidationIssue[];

  constructor(message: string, issues: readonly WorkspaceValidationIssue[]) {
    super(message);
    this.name = "WorkspaceDomainError";
    this.issues = issues;
  }
}

function issue(code: string, message: string, target?: string): WorkspaceValidationIssue {
  return { code, message, target };
}

function validationResult(issues: readonly WorkspaceValidationIssue[]): WorkspaceValidationResult {
  return { valid: issues.length === 0, issues };
}

function assertValid(result: WorkspaceValidationResult, message: string): void {
  if (!result.valid) {
    throw new WorkspaceDomainError(message, result.issues);
  }
}

function nowTimestamp(occurredAt?: WorkspaceTimestamp): WorkspaceTimestamp {
  return occurredAt ?? new Date().toISOString();
}

function uniqueIds<T extends { readonly [key: string]: string }>(items: readonly T[], key: keyof T): string[] {
  return items.map((item) => item[key]).filter((id, index, values) => values.indexOf(id) !== index);
}

function replaceWorkspace(registry: WorkspaceRegistry, workspace: Workspace): WorkspaceRegistry {
  const hasExisting = registry.workspaces.some(
    (current) => current.definition.workspaceId === workspace.definition.workspaceId,
  );

  const nextWorkspaces = hasExisting
    ? registry.workspaces.map((current) =>
        current.definition.workspaceId === workspace.definition.workspaceId ? workspace : current,
      )
    : [...registry.workspaces, workspace];

  return {
    ...registry,
    workspaces: nextWorkspaces,
  };
}

export class WorkspaceService {
  static createWorkspace(input: WorkspaceInput): Workspace {
    return createWorkspace(input);
  }

  static createRegistry(registryId: string, workspaces?: readonly Workspace[]): WorkspaceRegistry {
    return createWorkspaceRegistry({ registryId, workspaces });
  }

  static validateDefinition(workspace: Workspace): WorkspaceValidationResult {
    const issues: WorkspaceValidationIssue[] = [];

    if (!workspace.definition.workspaceId.trim()) {
      issues.push(issue("workspace_id_required", "Workspace id is required.", "definition.workspaceId"));
    }

    if (!workspace.definition.name.trim()) {
      issues.push(issue("workspace_name_required", "Workspace name is required.", "definition.name"));
    }

    if (!workspace.definition.displayName.trim()) {
      issues.push(issue("workspace_display_name_required", "Workspace display name is required.", "definition.displayName"));
    }

    if (!workspace.definition.version.trim()) {
      issues.push(issue("workspace_version_required", "Workspace version is required.", "definition.version"));
    }

    return validationResult(issues);
  }

  static validateManifest(workspace: Workspace): WorkspaceValidationResult {
    const issues: WorkspaceValidationIssue[] = [];
    const manifest = workspace.manifest;

    if (!manifest.manifestId.trim()) {
      issues.push(issue("workspace_manifest_id_required", "Workspace manifest id is required.", "manifest.manifestId"));
    }

    for (const duplicateId of uniqueIds(manifest.capabilities, "capabilityId")) {
      issues.push(issue("duplicate_capability_id", `Duplicate capability id detected: ${duplicateId}.`, "manifest.capabilities"));
    }

    for (const duplicateId of uniqueIds(manifest.panels, "panelId")) {
      issues.push(issue("duplicate_panel_id", `Duplicate panel id detected: ${duplicateId}.`, "manifest.panels"));
    }

    for (const duplicateId of uniqueIds(manifest.navigation, "itemId")) {
      issues.push(issue("duplicate_navigation_item_id", `Duplicate navigation item id detected: ${duplicateId}.`, "manifest.navigation"));
    }

    const panelIds = new Set(manifest.panels.map((panel) => panel.panelId));
    const capabilityIds = new Set(manifest.capabilities.map((capability) => capability.capabilityId));

    for (const panel of manifest.panels) {
      if (!panel.title.trim()) {
        issues.push(issue("workspace_panel_title_required", "Workspace panel title is required.", `manifest.panels.${panel.panelId}.title`));
      }

      for (const requiredCapabilityId of panel.requiredCapabilityIds) {
        if (!capabilityIds.has(requiredCapabilityId)) {
          issues.push(
            issue(
              "workspace_panel_capability_missing",
              `Panel ${panel.panelId} requires missing capability ${requiredCapabilityId}.`,
              `manifest.panels.${panel.panelId}.requiredCapabilityIds`,
            ),
          );
        }
      }

      for (const dependencyPanelId of panel.dependsOnPanelIds) {
        if (!panelIds.has(dependencyPanelId)) {
          issues.push(
            issue(
              "workspace_panel_dependency_missing",
              `Panel ${panel.panelId} depends on missing panel ${dependencyPanelId}.`,
              `manifest.panels.${panel.panelId}.dependsOnPanelIds`,
            ),
          );
        }
      }
    }

    for (const navigationItem of manifest.navigation) {
      if (!panelIds.has(navigationItem.panelId)) {
        issues.push(
          issue(
            "workspace_navigation_panel_missing",
            `Navigation item ${navigationItem.itemId} references missing panel ${navigationItem.panelId}.`,
            `manifest.navigation.${navigationItem.itemId}.panelId`,
          ),
        );
      }
    }

    const defaultNavigationItems = manifest.navigation.filter((item) => item.defaultItem);
    if (defaultNavigationItems.length > 1) {
      issues.push(issue("workspace_navigation_multiple_defaults", "Only one navigation item can be marked as default.", "manifest.navigation"));
    }

    for (const dependency of manifest.dependencies) {
      if (dependency.workspaceId === workspace.definition.workspaceId) {
        issues.push(issue("workspace_dependency_self_reference", "Workspace cannot depend on itself.", "manifest.dependencies"));
      }
    }

    return validationResult(issues);
  }

  static validateContext(workspace: Workspace): WorkspaceValidationResult {
    const issues: WorkspaceValidationIssue[] = [];

    if (!workspace.context.institutionId.trim()) {
      issues.push(issue("workspace_context_institution_required", "Workspace context institutionId is required.", "context.institutionId"));
    }

    const observedAt = Date.parse(workspace.context.observedAt);
    const createdAt = Date.parse(workspace.createdAt);
    const updatedAt = Date.parse(workspace.updatedAt);

    if (!Number.isNaN(createdAt) && !Number.isNaN(updatedAt) && updatedAt < createdAt) {
      issues.push(issue("workspace_updated_before_created", "Workspace updatedAt cannot be earlier than createdAt.", "updatedAt"));
    }

    if (!Number.isNaN(observedAt) && !Number.isNaN(createdAt) && observedAt < createdAt) {
      issues.push(issue("workspace_context_before_created", "Workspace context observedAt cannot be earlier than createdAt.", "context.observedAt"));
    }

    if (workspace.revision < 0) {
      issues.push(issue("workspace_revision_invalid", "Workspace revision cannot be negative.", "revision"));
    }

    return validationResult(issues);
  }

  static validateWorkspace(workspace: Workspace): WorkspaceValidationResult {
    const definitionValidation = this.validateDefinition(workspace);
    const manifestValidation = this.validateManifest(workspace);
    const contextValidation = this.validateContext(workspace);

    return validationResult([
      ...definitionValidation.issues,
      ...manifestValidation.issues,
      ...contextValidation.issues,
    ]);
  }

  static validateRegistry(registry: WorkspaceRegistry): WorkspaceValidationResult {
    const issues: WorkspaceValidationIssue[] = [];

    if (!registry.registryId.trim()) {
      issues.push(issue("workspace_registry_id_required", "Workspace registry id is required.", "registryId"));
    }

    for (const duplicateId of uniqueIds(registry.workspaces.map((workspace) => workspace.definition), "workspaceId")) {
      issues.push(issue("workspace_registry_duplicate_workspace_id", `Duplicate workspace id detected: ${duplicateId}.`, "workspaces"));
    }

    const knownWorkspaceIds = new Set(registry.workspaces.map((workspace) => workspace.definition.workspaceId));

    for (const workspace of registry.workspaces) {
      const workspaceValidation = this.validateWorkspace(workspace);
      issues.push(...workspaceValidation.issues);

      for (const dependency of workspace.manifest.dependencies) {
        if (!knownWorkspaceIds.has(dependency.workspaceId)) {
          issues.push(
            issue(
              "workspace_registry_dependency_missing",
              `Workspace ${workspace.definition.workspaceId} depends on missing workspace ${dependency.workspaceId}.`,
              `workspaces.${workspace.definition.workspaceId}.manifest.dependencies`,
            ),
          );
        }
      }
    }

    const createdAt = Date.parse(registry.createdAt);
    const updatedAt = Date.parse(registry.updatedAt);
    if (!Number.isNaN(createdAt) && !Number.isNaN(updatedAt) && updatedAt < createdAt) {
      issues.push(issue("workspace_registry_updated_before_created", "Registry updatedAt cannot be earlier than createdAt.", "updatedAt"));
    }

    if (registry.revision < 0) {
      issues.push(issue("workspace_registry_revision_invalid", "Registry revision cannot be negative.", "revision"));
    }

    return validationResult(issues);
  }

  static registerWorkspace(
    registry: WorkspaceRegistry,
    workspace: Workspace,
    occurredAt?: WorkspaceTimestamp,
  ): WorkspaceRegistry {
    const workspaceValidation = this.validateWorkspace(workspace);
    assertValid(workspaceValidation, "Workspace registration failed because workspace is invalid.");

    const timestamp = nowTimestamp(occurredAt);
    const nextRegistry = replaceWorkspace(registry, workspace);

    const candidate: WorkspaceRegistry = {
      ...nextRegistry,
      updatedAt: timestamp,
      revision: registry.revision + 1,
    };

    const registryValidation = this.validateRegistry(candidate);
    assertValid(registryValidation, "Workspace registration failed because registry became invalid.");

    return candidate;
  }

  static unregisterWorkspace(
    registry: WorkspaceRegistry,
    workspaceId: string,
    occurredAt?: WorkspaceTimestamp,
  ): WorkspaceRegistry {
    const exists = registry.workspaces.some((workspace) => workspace.definition.workspaceId === workspaceId);
    if (!exists) {
      throw new WorkspaceDomainError("Workspace cannot be removed because it does not exist in registry.", [
        issue("workspace_not_found", `Workspace ${workspaceId} was not found in registry.`, "workspaceId"),
      ]);
    }

    const stillReferenced = registry.workspaces.some((workspace) =>
      workspace.manifest.dependencies.some((dependency) => dependency.workspaceId === workspaceId),
    );
    if (stillReferenced) {
      throw new WorkspaceDomainError("Workspace cannot be removed because other workspaces depend on it.", [
        issue("workspace_dependency_exists", `Workspace ${workspaceId} is still referenced by dependencies.`, "workspaceId"),
      ]);
    }

    const timestamp = nowTimestamp(occurredAt);
    return {
      ...registry,
      workspaces: registry.workspaces.filter((workspace) => workspace.definition.workspaceId !== workspaceId),
      updatedAt: timestamp,
      revision: registry.revision + 1,
    };
  }

  static discoverWorkspace(registry: WorkspaceRegistry, workspaceId: string): Workspace | undefined {
    return registry.workspaces.find((workspace) => workspace.definition.workspaceId === workspaceId);
  }

  static discoverByCapability(registry: WorkspaceRegistry, capabilityId: string): readonly Workspace[] {
    return registry.workspaces.filter((workspace) =>
      workspace.manifest.capabilities.some(
        (capability) => capability.capabilityId === capabilityId && capability.enabled,
      ),
    );
  }

  static discoverActive(registry: WorkspaceRegistry): readonly Workspace[] {
    return registry.workspaces.filter((workspace) => workspace.active && !workspace.deprecated);
  }
}
