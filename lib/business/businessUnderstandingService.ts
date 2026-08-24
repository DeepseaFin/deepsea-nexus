import { DocumentClassificationService } from "@/lib/documents/documentClassificationService";
import { DocumentMetadataExtractionService } from "@/lib/documents/documentMetadataExtractionService";
import { DocumentPipeline } from "@/lib/documents/documentPipeline";
import { DocumentQueueService } from "@/lib/documents/documentQueueService";
import { createDocument } from "@/lib/documents/documentRepository";
import { DocumentWorker } from "@/lib/documents/documentWorker";
import { OpenAILLMProvider } from "@/lib/documents/providers/openAILLMProvider";
import { MistralOCRProvider } from "@/lib/documents/providers/mistralOCRProvider";
import { evidenceFactory } from "@/lib/evidence/services/EvidenceFactory";
import { getSupabaseClient } from "@/lib/supabase/client";

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ["pdf", "docx", "xlsx", "jpg", "jpeg", "png"] as const;

type AllowedExtension = (typeof ALLOWED_EXTENSIONS)[number];

export type BusinessUnderstandingResult = {
  companyName: string;
  documentType: string;
  jurisdiction: string;
  confidence: number;
  documentId: string;
  documentCode: string;
};

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[\\/]/g, "_");
}

function buildStoragePath(fileName: string): string {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const safeFileName = sanitizeFileName(fileName);
  const id = crypto.randomUUID();

  return `intake/${year}/${month}/${day}/${id}-${safeFileName}`;
}

async function computeChecksum(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  const bytes = new Uint8Array(digest);

  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function generateDocumentCode(): Promise<string> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("documents")
    .select("document_code")
    .order("document_code", { ascending: false })
    .limit(1)
    .maybeSingle<{ document_code: string }>();

  if (error) {
    throw new Error(`Failed to generate document code: ${error.message}`);
  }

  const currentValue = data?.document_code?.replace("DOC-", "") ?? "000000";
  const nextValue = Number.parseInt(currentValue, 10) + 1;

  return `DOC-${String(nextValue).padStart(6, "0")}`;
}

function validateFile(file: File): void {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (!ALLOWED_EXTENSIONS.includes(extension as AllowedExtension)) {
    throw new Error(`${file.name}: unsupported format. Allowed: PDF, DOCX, XLSX, JPG, PNG.`);
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`${file.name}: exceeds 50 MB limit.`);
  }
}

export class BusinessUnderstandingService {
  async analyze(file: File): Promise<BusinessUnderstandingResult> {
    validateFile(file);

    let storagePath: string | null = null;

    try {
      const supabase = getSupabaseClient();
      storagePath = buildStoragePath(file.name);
      const checksum = await computeChecksum(file);
      const { error } = await supabase.storage.from("documents").upload(storagePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || undefined,
      });

      if (error) {
        throw new Error(error.message);
      }

      const documentCode = await generateDocumentCode();
      const uploadedAt = new Date().toISOString();

      const createdDocument = await createDocument({
        document_code: documentCode,
        file_name: storagePath.split("/").pop() ?? file.name,
        original_file_name: file.name,
        storage_bucket: "documents",
        storage_path: storagePath,
        mime_type: file.type || "application/octet-stream",
        file_size: file.size,
        checksum,
        status: "UPLOADED",
        uploaded_at: uploadedAt,
        ocr_status: "PENDING",
        classification_status: "PENDING",
      });

      evidenceFactory.createFromOracleDocument({
        documentId: createdDocument.id,
        documentCode: createdDocument.document_code,
        mimeType: createdDocument.mime_type,
        checksum: createdDocument.checksum ?? checksum,
        uploadedAt: createdDocument.uploaded_at,
        uploadedBy: createdDocument.uploaded_by ?? "oracle_workflow",
      });

      const queue = new DocumentQueueService();
      const ocrProvider = new MistralOCRProvider();
      const llmProvider = new OpenAILLMProvider();
      const classificationService = new DocumentClassificationService(llmProvider);
      const metadataExtractionService = new DocumentMetadataExtractionService(llmProvider);
      const worker = new DocumentWorker(queue, ocrProvider, classificationService, metadataExtractionService);
      const documentPipeline = new DocumentPipeline(queue, worker);

      await queue.enqueue(createdDocument.id);
      await documentPipeline.run();

      const ocrResult = await ocrProvider.extract(createdDocument.storage_bucket, createdDocument.storage_path);
      const classification = await classificationService.classify(ocrResult.text);
      const metadata = await metadataExtractionService.extract(ocrResult.text);

      return {
        companyName: metadata.companyName,
        documentType: classification.documentType,
        jurisdiction: metadata.jurisdiction || "Not available",
        confidence: classification.confidence,
        documentId: createdDocument.id,
        documentCode: createdDocument.document_code,
      };
    } catch (error) {
      if (storagePath) {
        const supabase = getSupabaseClient();
        await supabase.storage.from("documents").remove([storagePath]);
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Business understanding analysis failed.");
    }
  }
}

export const businessUnderstandingService = new BusinessUnderstandingService();
