import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function resolveLocalPath(specifier) {
  const relative = specifier.startsWith('@/') ? specifier.slice(2) : specifier;
  const base = path.join(root, relative);
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    `${base}.mjs`,
    `${base}.cjs`,
    path.join(base, 'index.ts'),
    path.join(base, 'index.tsx'),
    path.join(base, 'index.js'),
    path.join(base, 'index.mjs'),
    path.join(base, 'index.cjs'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return pathToFileURL(candidate).href;
    }
  }

  return null;
}

export async function resolve(specifier, context, defaultResolve) {
  if (specifier.startsWith('@/')) {
    const resolvedUrl = resolveLocalPath(specifier);
    if (resolvedUrl) {
      return { shortCircuit: true, url: resolvedUrl };
    }
  }

  return defaultResolve(specifier, context, defaultResolve);
}
