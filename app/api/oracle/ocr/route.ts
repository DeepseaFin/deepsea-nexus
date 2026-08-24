import { NextResponse } from 'next/server';
import { OCRGateway } from '@/lib/ai/ocrGateway';

type OcrRequestBody = {
  storageBucket?: string;
  storagePath?: string;
};

export async function POST(request: Request): Promise<NextResponse> {
  let body: OcrRequestBody;

  try {
    body = (await request.json()) as OcrRequestBody;
  } catch {
    return NextResponse.json(
      {
        error: 'Invalid JSON body.',
      },
      { status: 400 },
    );
  }

  const { storageBucket, storagePath } = body;

  if (typeof storageBucket !== 'string' || storageBucket.trim().length === 0) {
    return NextResponse.json(
      {
        error: 'storageBucket is required.',
      },
      { status: 400 },
    );
  }

  if (typeof storagePath !== 'string' || storagePath.trim().length === 0) {
    return NextResponse.json(
      {
        error: 'storagePath is required.',
      },
      { status: 400 },
    );
  }

  const gateway = new OCRGateway();
  const documentUrl = `supabase://${storageBucket}/${storagePath}`;
  const ocrResult = await gateway.processDocument(documentUrl);

  return NextResponse.json(ocrResult);
}
