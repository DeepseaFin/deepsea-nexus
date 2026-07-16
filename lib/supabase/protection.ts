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
  const candidates = registry.byPath.get(pathname) ?? [];

  return candidates.find((definition) => isMethodAllowed(definition, method)) ?? null;
}

export function listRouteProtectionDefinitions(
  registry: RouteProtectionRegistry,
  pathname: string,
): readonly RouteProtectionDefinition[] {
  return registry.byPath.get(normalizeRoutePathname(pathname)) ?? Object.freeze([]);
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
