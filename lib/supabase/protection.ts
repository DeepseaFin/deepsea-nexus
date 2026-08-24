import type { SupabaseAuthenticationContext } from '@/lib/supabase/auth';
import { normalizeSupabaseMiddlewarePath } from '@/lib/supabase/middleware';
import type { SessionContext, SessionStatus } from '@/lib/supabase/session';
import type { SupabaseRequestContext } from '@/lib/supabase/types';

export type RouteProtectionLevel = 'public' | 'session' | 'strict';

export interface RouteProtectionDefinition {
  readonly id: string;
  readonly pathname: string;
  readonly level: RouteProtectionLevel;
  readonly methods?: readonly string[];
  readonly tags?: readonly string[];
  readonly metadata?: Readonly<Record<string, string>>;
}

// RouteProtectionContext captures session and route protection state for the current request. It is runtime access metadata, not institutional domain state.
export interface RouteProtectionContext {
  readonly request: SupabaseRequestContext | null;
  readonly authentication: SupabaseAuthenticationContext | null;
  readonly session: SessionContext | null;
  readonly normalizedPathname: string;
  readonly method: string;
  readonly sessionStatus: SessionStatus;
}

export interface RouteProtectionRegistry {
  readonly definitions: readonly RouteProtectionDefinition[];
  readonly byPath: ReadonlyMap<string, readonly RouteProtectionDefinition[]>;
}

export interface RouteLookupInput {
  readonly pathname: string;
  readonly method?: string;
}

const DEFAULT_METHOD = 'GET';

function splitPathSegments(pathname: string): readonly string[] {
  const normalized = normalizeRoutePathname(pathname);
  if (normalized === '/') {
    return Object.freeze([]);
  }

  return Object.freeze(normalized.split('/').filter(Boolean));
}

function isPathWithinDefinition(pathname: string, definitionPathname: string): boolean {
  const requestSegments = splitPathSegments(pathname);
  const definitionSegments = splitPathSegments(definitionPathname);

  if (definitionSegments.length === 0) {
    return false;
  }

  if (requestSegments.length < definitionSegments.length) {
    return false;
  }

  return definitionSegments.every((segment, index) => requestSegments[index] === segment);
}

function chooseMostSpecificRouteDefinition(definitions: readonly RouteProtectionDefinition[]): RouteProtectionDefinition | null {
  if (definitions.length === 0) {
    return null;
  }

  return definitions
    .slice()
    .sort((left, right) => splitPathSegments(right.pathname).length - splitPathSegments(left.pathname).length)[0] ?? null;
}

function normalizeMethod(method?: string): string {
  if (!method) {
    return DEFAULT_METHOD;
  }

  const value = method.trim().toUpperCase();
  return value.length > 0 ? value : DEFAULT_METHOD;
}

function normalizeMethods(methods?: readonly string[]): readonly string[] | undefined {
  if (!methods || methods.length === 0) {
    return undefined;
  }

  const normalized = Array.from(new Set(methods.map((method) => normalizeMethod(method))));
  return Object.freeze(normalized);
}

function freezeDefinition(definition: RouteProtectionDefinition): RouteProtectionDefinition {
  return Object.freeze({
    id: definition.id,
    pathname: normalizeSupabaseMiddlewarePath(definition.pathname),
    level: definition.level,
    methods: normalizeMethods(definition.methods),
    tags: definition.tags ? Object.freeze([...definition.tags]) : undefined,
    metadata: definition.metadata ? Object.freeze({ ...definition.metadata }) : undefined,
  });
}

export function createRouteProtectionDefinition(
  definition: RouteProtectionDefinition,
): RouteProtectionDefinition {
  return freezeDefinition(definition);
}

export function createRouteProtectionRegistry(
  definitions: readonly RouteProtectionDefinition[],
): RouteProtectionRegistry {
  const frozenDefinitions = Object.freeze(definitions.map((definition) => freezeDefinition(definition)));
  const grouped = new Map<string, RouteProtectionDefinition[]>();

  for (const definition of frozenDefinitions) {
    const list = grouped.get(definition.pathname) ?? [];
    list.push(definition);
    grouped.set(definition.pathname, list);
  }

  const byPath = new Map<string, readonly RouteProtectionDefinition[]>();
  for (const [pathname, list] of grouped.entries()) {
    byPath.set(pathname, Object.freeze([...list]));
  }

  return Object.freeze({
    definitions: frozenDefinitions,
    byPath: byPath as ReadonlyMap<string, readonly RouteProtectionDefinition[]>,
  });
}

