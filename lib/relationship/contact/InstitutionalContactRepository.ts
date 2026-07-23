import type { RelationshipId } from "@/lib/relationship/RelationshipId";
import type { InstitutionalContact } from "@/lib/relationship/contact/InstitutionalContact";
import type { InstitutionalContactId } from "@/lib/relationship/contact/InstitutionalContactId";

export interface InstitutionalContactRepository {
  findById(contactId: InstitutionalContactId): Promise<InstitutionalContact | null>;
  save(contact: InstitutionalContact): Promise<void>;
  listByRelationshipId(relationshipId: RelationshipId): Promise<readonly InstitutionalContact[]>;
}
