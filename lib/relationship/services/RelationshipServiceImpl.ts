import type { Relationship } from "@/lib/relationship/Relationship";
import type { RelationshipRepository } from "@/lib/relationship/RelationshipRepository";
import type {
  CreateRelationshipInput,
  RelationshipService,
} from "@/lib/relationship/RelationshipService";
import type { RelationshipId } from "@/lib/relationship/RelationshipId";
import {
  assertCreateRelationshipInputOrThrow,
  assertInstitutionRelationshipScopeOrThrow,
  assertRelationshipIdOrThrow,
} from "@/lib/relationship/services/RelationshipLifecyclePolicy";

export interface RelationshipServiceDependencies {
  readonly repository: RelationshipRepository;
}

function toRelationship(input: CreateRelationshipInput): Relationship {
  return {
    relationshipId: input.relationshipId,
    institutionId: input.institutionId,
    relationshipName: input.relationshipName,
    status: input.status,
    stage: input.stage,
    owner: input.owner,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
    metadata: input.metadata,
  };
}

export function createRelationshipService(
  dependencies: RelationshipServiceDependencies,
): RelationshipService {
  return {
    async create(input: CreateRelationshipInput): Promise<Relationship> {
      const validatedInput = assertCreateRelationshipInputOrThrow(input);
      const relationship = toRelationship(validatedInput);

      await dependencies.repository.save(relationship);

      return relationship;
    },

    async get(relationshipId: RelationshipId): Promise<Relationship | null> {
      const normalizedRelationshipId = assertRelationshipIdOrThrow(relationshipId);
      return dependencies.repository.findById(normalizedRelationshipId);
    },

    async listByInstitutionId(institutionId: string): Promise<readonly Relationship[]> {
      const normalizedInstitutionId = assertInstitutionRelationshipScopeOrThrow(institutionId);
      return dependencies.repository.listByInstitutionId(normalizedInstitutionId);
    },
  };
}