export function normalizeRoutePathname(pathname: string): string {
  return normalizeSupabaseMiddlewarePath(pathname);
}

export function isMethodAllowed(
  definition: RouteProtectionDefinition,
  method: string,
): boolean {
  if (!definition.methods || definition.methods.length === 0) {
    return true;
  }

  return definition.methods.includes(normalizeMethod(method));
}

export function findRouteProtectionDefinition(
  registry: RouteProtectionRegistry,
  input: RouteLookupInput,
): RouteProtectionDefinition | null {
  const pathname = normalizeRoutePathname(input.pathname);
  const method = normalizeMethod(input.method);

  const candidates = registry.definitions.filter((definition) => {
    if (!isMethodAllowed(definition, method)) {
      return false;
    }

    return pathname === definition.pathname || isPathWithinDefinition(pathname, definition.pathname);
  });

  return chooseMostSpecificRouteDefinition(candidates);
}

export function listRouteProtectionDefinitions(
  registry: RouteProtectionRegistry,
  pathname: string,
): readonly RouteProtectionDefinition[] {
  const normalized = normalizeRoutePathname(pathname);
  return registry.definitions.filter((definition) => {
    return normalized === definition.pathname || isPathWithinDefinition(normalized, definition.pathname);
  });
}

export function createRouteProtectionContext(input: {
  readonly request?: SupabaseRequestContext | null;
  readonly authentication?: SupabaseAuthenticationContext | null;
  readonly session?: SessionContext | null;
}): RouteProtectionContext {
  const request = input.request ?? null;
  const session = input.session ?? null;

  return Object.freeze({
    request,
    authentication: input.authentication ?? null,
    session,
    normalizedPathname: normalizeRoutePathname(request?.pathname ?? '/'),
    method: normalizeMethod(request?.method),
    sessionStatus: session?.snapshot.status ?? 'unknown',
  });
}

export function resolveRouteProtectionLevel(
  definition: RouteProtectionDefinition | null,
  fallback: RouteProtectionLevel = 'public',
): RouteProtectionLevel {
  return definition?.level ?? fallback;
}

export const RELEASE_1_ROUTE_PROTECTION_DEFINITIONS = Object.freeze([
  createRouteProtectionDefinition({
    id: 'atlas-root',
    pathname: '/atlas',
    level: 'session',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    tags: ['release-1'],
    metadata: { requiredPermission: 'institution.read' },
  }),
  createRouteProtectionDefinition({
    id: 'atlas-institution',
    pathname: '/atlas/institution',
    level: 'session',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    tags: ['release-1'],
    metadata: { requiredPermission: 'institution.read' },
  }),
  createRouteProtectionDefinition({
    id: 'atlas-commercial',
    pathname: '/atlas/commercial',
    level: 'strict',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    tags: ['release-1'],
    metadata: { requiredPermission: 'commercial.read' },
  }),
  createRouteProtectionDefinition({
    id: 'atlas-forfaiting',
    pathname: '/atlas/forfaiting',
    level: 'strict',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    tags: ['release-1'],
    metadata: { requiredPermission: 'forfaiting.read' },
  }),
  createRouteProtectionDefinition({
    id: 'atlas-treasury',
    pathname: '/atlas/treasury',
    level: 'strict',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    tags: ['release-1'],
    metadata: { requiredPermission: 'treasury.read' },
  }),
  createRouteProtectionDefinition({
    id: 'executive',
    pathname: '/executive',
    level: 'strict',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    tags: ['release-1'],
    metadata: { requiredPermission: 'executive.read' },
  }),
]);

export const RELEASE_1_ROUTE_PROTECTION_REGISTRY = createRouteProtectionRegistry(
  RELEASE_1_ROUTE_PROTECTION_DEFINITIONS,
);

export function isReleaseOneProtectedPath(pathname: string): boolean {
  const normalized = normalizeRoutePathname(pathname);
  return RELEASE_1_ROUTE_PROTECTION_DEFINITIONS.some((definition) => {
    return normalized === definition.pathname || isPathWithinDefinition(normalized, definition.pathname);
  });
}
