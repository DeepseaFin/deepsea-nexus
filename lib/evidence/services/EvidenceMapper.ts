import { EvidenceSource } from "@/lib/evidence/constants/EvidenceSource";
import { EvidenceStatus } from "@/lib/evidence/constants/EvidenceStatus";
import { EvidenceType } from "@/lib/evidence/constants/EvidenceType";
import type { EvidenceMetadata } from "@/lib/evidence/domain/EvidenceMetadata";

export interface OracleDocumentEvidenceInput {
  readonly documentId: string;
  readonly documentCode: string;
  readonly mimeType: string;
  readonly checksum: string;
  readonly uploadedAt: string;
  readonly uploadedBy: string;
}

export interface EvidenceMappingResult {
  readonly evidenceId: string;
  readonly evidenceType: EvidenceType;
  readonly status: EvidenceStatus;
  readonly source: EvidenceSource;
  readonly metadata: EvidenceMetadata;
}

const ORACLE_SOURCE_SYSTEM = "oracle_document_upload";
const DEFAULT_RETENTION_POLICY = "institutional_default";

export interface EvidenceMapper {
  mapOracleDocument(input: OracleDocumentEvidenceInput): EvidenceMappingResult;
}

export const evidenceMapper: EvidenceMapper = {
  mapOracleDocument(input: OracleDocumentEvidenceInput): EvidenceMappingResult {
    return {
      evidenceId: input.documentId,
      evidenceType: EvidenceType.CorporateDocument,
      status: EvidenceStatus.Captured,
      source: EvidenceSource.ClientUpload,
      metadata: {
        documentId: input.documentId,
        documentVersion: input.documentCode,
        uploadedBy: input.uploadedBy,
        uploadedAt: input.uploadedAt,
        mimeType: input.mimeType,
        checksum: input.checksum,
        sourceSystem: ORACLE_SOURCE_SYSTEM,
        retentionPolicy: DEFAULT_RETENTION_POLICY,
      },
    };
  },
};