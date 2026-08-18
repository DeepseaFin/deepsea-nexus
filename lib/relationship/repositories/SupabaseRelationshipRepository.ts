import type { Relationship } from "@/lib/relationship/Relationship";
import { RelationshipId } from "@/lib/relationship/RelationshipId";
import type { RelationshipMetadata } from "@/lib/relationship/RelationshipMetadata";
import type { RelationshipOwner } from "@/lib/relationship/RelationshipOwner";
import type { RelationshipRepository } from "@/lib/relationship/RelationshipRepository";
import { RelationshipStage } from "@/lib/relationship/RelationshipStage";
import { RelationshipStatus } from "@/lib/relationship/RelationshipStatus";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type RelationshipRow = {
  relationship_id: string;
  institution_id: string;
  relationship_name: string;
  status: string;
  stage: string;
  owner: unknown;
  created_at: string;
  updated_at: string;
  metadata: unknown;
};

type JsonLikeRecord = Record<string, unknown>;

function isPlainObject(value: unknown): value is JsonLikeRecord {
  if (value === null || typeof value !== "object") {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function toRelationshipStatus(value: string): RelationshipStatus {
  if (Object.values(RelationshipStatus).includes(value as RelationshipStatus)) {
    return value as RelationshipStatus;
  }

  throw new Error(`Failed to map relationship row: unsupported status ${value}.`);
}

function toRelationshipStage(value: string): RelationshipStage {
  if (Object.values(RelationshipStage).includes(value as RelationshipStage)) {
    return value as RelationshipStage;
  }

  throw new Error(`Failed to map relationship row: unsupported stage ${value}.`);
}

function toRelationshipOwner(value: unknown): RelationshipOwner {
  if (!isPlainObject(value)) {
    throw new Error("Failed to map relationship row: owner must be an object.");
  }

  const { ownerId, displayName, role } = value;

  if (typeof ownerId !== "string" || typeof displayName !== "string" || typeof role !== "string") {
    throw new Error("Failed to map relationship row: owner shape is invalid.");
  }

  return {
    ownerId,
    displayName,
    role,
  };
}

function isMetadataAttributeValue(value: unknown): value is string | number | boolean {
  return (
    typeof value === "string"
    || typeof value === "number"
    || typeof value === "boolean"
  );
}

function toRelationshipMetadata(value: unknown): RelationshipMetadata {
  if (!isPlainObject(value)) {
    throw new Error("Failed to map relationship row: metadata must be an object.");
  }

  const metadata = value as Record<string, unknown>;

  if (metadata.sourceSystem !== undefined && typeof metadata.sourceSystem !== "string") {
    throw new Error("Failed to map relationship row: metadata.sourceSystem must be a string when provided.");
  }

  if (metadata.sourceReference !== undefined && typeof metadata.sourceReference !== "string") {
    throw new Error("Failed to map relationship row: metadata.sourceReference must be a string when provided.");
  }

  if (metadata.tags !== undefined) {
    if (!Array.isArray(metadata.tags) || metadata.tags.some((tag) => typeof tag !== "string")) {
      throw new Error("Failed to map relationship row: metadata.tags must be an array of strings when provided.");
    }
  }

  if (metadata.attributes !== undefined) {
    if (!isPlainObject(metadata.attributes)) {
      throw new Error("Failed to map relationship row: metadata.attributes must be an object when provided.");
    }

    for (const attributeValue of Object.values(metadata.attributes)) {
      if (!isMetadataAttributeValue(attributeValue)) {
        throw new Error(
          "Failed to map relationship row: metadata.attributes values must be string, number, or boolean.",
        );
      }
    }
  }

  return value as RelationshipMetadata;
}

function toRelationship(row: RelationshipRow): Relationship {
  return {
    relationshipId: RelationshipId.fromString(row.relationship_id),
    institutionId: row.institution_id,
    relationshipName: row.relationship_name,
    status: toRelationshipStatus(row.status),
    stage: toRelationshipStage(row.stage),
    owner: toRelationshipOwner(row.owner),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    metadata: toRelationshipMetadata(row.metadata),
  };
}

function toRelationshipRow(relationship: Relationship): RelationshipRow {
  return {
    relationship_id: relationship.relationshipId.toString(),
    institution_id: relationship.institutionId,
    relationship_name: relationship.relationshipName,
    status: relationship.status,
    stage: relationship.stage,
    owner: relationship.owner,
    created_at: relationship.createdAt,
    updated_at: relationship.updatedAt,
    metadata: relationship.metadata,
  };
}

class SupabaseRelationshipRepository implements RelationshipRepository {
  private readonly tableName = "relationships";

  async findById(relationshipId: RelationshipId): Promise<Relationship | null> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from(this.tableName)
      .select("relationship_id, institution_id, relationship_name, status, stage, owner, created_at, updated_at, metadata")
      .eq("relationship_id", relationshipId.toString())
      .maybeSingle<RelationshipRow>();

    if (error) {
      throw new Error(`Failed to load relationship: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return toRelationship(data);
  }

  async save(relationship: Relationship): Promise<void> {
    const supabase = getSupabaseServerClient();
    const payload = toRelationshipRow(relationship);

    const { error } = await supabase
      .from(this.tableName)
      .upsert(payload, { onConflict: "relationship_id" });

    if (error) {
      throw new Error(`Failed to persist relationship: ${error.message}`);
    }
  }

  async listByInstitutionId(institutionId: string): Promise<readonly Relationship[]> {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from(this.tableName)
      .select("relationship_id, institution_id, relationship_name, status, stage, owner, created_at, updated_at, metadata")
      .eq("institution_id", institutionId)
      .order("relationship_id", { ascending: true })
      .returns<RelationshipRow[]>();

    if (error) {
      throw new Error(`Failed to list relationships by institution: ${error.message}`);
    }

    return (data ?? []).map((row) => toRelationship(row));
  }
}

export function createSupabaseRelationshipRepository(): RelationshipRepository {
  return new SupabaseRelationshipRepository();
}
