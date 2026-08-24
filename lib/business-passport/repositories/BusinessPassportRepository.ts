import type { PassportLifecycle } from "@/lib/business-passport/constants/PassportLifecycle";
import type { PassportStatus } from "@/lib/business-passport/constants/PassportStatus";
import type { BusinessPassport } from "@/lib/business-passport/domain/BusinessPassport";
import type { PassportId } from "@/lib/business-passport/value-objects/PassportId";
import type { Repository } from "@/lib/platform/contracts/Repository";

export interface BusinessPassportRepository extends Repository<BusinessPassport, PassportId> {
  findById(passportId: PassportId): Promise<BusinessPassport | null>;
  save(passport: BusinessPassport): Promise<void>;
  listByStatus(status: PassportStatus): Promise<readonly BusinessPassport[]>;
  listByLifecycle(lifecycle: PassportLifecycle): Promise<readonly BusinessPassport[]>;
}
