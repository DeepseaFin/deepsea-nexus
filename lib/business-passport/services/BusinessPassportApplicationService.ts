import { PassportLifecycle } from "@/lib/business-passport/constants/PassportLifecycle";
import { PassportStatus } from "@/lib/business-passport/constants/PassportStatus";
import { businessPassportEventFactory } from "@/lib/business-passport/events/BusinessPassportEventFactory";
import { BusinessPassportEventType } from "@/lib/business-passport/events/BusinessPassportEventType";
import { DEFAULT_EVENT_VERSION, type EventVersion } from "@/lib/business-passport/events/EventVersion";
import type { EventEnvelope } from "@/lib/business-passport/events/EventEnvelope";
import type { EventMetadata } from "@/lib/business-passport/events/EventMetadata";
import type {
  BusinessPassport,
} from "@/lib/business-passport/domain/BusinessPassport";
import type {
  BusinessPassportRepository,
} from "@/lib/business-passport/repositories/BusinessPassportRepository";
import {
  businessPassportProfileService,
  type BusinessPassportProfileService,
} from "@/lib/business-passport/services/BusinessPassportProfileService";
import type {
  BusinessPassportService,
  CreateBusinessPassportInput,
} from "@/lib/business-passport/services/BusinessPassportService";
import type { ProjectionContext } from "@/lib/business-passport/projections/ProjectionContext";
import type {
  BusinessPassportProjectionService,
} from "@/lib/business-passport/projections/BusinessPassportProjectionService";
import type { PassportId } from "@/lib/business-passport/value-objects/PassportId";

export interface BusinessPassportEventPublisher {
  publish(event: EventEnvelope<string, unknown>): Promise<void>;
}

export interface BusinessPassportApplicationServiceDependencies {
  readonly repository: BusinessPassportRepository;
  readonly profileService?: BusinessPassportProfileService;
  readonly projectionService?: BusinessPassportProjectionService;
  readonly eventPublisher?: BusinessPassportEventPublisher;
}

function createMetadata(input: {
  readonly actor: string;
  readonly source: string;
  readonly correlationId: string;
  readonly occurredAt: string;
  readonly eventIdSuffix: string;
}): EventMetadata {
  return {
    eventId: `${input.correlationId}:${input.eventIdSuffix}`,
    timestamp: input.occurredAt,
    correlationId: input.correlationId,
    causationId: input.correlationId,
    source: input.source,
    actor: input.actor,
  };
}

function toProjectionContext(input: {
  readonly passportId: PassportId;
  readonly triggeringEvent: EventEnvelope<string, Record<string, unknown>>;
  readonly actor: string;
  readonly projectionReason: string;
  readonly projectionTimestamp: string;
}): ProjectionContext {
  return {
    passportId: input.passportId,
    triggeringEvent: input.triggeringEvent,
    projectionTimestamp: input.projectionTimestamp,
    requestedBy: input.actor,
    projectionReason: input.projectionReason,
  };
}

function toProjectionTriggeringEvent(
  event: EventEnvelope<string, unknown>,
): EventEnvelope<string, Record<string, unknown>> {
  return {
    ...event,
    payload: (event.payload ?? {}) as Record<string, unknown>,
  };
}

function toCreateEventVersion(): EventVersion {
  return DEFAULT_EVENT_VERSION;
}

function toStatusEventType(status: PassportStatus): BusinessPassportEventType | undefined {
  if (status === PassportStatus.UnderReview) {
    return BusinessPassportEventType.PassportVerified;
  }

  if (status === PassportStatus.Active) {
    return BusinessPassportEventType.PassportPublished;
  }

  if (status === PassportStatus.Archived) {
    return BusinessPassportEventType.PassportArchived;
  }

  return undefined;
}

function assertProfileValidation(profileResults: ReturnType<BusinessPassportProfileService["validateProfiles"]>): void {
  const allValid = profileResults.identity.isValid
    && profileResults.institution.isValid
    && profileResults.financial.isValid
    && profileResults.operational.isValid
    && profileResults.governance.isValid;

  if (!allValid) {
    throw new Error("Business Passport profile validation failed.");
  }
}

export class DefaultBusinessPassportApplicationService implements BusinessPassportService {
  private readonly repository: BusinessPassportRepository;

  private readonly profileService: BusinessPassportProfileService;

  private readonly projectionService?: BusinessPassportProjectionService;

  private readonly eventPublisher?: BusinessPassportEventPublisher;

  constructor(dependencies: BusinessPassportApplicationServiceDependencies) {
    this.repository = dependencies.repository;
    this.profileService = dependencies.profileService ?? businessPassportProfileService;
    this.projectionService = dependencies.projectionService;
    this.eventPublisher = dependencies.eventPublisher;
  }

