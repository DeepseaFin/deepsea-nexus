import type { RelationshipId } from "@/lib/relationship/RelationshipId";
import type { InstitutionalContactId } from "@/lib/relationship/contact/InstitutionalContactId";
import type { InstitutionalContactMetadata } from "@/lib/relationship/contact/InstitutionalContactMetadata";
import type { InstitutionalContactRole } from "@/lib/relationship/contact/InstitutionalContactRole";
import type { InstitutionalContactStatus } from "@/lib/relationship/contact/InstitutionalContactStatus";

export interface InstitutionalContact {
  readonly contactId: InstitutionalContactId;
  readonly relationshipId: RelationshipId;
  readonly fullName: string;
  readonly designation: string;
  readonly email: string;
  readonly phone: string;
  readonly role: InstitutionalContactRole;
  readonly status: InstitutionalContactStatus;
  readonly metadata: InstitutionalContactMetadata;
}
