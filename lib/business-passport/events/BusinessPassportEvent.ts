import type { PassportLifecycle } from "@/lib/business-passport/constants/PassportLifecycle";
import type { PassportStatus } from "@/lib/business-passport/constants/PassportStatus";
import type { Confidence } from "@/lib/business-passport/types/Confidence";
import type { PassportId } from "@/lib/business-passport/value-objects/PassportId";

export enum BusinessPassportEventType {
  PassportCreated = "passport_created",
  StatusUpdated = "status_updated",
  LifecycleUpdated = "lifecycle_updated",
  ProfileUpdated = "profile_updated",
  GovernanceUpdated = "governance_updated",
  ConfidenceUpdated = "confidence_updated",
}

export interface BusinessPassportEventPayload {
  readonly changedFields: readonly string[];
  readonly reason: string;
  readonly actor: string;
}

export interface BusinessPassportEvent {
  readonly eventId: string;
  readonly passportId: PassportId;
  readonly eventType: BusinessPassportEventType;
  readonly occurredAt: string;
  readonly status: PassportStatus;
  readonly lifecycle: PassportLifecycle;
  readonly confidence?: Confidence;
  readonly payload: BusinessPassportEventPayload;
}