  async create(input: CreateBusinessPassportInput): Promise<BusinessPassport> {
    const validatedAt = input.metadata.audit.updatedAt;
    const validations = this.profileService.validateProfiles({
      identityProfile: input.profiles.identityProfile,
      institutionProfile: input.profiles.institutionProfile,
      financialProfile: input.profiles.financialProfile,
      operationalProfile: input.profiles.operationalProfile,
      governanceProfile: input.profiles.governanceProfile,
    }, validatedAt);

    assertProfileValidation(validations);

    // Orchestration decision: create uses existing contracts and defaults status/lifecycle
    // because the create input contract does not currently carry these two fields.
    const passport: BusinessPassport = {
      passportId: input.passportId,
      status: PassportStatus.Draft,
      lifecycle: PassportLifecycle.Onboarding,
      confidence: input.confidence,
      knowledgeDensity: input.knowledgeDensity,
      institutionalPulse: input.institutionalPulse,
      maturity: input.maturity,
      metadata: input.metadata,
      governance: input.governance,
      profiles: input.profiles,
    };

    await this.repository.save(passport);

    const createdBy = input.metadata.audit.createdBy;
    const correlationId = input.metadata.lineage.sourceReferences[0] ?? input.passportId.toString();

    const discoveredEvent = businessPassportEventFactory.businessDiscovered(
      createMetadata({
        actor: createdBy,
        source: "BusinessPassportApplicationService",
        correlationId,
        occurredAt: input.metadata.audit.createdAt,
        eventIdSuffix: "business-discovered",
      }),
      {
        passportId: input.passportId.toString(),
        legalName: input.profiles.identityProfile.legalName ?? "Unknown Business",
      },
      {
        version: toCreateEventVersion(),
      },
    );

    const registeredEvent = businessPassportEventFactory.businessRegistered(
      createMetadata({
        actor: createdBy,
        source: "BusinessPassportApplicationService",
        correlationId,
        occurredAt: input.metadata.audit.createdAt,
        eventIdSuffix: "business-registered",
      }),
      {
        passportId: input.passportId.toString(),
        registrationNumber: input.profiles.identityProfile.registrationNumber ?? "unknown",
        jurisdiction: input.profiles.identityProfile.jurisdiction ?? "unknown",
      },
      {
        version: toCreateEventVersion(),
      },
    );

    if (this.eventPublisher) {
      await this.eventPublisher.publish(discoveredEvent);
      await this.eventPublisher.publish(registeredEvent);
    }

    if (this.projectionService) {
      // Orchestration decision: projection trigger is best-effort and uses event context
      // so downstream projection implementations can stay isolated from service internals.
      this.projectionService.project(toProjectionContext({
        passportId: input.passportId,
        triggeringEvent: toProjectionTriggeringEvent(registeredEvent),
        actor: createdBy,
        projectionReason: "business-passport-created",
        projectionTimestamp: input.metadata.audit.updatedAt,
      }));
    }

    return passport;
  }

  async get(passportId: PassportId): Promise<BusinessPassport | null> {
    return this.repository.findById(passportId);
  }

  async updateStatus(
    passportId: PassportId,
    status: PassportStatus,
    updatedBy: string,
  ): Promise<BusinessPassport> {
    const existing = await this.repository.findById(passportId);

    if (!existing) {
      throw new Error(`Business Passport ${passportId.toString()} was not found.`);
    }

    const updatedPassport: BusinessPassport = {
      ...existing,
      status,
      metadata: {
        ...existing.metadata,
        audit: {
          ...existing.metadata.audit,
          updatedBy,
          updatedAt: new Date().toISOString(),
        },
      },
    };

    await this.repository.save(updatedPassport);

    const statusEventType = toStatusEventType(status);
    let triggeredEvent: EventEnvelope<string, unknown> | undefined;

    if (statusEventType === BusinessPassportEventType.PassportVerified) {
      triggeredEvent = businessPassportEventFactory.passportVerified(
        createMetadata({
          actor: updatedBy,
          source: "BusinessPassportApplicationService",
          correlationId: passportId.toString(),
          occurredAt: updatedPassport.metadata.audit.updatedAt,
          eventIdSuffix: "passport-verified",
        }),
        {
          passportId: passportId.toString(),
          verifiedBy: updatedBy,
        },
      );
    } else if (statusEventType === BusinessPassportEventType.PassportPublished) {
      triggeredEvent = businessPassportEventFactory.passportPublished(
        createMetadata({
          actor: updatedBy,
          source: "BusinessPassportApplicationService",
          correlationId: passportId.toString(),
          occurredAt: updatedPassport.metadata.audit.updatedAt,
          eventIdSuffix: "passport-published",
        }),
        {
          passportId: passportId.toString(),
          publishedBy: updatedBy,
        },
      );
    } else if (statusEventType === BusinessPassportEventType.PassportArchived) {
      triggeredEvent = businessPassportEventFactory.passportArchived(
        createMetadata({
          actor: updatedBy,
          source: "BusinessPassportApplicationService",
          correlationId: passportId.toString(),
          occurredAt: updatedPassport.metadata.audit.updatedAt,
          eventIdSuffix: "passport-archived",
        }),
        {
          passportId: passportId.toString(),
          archivedBy: updatedBy,
          reason: "status-update",
        },
      );
    }

    if (triggeredEvent && this.eventPublisher) {
      await this.eventPublisher.publish(triggeredEvent);
    }

    if (triggeredEvent && this.projectionService) {
      this.projectionService.project(toProjectionContext({
        passportId,
        triggeringEvent: toProjectionTriggeringEvent(triggeredEvent),
        actor: updatedBy,
        projectionReason: `business-passport-status-updated:${status}`,
        projectionTimestamp: updatedPassport.metadata.audit.updatedAt,
      }));
    }

    return updatedPassport;
  }
}

export function createBusinessPassportApplicationService(
  dependencies: BusinessPassportApplicationServiceDependencies,
): BusinessPassportService {
  return new DefaultBusinessPassportApplicationService(dependencies);
}
