import { EventCategory } from "@/lib/business-passport/events/EventCategory";
import type { EventEnvelope } from "@/lib/business-passport/events/EventEnvelope";
import type { EventMetadata } from "@/lib/business-passport/events/EventMetadata";
import { BusinessPassportEventType } from "@/lib/business-passport/events/BusinessPassportEventType";
import { DEFAULT_EVENT_VERSION, type EventVersion } from "@/lib/business-passport/events/EventVersion";
import type { Confidence } from "@/lib/business-passport/types/Confidence";
import type { EvidenceReference } from "@/lib/business-passport/types/EvidenceReference";

interface EnvelopeOptions {
  readonly version?: EventVersion;
  readonly confidence?: Confidence;
  readonly evidenceReferences?: readonly EvidenceReference[];
}

export interface BusinessDiscoveredPayload {
  readonly passportId: string;
  readonly legalName: string;
}

export interface BusinessRegisteredPayload {
  readonly passportId: string;
  readonly registrationNumber: string;
  readonly jurisdiction: string;
}

export interface ProfileValidatedPayload {
  readonly passportId: string;
  readonly profileCode: string;
  readonly valid: boolean;
}

export interface ProfileCompletedPayload {
  readonly passportId: string;
  readonly profileCode: string;
  readonly completionPercentage: number;
}

export interface PassportVerifiedPayload {
  readonly passportId: string;
  readonly verifiedBy: string;
}

export interface PassportPublishedPayload {
  readonly passportId: string;
  readonly publishedBy: string;
}

export interface PassportArchivedPayload {
  readonly passportId: string;
  readonly archivedBy: string;
  readonly reason: string;
}

export type BusinessPassportEventPayloadMap = {
  [BusinessPassportEventType.BusinessDiscovered]: BusinessDiscoveredPayload;
  [BusinessPassportEventType.BusinessRegistered]: BusinessRegisteredPayload;
  [BusinessPassportEventType.ProfileValidated]: ProfileValidatedPayload;
  [BusinessPassportEventType.ProfileCompleted]: ProfileCompletedPayload;
  [BusinessPassportEventType.PassportVerified]: PassportVerifiedPayload;
  [BusinessPassportEventType.PassportPublished]: PassportPublishedPayload;
  [BusinessPassportEventType.PassportArchived]: PassportArchivedPayload;
};

export type BusinessPassportEventEnvelope<TType extends BusinessPassportEventType> = EventEnvelope<
  TType,
  BusinessPassportEventPayloadMap[TType]
>;

function envelopeFor<TType extends BusinessPassportEventType>(
  type: TType,
  metadata: EventMetadata,
  payload: BusinessPassportEventPayloadMap[TType],
  options?: EnvelopeOptions,
): BusinessPassportEventEnvelope<TType> {
  return {
    metadata,
    category: EventCategory.BUSINESS,
    type,
    payload,
    version: options?.version ?? DEFAULT_EVENT_VERSION,
    confidence: options?.confidence,
    evidenceReferences: options?.evidenceReferences,
  };
}

export const businessPassportEventFactory = {
  businessDiscovered(
    metadata: EventMetadata,
    payload: BusinessDiscoveredPayload,
    options?: EnvelopeOptions,
  ): BusinessPassportEventEnvelope<BusinessPassportEventType.BusinessDiscovered> {
    return envelopeFor(BusinessPassportEventType.BusinessDiscovered, metadata, payload, options);
  },

  businessRegistered(
    metadata: EventMetadata,
    payload: BusinessRegisteredPayload,
    options?: EnvelopeOptions,
  ): BusinessPassportEventEnvelope<BusinessPassportEventType.BusinessRegistered> {
    return envelopeFor(BusinessPassportEventType.BusinessRegistered, metadata, payload, options);
  },

  profileValidated(
    metadata: EventMetadata,
    payload: ProfileValidatedPayload,
    options?: EnvelopeOptions,
  ): BusinessPassportEventEnvelope<BusinessPassportEventType.ProfileValidated> {
    return envelopeFor(BusinessPassportEventType.ProfileValidated, metadata, payload, options);
  },

  profileCompleted(
    metadata: EventMetadata,
    payload: ProfileCompletedPayload,
    options?: EnvelopeOptions,
  ): BusinessPassportEventEnvelope<BusinessPassportEventType.ProfileCompleted> {
    return envelopeFor(BusinessPassportEventType.ProfileCompleted, metadata, payload, options);
  },

  passportVerified(
    metadata: EventMetadata,
    payload: PassportVerifiedPayload,
    options?: EnvelopeOptions,
  ): BusinessPassportEventEnvelope<BusinessPassportEventType.PassportVerified> {
    return envelopeFor(BusinessPassportEventType.PassportVerified, metadata, payload, options);
  },

  passportPublished(
    metadata: EventMetadata,
    payload: PassportPublishedPayload,
    options?: EnvelopeOptions,
  ): BusinessPassportEventEnvelope<BusinessPassportEventType.PassportPublished> {
    return envelopeFor(BusinessPassportEventType.PassportPublished, metadata, payload, options);
  },

  passportArchived(
    metadata: EventMetadata,
    payload: PassportArchivedPayload,
    options?: EnvelopeOptions,
  ): BusinessPassportEventEnvelope<BusinessPassportEventType.PassportArchived> {
    return envelopeFor(BusinessPassportEventType.PassportArchived, metadata, payload, options);
  },
} as const;
