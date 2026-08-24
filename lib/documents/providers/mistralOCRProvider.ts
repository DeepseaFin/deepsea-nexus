import { getSupabaseClient } from '@/lib/supabase/client';
import type { OCRProvider, OCRResult } from '@/lib/documents/ocrProvider';

/**
 * Mistral OCR provider for ORACLE.
 *
 * This implementation keeps ORACLE isolated from vendor-specific OCR details
 * while integrating with the Mistral OCR API through a stable internal
 * contract. Callers continue to provide only storage bucket and storage path.
 */
export class MistralOCRProvider implements OCRProvider {
  private readonly apiUrl = 'https://api.mistral.ai/v1/ocr';

  async extract(storageBucket: string, storagePath: string): Promise<OCRResult> {
    const apiKey = process.env.NEXT_PUBLIC_MISTRAL_API_KEY ?? process.env.MISTRAL_API_KEY;

    if (!apiKey) {
      throw new Error('Mistral OCR API key is missing. Set NEXT_PUBLIC_MISTRAL_API_KEY or MISTRAL_API_KEY.');
    }

    const supabase = getSupabaseClient();
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(storageBucket)
      .createSignedUrl(storagePath, 300);

    if (signedUrlError) {
      throw new Error(`Failed to create signed URL for OCR: ${signedUrlError.message}`);
    }

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral-ocr-latest',
        document: {
          type: 'document_url',
          document_url: signedUrlData.signedUrl,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read OCR error response.');
      throw new Error(`Mistral OCR request failed (${response.status}): ${errorText}`);
    }

    const payload = (await response.json()) as {
      text?: string;
      pages?: Array<{ text?: string; markdown?: string }>;
      confidence?: number;
      metadata?: Record<string, unknown>;
    };

    const text =
      payload.text ??
      payload.pages?.map((page) => page.text ?? page.markdown ?? '').join('\n\n').trim() ??
      '';

    if (!text) {
      throw new Error('Mistral OCR response did not include any extracted text.');
    }

    const pages = payload.pages?.length ?? 1;
    const confidence = typeof payload.confidence === 'number' ? payload.confidence : 100;

    return {
      text,
      confidence,
      pages,
      metadata: {
        provider: 'Mistral',
        model: 'mistral-ocr-latest',
        sourceBucket: storageBucket,
        sourcePath: storagePath,
        ...(payload.metadata ?? {}),
      },
    };
  }
}
