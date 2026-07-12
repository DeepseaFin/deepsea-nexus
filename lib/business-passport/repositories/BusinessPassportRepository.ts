import type { PassportLifecycle } from "@/lib/business-passport/constants/PassportLifecycle";
import type { PassportStatus } from "@/lib/business-passport/constants/PassportStatus";
import type { BusinessPassport } from "@/lib/business-passport/domain/BusinessPassport";
import type { PassportId } from "@/lib/business-passport/value-objects/PassportId";

export interface BusinessPassportRepository {
  findById(passportId: PassportId): Promise<BusinessPassport | null>;
  save(passport: BusinessPassport): Promise<void>;
  listByStatus(status: PassportStatus): Promise<readonly BusinessPassport[]>;
  listByLifecycle(lifecycle: PassportLifecycle): Promise<readonly BusinessPassport[]>;
}
