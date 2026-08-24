export interface EventVersion {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
}

export const DEFAULT_EVENT_VERSION: EventVersion = {
  major: 1,
  minor: 0,
  patch: 0,
};

export function formatEventVersion(version: EventVersion): string {
  return `${version.major}.${version.minor}.${version.patch}`;
}
