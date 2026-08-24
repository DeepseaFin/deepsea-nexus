import type { Relationship } from "@/lib/relationship/Relationship";
import type { InstitutionalContact } from "@/lib/relationship/contact/InstitutionalContact";
import type { RelationshipInteraction } from "@/lib/relationship/interaction/RelationshipInteraction";
import { getInstitutionalContactProjection } from "@/src/capabilities/relationship/adapters/getInstitutionalContactProjection";
import { getRelationshipInteractionProjection } from "@/src/capabilities/relationship/adapters/getRelationshipInteractionProjection";
import { getRelationshipProjection } from "@/src/capabilities/relationship/adapters/getRelationshipProjection";
import type { RelationshipWorkspaceProjection } from "@/src/capabilities/relationship/projections/RelationshipWorkspaceProjection";

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object") {
    return value;
  }

  const properties = Object.getOwnPropertyNames(value);

  for (const property of properties) {
    const propertyValue = (value as Record<string, unknown>)[property];

    if (propertyValue !== null && (typeof propertyValue === "object" || typeof propertyValue === "function")) {
      deepFreeze(propertyValue);
    }
  }

  return Object.freeze(value);
}

export function getRelationshipWorkspaceProjection(input: {
  readonly relationship: Relationship;
  readonly contacts: readonly InstitutionalContact[];
  readonly interactions: readonly RelationshipInteraction[];
}): RelationshipWorkspaceProjection {
  return deepFreeze({
    relationship: getRelationshipProjection(input.relationship),
    contacts: input.contacts.map((contact) => getInstitutionalContactProjection(contact)),
    interactions: input.interactions.map((interaction) => getRelationshipInteractionProjection(interaction)),
  });
}
