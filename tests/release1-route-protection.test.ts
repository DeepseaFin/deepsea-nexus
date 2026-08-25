import assert from 'node:assert/strict';
import test from 'node:test';

import {
  findRouteProtectionDefinition,
  isReleaseOneProtectedPath,
  normalizeRoutePathname,
  RELEASE_1_ROUTE_PROTECTION_REGISTRY,
  resolveRouteProtectionLevel,
} from '../lib/supabase/protection.ts';

test('A. Protected root routes', () => {
  const roots = [
    '/atlas',
    '/atlas/institution',
    '/atlas/commercial',
    '/atlas/forfaiting',
    '/atlas/treasury',
    '/executive',
  ];

  for (const pathname of roots) {
    const definition = findRouteProtectionDefinition(RELEASE_1_ROUTE_PROTECTION_REGISTRY, {
      pathname,
      method: 'GET',
    });
    assert.ok(definition, `${pathname} should be protected`);
  }
});

test('B. Descendant protection', () => {
  const protectedChildren = [
    ['/atlas/institution/test', 'atlas-institution'],
    ['/atlas/commercial/test', 'atlas-commercial'],
    ['/atlas/forfaiting/test', 'atlas-forfaiting'],
    ['/atlas/treasury/test', 'atlas-treasury'],
    ['/executive/test', 'executive'],
  ];

  for (const [pathname, expectedId] of protectedChildren) {
    const definition = findRouteProtectionDefinition(RELEASE_1_ROUTE_PROTECTION_REGISTRY, {
      pathname,
      method: 'GET',
    });
    assert.ok(definition, `${pathname} should resolve to a route definition`);
    assert.equal(definition?.id, expectedId, `${pathname} should resolve to the parent route definition`);
  }
});

test('C. Boundary correctness', () => {
  assert.equal(findRouteProtectionDefinition(RELEASE_1_ROUTE_PROTECTION_REGISTRY, {
    pathname: '/atlasx',
    method: 'GET',
  }), null, '/atlasx must not match /atlas');

  assert.equal(findRouteProtectionDefinition(RELEASE_1_ROUTE_PROTECTION_REGISTRY, {
    pathname: '/executive-other',
    method: 'GET',
  }), null, '/executive-other must not match /executive');

  assert.equal(isReleaseOneProtectedPath('/company'), false, 'Unrelated paths must not be classified as Release-1 protected');
  assert.equal(findRouteProtectionDefinition(RELEASE_1_ROUTE_PROTECTION_REGISTRY, {
    pathname: '/company',
    method: 'GET',
  }), null, 'Unrelated paths must not resolve to a Release-1 definition');
});

test('D. Most-specific route precedence', () => {
  const parent = findRouteProtectionDefinition(RELEASE_1_ROUTE_PROTECTION_REGISTRY, {
    pathname: '/atlas/commercial',
    method: 'GET',
  });
  const child = findRouteProtectionDefinition(RELEASE_1_ROUTE_PROTECTION_REGISTRY, {
    pathname: '/atlas/commercial/test',
    method: 'GET',
  });

  assert.equal(parent?.id, 'atlas-commercial');
  assert.equal(child?.id, 'atlas-commercial');
  assert.ok(parent && child, 'Both parent and child route definitions should exist');
  assert.equal(
    resolveRouteProtectionLevel(child, 'public'),
    resolveRouteProtectionLevel(parent, 'public'),
    'The resolved level should remain consistent with the matched definition',
  );
});

test('E. HTTP method filtering', () => {
  const allowed = findRouteProtectionDefinition(RELEASE_1_ROUTE_PROTECTION_REGISTRY, {
    pathname: '/atlas',
    method: 'GET',
  });
  const disallowed = findRouteProtectionDefinition(RELEASE_1_ROUTE_PROTECTION_REGISTRY, {
    pathname: '/atlas',
    method: 'TRACE',
  });

  assert.ok(allowed, '/atlas GET should be allowed');
  assert.equal(disallowed, null, '/atlas TRACE should be rejected by method filtering');
});

test('F. Route normalization', () => {
  assert.equal(normalizeRoutePathname('/atlas/'), '/atlas');
  assert.equal(normalizeRoutePathname('atlas'), '/atlas');
  assert.equal(normalizeRoutePathname('/atlas/institution/'), '/atlas/institution');
});

test('G. Public/non-Release-1 behavior', () => {
  assert.equal(isReleaseOneProtectedPath('/login'), false, '/login should not be Release-1 protected');
  assert.equal(findRouteProtectionDefinition(RELEASE_1_ROUTE_PROTECTION_REGISTRY, {
    pathname: '/login',
    method: 'GET',
  }), null, '/login should not resolve to a Release-1 route');
});
