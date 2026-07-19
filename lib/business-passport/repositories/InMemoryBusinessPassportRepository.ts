import type { PassportLifecycle } from "@/lib/business-passport/constants/PassportLifecycle";
import type { PassportStatus } from "@/lib/business-passport/constants/PassportStatus";
import type { BusinessPassport } from "@/lib/business-passport/domain/BusinessPassport";
import type { BusinessPassportRepository } from "@/lib/business-passport/repositories/BusinessPassportRepository";
import type { PassportId } from "@/lib/business-passport/value-objects/PassportId";

type JsonLikeRecord = Record<string, unknown>;

function isPlainObject(value: unknown): value is JsonLikeRecord {
  if (value === null || typeof value !== "object") {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function cloneValue<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => cloneValue(item)) as T;
  }

  if (!isPlainObject(value)) {
    return value;
  }

  const clone: JsonLikeRecord = {};
  for (const [key, entry] of Object.entries(value)) {
    clone[key] = cloneValue(entry);
  }

  return clone as T;
}

function clonePassport(passport: BusinessPassport): BusinessPassport {
  return cloneValue(passport);
}

function toStorageKey(passportId: PassportId): string {
  return passportId.toString();
}

export class InMemoryBusinessPassportRepository implements BusinessPassportRepository {
  private readonly passportsById = new Map<string, BusinessPassport>();

  async findById(passportId: PassportId): Promise<BusinessPassport | null> {
    const stored = this.passportsById.get(toStorageKey(passportId));
    if (!stored) {
      return null;
    }

    return clonePassport(stored);
  }

  async save(passport: BusinessPassport): Promise<void> {
    // Repository responsibility: maintain in-memory isolation so callers do not
    // accidentally mutate the stored aggregate through shared object references.
    this.passportsById.set(toStorageKey(passport.passportId), clonePassport(passport));
  }

  async listByStatus(status: PassportStatus): Promise<readonly BusinessPassport[]> {
    const matches = Array.from(this.passportsById.values())
      .filter((passport) => passport.status === status)
      .sort((left, right) => left.passportId.toString().localeCompare(right.passportId.toString()));

    return matches.map((passport) => clonePassport(passport));
  }

  async listByLifecycle(lifecycle: PassportLifecycle): Promise<readonly BusinessPassport[]> {
    const matches = Array.from(this.passportsById.values())
      .filter((passport) => passport.lifecycle === lifecycle)
      .sort((left, right) => left.passportId.toString().localeCompare(right.passportId.toString()));

    return matches.map((passport) => clonePassport(passport));
  }
}

export function createInMemoryBusinessPassportRepository(): BusinessPassportRepository {
  return new InMemoryBusinessPassportRepository();
}
