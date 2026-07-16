import type { IdentityContext } from '@/lib/supabase/identity';
import type { RouteProtectionContext } from '@/lib/supabase/protection';
import type { SessionContext } from '@/lib/supabase/session';

export type PermissionResource =
  | 'institution'
  | 'commercial'
  | 'executive'
  | 'treasury'
  | 'forfaiting'
  | 'oracle'
  | 'documents'
  | 'dashboard'
  | 'administration';

export type PermissionAction =
  | 'read'
  | 'create'
  | 'update'
  | 'delete'
  | 'submit'
  | 'approve'
  | 'allocate'
  | 'purchase'
  | 'upload'
  | 'extract'
  | 'configure';

export type PermissionKey = `${PermissionResource}.${PermissionAction}`;

export interface PermissionDefinition {
  readonly key: PermissionKey;
  readonly resource: PermissionResource;
  readonly action: PermissionAction;
  readonly description?: string;
  readonly tags?: readonly string[];
  readonly metadata?: Readonly<Record<string, string>>;
}

export interface PermissionContext {
  readonly identity: IdentityContext | null;
  readonly session: SessionContext | null;
  readonly protection: RouteProtectionContext | null;
  readonly granted: readonly PermissionKey[];
  readonly definitions: readonly PermissionDefinition[];
  readonly byKey: ReadonlyMap<PermissionKey, PermissionDefinition>;
}

const PERMISSION_RESOURCES: readonly PermissionResource[] = Object.freeze([
  'institution',
  'commercial',
  'executive',
  'treasury',
  'forfaiting',
  'oracle',
  'documents',
  'dashboard',
  'administration',
]);

const PERMISSION_ACTIONS: readonly PermissionAction[] = Object.freeze([
  'read',
  'create',
  'update',
  'delete',
  'submit',
  'approve',
  'allocate',
  'purchase',
  'upload',
  'extract',
  'configure',
]);

function normalizeToken(value: string): string {
  return value.trim().toLowerCase();
}

function toPermissionResource(value: string): PermissionResource | null {
  const normalized = normalizeToken(value);
  return PERMISSION_RESOURCES.find((resource) => resource === normalized) ?? null;
}

function toPermissionAction(value: string): PermissionAction | null {
  const normalized = normalizeToken(value);
  return PERMISSION_ACTIONS.find((action) => action === normalized) ?? null;
}

function freezeStringArray(values?: readonly string[]): readonly string[] | undefined {
  if (!values || values.length === 0) {
    return undefined;
  }

  return Object.freeze([...new Set(values.map((value) => value.trim()).filter((value) => value.length > 0))]);
}

export function listPermissionResources(): readonly PermissionResource[] {
  return PERMISSION_RESOURCES;
}

export function listPermissionActions(): readonly PermissionAction[] {
  return PERMISSION_ACTIONS;
}

export function normalizePermissionResource(value: string): PermissionResource | null {
  return toPermissionResource(value);
}

export function normalizePermissionAction(value: string): PermissionAction | null {
  return toPermissionAction(value);
}

export function createPermissionKey(
  resource: PermissionResource,
  action: PermissionAction,
): PermissionKey {
  return `${resource}.${action}`;
}

export function parsePermissionKey(value: string): {
  readonly resource: PermissionResource;
  readonly action: PermissionAction;
  readonly key: PermissionKey;
} | null {
  const [resourceRaw, actionRaw, ...rest] = value.split('.');
  if (!resourceRaw || !actionRaw || rest.length > 0) {
    return null;
  }

  const resource = toPermissionResource(resourceRaw);
  const action = toPermissionAction(actionRaw);

  if (!resource || !action) {
    return null;
  }

  const key = createPermissionKey(resource, action);
  return Object.freeze({ resource, action, key });
}

export function normalizePermissionKey(value: string): PermissionKey | null {
  return parsePermissionKey(value)?.key ?? null;
}

export function createPermissionDefinition(input: {
  readonly resource: PermissionResource | string;
  readonly action: PermissionAction | string;
  readonly description?: string;
  readonly tags?: readonly string[];
  readonly metadata?: Readonly<Record<string, string>>;
}): PermissionDefinition {
  const resource = toPermissionResource(String(input.resource));
  const action = toPermissionAction(String(input.action));

  if (!resource || !action) {
    throw new Error('Invalid permission definition. Expected canonical resource and action values.');
  }

  return Object.freeze({
    key: createPermissionKey(resource, action),
    resource,
    action,
    description: input.description?.trim() || undefined,
    tags: freezeStringArray(input.tags),
    metadata: input.metadata ? Object.freeze({ ...input.metadata }) : undefined,
  });
}

export function createCanonicalPermissionDefinitions(): readonly PermissionDefinition[] {
  const definitions: PermissionDefinition[] = [];

  for (const resource of PERMISSION_RESOURCES) {
    for (const action of PERMISSION_ACTIONS) {
      definitions.push(createPermissionDefinition({ resource, action }));
    }
  }

  return Object.freeze(definitions);
}

export const CANONICAL_PERMISSION_DEFINITIONS = createCanonicalPermissionDefinitions();

export function normalizePermissionCollection(
  values: readonly string[] = [],
): readonly PermissionKey[] {
  const keys = values
    .map((value) => normalizePermissionKey(value))
    .filter((value): value is PermissionKey => value !== null);

  return Object.freeze([...new Set(keys)]);
}

export function mergePermissionCollections(
  base: readonly string[] = [],
  additional: readonly string[] = [],
): readonly PermissionKey[] {
  return normalizePermissionCollection([...base, ...additional]);
}

export function hasPermission(
  permissions: readonly string[],
  permission: PermissionKey | string,
): boolean {
  const normalizedPermission = normalizePermissionKey(permission);
  if (!normalizedPermission) {
    return false;
  }

  return normalizePermissionCollection(permissions).includes(normalizedPermission);
}

export function indexPermissionDefinitions(
  definitions: readonly PermissionDefinition[],
): ReadonlyMap<PermissionKey, PermissionDefinition> {
  const byKey = new Map<PermissionKey, PermissionDefinition>();

  for (const definition of definitions) {
    byKey.set(definition.key, definition);
  }

  return byKey as ReadonlyMap<PermissionKey, PermissionDefinition>;
}

export function createPermissionContext(input: {
  readonly identity?: IdentityContext | null;
  readonly session?: SessionContext | null;
  readonly protection?: RouteProtectionContext | null;
  readonly granted?: readonly string[];
  readonly definitions?: readonly PermissionDefinition[];
} = {}): PermissionContext {
  const definitions = Object.freeze([...(input.definitions ?? CANONICAL_PERMISSION_DEFINITIONS)]);

  return Object.freeze({
    identity: input.identity ?? null,
    session: input.session ?? null,
    protection: input.protection ?? null,
    granted: normalizePermissionCollection(input.granted),
    definitions,
    byKey: indexPermissionDefinitions(definitions),
  });
}
