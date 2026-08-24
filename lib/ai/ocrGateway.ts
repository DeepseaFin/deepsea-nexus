import { getSupabaseServerClient } from '@/lib/supabase/server';
import type { OCRResult } from '@/lib/documents/ocrProvider';

/**
 * Server-side OCR gateway for ORACLE.
 *
 * This class is the single integration point for Mistral OCR and future OCR
 * vendors, keeping the rest of the platform isolated from provider-specific
 * request and response formats.
 */
export class OCRGateway {
  private readonly apiUrl = 'https://api.mistral.ai/v1/ocr';

  private async resolveDocumentUrl(documentUrl: string): Promise<string> {
    if (documentUrl.startsWith('supabase://')) {
      const remainder = documentUrl.slice('supabase://'.length);
      const slashIndex = remainder.indexOf('/');

      if (slashIndex <= 0 || slashIndex === remainder.length - 1) {
        throw new Error('Invalid document URL provided to OCR gateway.');
      }

      const storageBucket = remainder.slice(0, slashIndex);
      const storagePath = remainder.slice(slashIndex + 1);
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase.storage.from(storageBucket).createSignedUrl(storagePath, 300);

      if (error) {
        throw new Error(`Failed to create signed URL for OCR: ${error.message}`);
      }

      return data.signedUrl;
    }

    return documentUrl;
  }

  async processDocument(documentUrl: string): Promise<OCRResult> {
    const apiKey = process.env.MISTRAL_API_KEY;

    if (!apiKey) {
      throw new Error('Missing MISTRAL_API_KEY. OCR gateway cannot process documents without it.');
    }

    if (typeof documentUrl !== 'string' || documentUrl.trim().length === 0) {
      throw new Error('Invalid document URL provided to OCR gateway.');
    }

    const resolvedDocumentUrl = await this.resolveDocumentUrl(documentUrl);

    let response: Response;

    try {
      response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral-ocr-latest',
          document: {
            type: 'document_url',
            document_url: resolvedDocumentUrl,
          },
        }),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown network failure.';
      throw new Error(`Mistral OCR network failure: ${message}`);
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read error body.');
      throw new Error(`Mistral OCR request failed with status ${response.status}: ${errorText}`);
    }

    let payload: unknown;

    try {
      payload = await response.json();
    } catch {
      throw new Error('Invalid OCR response: Mistral returned a non-JSON payload.');
    }

    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid OCR response: expected an object payload from Mistral.');
    }

    const typedPayload = payload as {
      text?: unknown;
      pages?: Array<{ text?: unknown; markdown?: unknown }>;
      confidence?: unknown;
      model?: unknown;
      metadata?: Record<string, unknown>;
    };

    const pageSegments = Array.isArray(typedPayload.pages)
      ? typedPayload.pages
          .map((page) => {
            if (!page || typeof page !== 'object') {
              return '';
            }

            if (typeof page.text === 'string') {
              return page.text;
            }

            if (typeof page.markdown === 'string') {
              return page.markdown;
            }

            return '';
          })
          .filter((segment) => segment.trim().length > 0)
      : [];

    const text =
      typeof typedPayload.text === 'string'
        ? typedPayload.text
        : pageSegments.join('\n\n').trim();

    if (text.length === 0) {
      throw new Error('Invalid OCR response: extracted text was empty or missing.');
    }

    const confidence = typeof typedPayload.confidence === 'number' ? typedPayload.confidence : 100;
    const pages = pageSegments.length > 0 ? pageSegments.length : 1;

    return {
      text,
      confidence,
      pages,
      metadata: {
        provider: 'Mistral',
        model: typeof typedPayload.model === 'string' ? typedPayload.model : 'mistral-ocr-latest',
        source: 'ocr-gateway',
        documentUrl,
        resolvedDocumentUrl,
        ...(typedPayload.metadata ?? {}),
      },
    };
  }
}
