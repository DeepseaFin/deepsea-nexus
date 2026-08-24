import type { InstitutionalContact } from "@/lib/relationship/contact/InstitutionalContact";
import type {
  InstitutionalContactProjection,
  InstitutionalContactSummaryMetadataProjection,
} from "@/src/capabilities/relationship/projections/InstitutionalContactProjection";

function toSummaryMetadata(contact: InstitutionalContact): InstitutionalContactSummaryMetadataProjection {
  return {
    sourceSystem: contact.metadata.sourceSystem ?? "Unknown source",
    sourceReference: contact.metadata.sourceReference ?? "Unavailable reference",
    tags: contact.metadata.tags ?? [],
    attributeCount: Object.keys(contact.metadata.attributes ?? {}).length,
  };
}

export function getInstitutionalContactProjection(
  contact: InstitutionalContact,
): InstitutionalContactProjection {
  return {
    contactId: contact.contactId.toString(),
    relationshipId: contact.relationshipId.toString(),
    fullName: contact.fullName,
    designation: contact.designation,
    email: contact.email,
    phone: contact.phone,
    role: contact.role,
    status: contact.status,
    summaryMetadata: toSummaryMetadata(contact),
  };
}
