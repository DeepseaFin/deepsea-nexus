import { BusinessPassportEventType } from "@/lib/business-passport/events/BusinessPassportEventType";
import {
  createInProcessEventRuntime,
  createInProcessEventRuntimePublisher,
  type InProcessEventRuntime,
} from "@/lib/business-passport/events/InProcessEventRuntime";
import type { EventEnvelope } from "@/lib/business-passport/events/EventEnvelope";
import type { BusinessPassport } from "@/lib/business-passport/domain/BusinessPassport";
import type { KnowledgeProjectionResult } from "@/lib/business-passport/projections/KnowledgeProjectionResult";
import type { ProjectionContext } from "@/lib/business-passport/projections/ProjectionContext";
import { knowledgeIdentityProjector } from "@/lib/business-passport/projections/KnowledgeIdentityProjector";
import {
  createInProcessProjectionRuntime,
  type InProcessProjectionRuntime,
} from "@/lib/business-passport/projections/InProcessProjectionRuntime";
import type { ProjectionDefinition } from "@/lib/business-passport/projections/ProjectionDefinition";
import {
  createInMemoryBusinessPassportRepository,
} from "@/lib/business-passport/repositories/InMemoryBusinessPassportRepository";
import type { BusinessPassportRepository } from "@/lib/business-passport/repositories/BusinessPassportRepository";
import {
  createBusinessPassportApplicationService,
} from "@/lib/business-passport/services/BusinessPassportApplicationService";
import type {
  BusinessPassportService,
  CreateBusinessPassportInput,
} from "@/lib/business-passport/services/BusinessPassportService";
import type { PassportId } from "@/lib/business-passport/value-objects/PassportId";
import { PassportId as PassportIdValueObject } from "@/lib/business-passport/value-objects/PassportId";
import type { KnowledgeCollection } from "@/lib/knowledge/domain/KnowledgeCollection";
import {
  createInProcessIntegrationPipeline,
} from "@/lib/platform/integration/InProcessIntegrationPipeline";

const KNOWLEDGE_IDENTITY_PROJECTION: ProjectionDefinition = {
  projectionName: "knowledge_identity_projection",
  description: "Applies knowledge facts to the Business Passport identity profile.",
  supportedEvents: [
    BusinessPassportEventType.BusinessDiscovered,
    BusinessPassportEventType.BusinessRegistered,
    BusinessPassportEventType.ProfileValidated,
    BusinessPassportEventType.ProfileCompleted,
    BusinessPassportEventType.PassportVerified,
    BusinessPassportEventType.PassportPublished,
    BusinessPassportEventType.PassportArchived,
  ],
  dependencies: [],
  produces: ["BusinessPassport.identityProfile"],
};

function toProjectionTriggeringEvent(event: EventEnvelope<string, unknown>): EventEnvelope<string, Record<string, unknown>> {
  return {
    ...event,
    payload: (event.payload ?? {}) as Record<string, unknown>,
  };
}

function toPassportIdFromEvent(event: EventEnvelope<string, unknown>): PassportId | null {
  if (!event.payload || typeof event.payload !== "object") {
    return null;
  }

  const payload = event.payload as Record<string, unknown>;
  const rawPassportId = payload.passportId;

  if (typeof rawPassportId !== "string") {
    return null;
  }

  try {
    return PassportIdValueObject.fromString(rawPassportId);
  } catch {
    return null;
  }
}

function toProjectionContext(event: EventEnvelope<string, unknown>): ProjectionContext | null {
  const passportId = toPassportIdFromEvent(event);
  if (!passportId) {
    return null;
  }

  return {
    passportId,
    triggeringEvent: toProjectionTriggeringEvent(event),
    projectionTimestamp: event.metadata.timestamp,
    requestedBy: event.metadata.actor,
    projectionReason: `event-runtime:${event.type}`,
  };
}

async function defaultKnowledgeCollectionLoader(): Promise<KnowledgeCollection> {
  return { facts: [] };
}

export interface BusinessPassportIntegrationPipelineDependencies {
  readonly repository?: BusinessPassportRepository;
  readonly eventRuntime?: InProcessEventRuntime<string>;
  readonly projectionRuntime?: InProcessProjectionRuntime<ProjectionContext>;
  readonly loadKnowledgeCollection?: (input: {
    readonly passport: BusinessPassport;
    readonly context: ProjectionContext;
  }) => Promise<KnowledgeCollection>;
  readonly onKnowledgeProjectionApplied?: (result: KnowledgeProjectionResult) => void;
}

export interface BusinessPassportIntegrationPipeline {
  readonly service: BusinessPassportService;
  readonly repository: BusinessPassportRepository;
  readonly eventRuntime: InProcessEventRuntime<string>;
  readonly projectionRuntime: InProcessProjectionRuntime<ProjectionContext>;
  create(input: CreateBusinessPassportInput): Promise<BusinessPassport>;
  get(passportId: PassportId): Promise<BusinessPassport | null>;
}

export function createBusinessPassportIntegrationPipeline(
  dependencies: BusinessPassportIntegrationPipelineDependencies = {},
): BusinessPassportIntegrationPipeline {
  const repository = dependencies.repository ?? createInMemoryBusinessPassportRepository();
  const eventRuntime = dependencies.eventRuntime ?? createInProcessEventRuntime<string>();
  const projectionRuntime = dependencies.projectionRuntime ?? createInProcessProjectionRuntime<ProjectionContext>();
  const loadKnowledgeCollection = dependencies.loadKnowledgeCollection ?? defaultKnowledgeCollectionLoader;

  projectionRuntime.registerProjection(KNOWLEDGE_IDENTITY_PROJECTION, async (context) => {
    const passport = await repository.findById(context.passportId);
    if (!passport) {
      return;
    }

    const knowledgeCollection = await loadKnowledgeCollection({ passport, context });
    const result = knowledgeIdentityProjector.project(knowledgeCollection, passport);
    await repository.save(result.updatedPassport);
    dependencies.onKnowledgeProjectionApplied?.(result);
  });

  const service = createBusinessPassportApplicationService({
    repository,
    eventPublisher: createInProcessEventRuntimePublisher(eventRuntime),
  });

  const platformPipeline = createInProcessIntegrationPipeline<
    CreateBusinessPassportInput,
    BusinessPassport,
    PassportId,
    string,
    EventEnvelope<string, unknown>,
    ProjectionContext
  >({
    operation: {
      execute(input) {
        return service.create(input);
      },
      get(passportId) {
        return service.get(passportId);
      },
    },
    repository,
    eventRuntime,
    projectionExecutor: {
      project(context) {
        return projectionRuntime.project(context);
      },
    },
    eventToProjection: {
      supportedEventTypes: KNOWLEDGE_IDENTITY_PROJECTION.supportedEvents,
      toProjectionContext,
    },
  });

  return {
    service,
    repository,
    eventRuntime,
    projectionRuntime,

    // End-to-end flow: application service create -> repository save ->
    // event publication -> event runtime -> projection runtime -> knowledge projection.
    async create(input: CreateBusinessPassportInput): Promise<BusinessPassport> {
      return platformPipeline.execute(input);
    },

    async get(passportId: PassportId): Promise<BusinessPassport | null> {
      return platformPipeline.get(passportId);
    },
  };
}
