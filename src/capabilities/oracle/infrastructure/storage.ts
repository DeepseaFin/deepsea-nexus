import { getSupabaseClient } from '@/lib/supabase/client';

const DOCUMENTS_BUCKET = 'documents';

export type UploadDocumentMetadata = {
	clientId?: string;
	documentType?: string;
	folder?: string;
	tags?: string[];
	requestedBy?: string;
};

export type UploadDocumentResult = {
	bucket: string;
	path: string;
	storagePath: string;
	publicUrl: string;
};

export type OracleStorageErrorCode =
	| 'MISSING_SUPABASE_CONFIG'
	| 'INVALID_FILE'
	| 'UPLOAD_FAILED'
	| 'UNKNOWN_ERROR';

export class OracleStorageError extends Error {
	public readonly code: OracleStorageErrorCode;
	public readonly status?: number;
	public readonly causeData?: unknown;

	constructor(code: OracleStorageErrorCode, message: string, options?: { status?: number; causeData?: unknown }) {
		super(message);
		this.name = 'OracleStorageError';
		this.code = code;
		this.status = options?.status;
		this.causeData = options?.causeData;
	}
}

function getSupabaseConfig() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!url || !anonKey) {
		throw new OracleStorageError(
			'MISSING_SUPABASE_CONFIG',
			'Missing Supabase configuration. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.',
		);
	}

	return { url, anonKey };
}

function sanitizeSegment(value: string): string {
	return value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9-_]+/g, '-')
		.replace(/-{2,}/g, '-')
		.replace(/^-+|-+$/g, '');
}

function extensionOf(fileName: string): string {
	const parts = fileName.split('.');
	if (parts.length < 2) return 'bin';
	return sanitizeSegment(parts[parts.length - 1]) || 'bin';
}

function buildDocumentPath(file: File, metadata: UploadDocumentMetadata): string {
	const now = new Date();
	const year = String(now.getUTCFullYear());
	const month = String(now.getUTCMonth() + 1).padStart(2, '0');
	const baseFolder = sanitizeSegment(metadata.folder ?? 'general') || 'general';
	const clientFolder = sanitizeSegment(metadata.clientId ?? 'unassigned') || 'unassigned';
	const typeFolder = sanitizeSegment(metadata.documentType ?? 'document') || 'document';
	const originalBase = file.name.includes('.') ? file.name.slice(0, file.name.lastIndexOf('.')) : file.name;
	const safeBase = sanitizeSegment(originalBase) || 'document';
	const ext = extensionOf(file.name);
	const unique = crypto.randomUUID();

	return `${baseFolder}/${clientFolder}/${typeFolder}/${year}/${month}/${safeBase}-${unique}.${ext}`;
}

function encodeObjectPath(path: string): string {
	return path
		.split('/')
		.filter(Boolean)
		.map((segment) => encodeURIComponent(segment))
		.join('/');
}

export async function uploadDocument(file: File, metadata: UploadDocumentMetadata = {}): Promise<UploadDocumentResult> {
	if (!(file instanceof File) || file.size <= 0) {
		throw new OracleStorageError('INVALID_FILE', 'A valid non-empty file is required for upload.');
	}

	const { url } = getSupabaseConfig();
	const path = buildDocumentPath(file, metadata);
	const encodedPath = encodeObjectPath(path);
	const supabase = getSupabaseClient();

	let uploadError: unknown;
	try {
		const { error } = await supabase.storage.from(DOCUMENTS_BUCKET).upload(path, file, {
			cacheControl: '3600',
			upsert: false,
			contentType: file.type || 'application/octet-stream',
		});

		uploadError = error;
	} catch (causeData) {
		throw new OracleStorageError('UNKNOWN_ERROR', 'Upload request failed before reaching storage.', { causeData });
	}

	if (uploadError) {
		const maybeStatus =
			typeof uploadError === 'object' && uploadError !== null && 'statusCode' in uploadError
				? Number((uploadError as { statusCode?: number }).statusCode)
				: undefined;

		throw new OracleStorageError('UPLOAD_FAILED', 'Supabase Storage rejected the upload.', {
			status: maybeStatus,
			causeData: uploadError,
		});
	}

	const publicUrl = `${url}/storage/v1/object/public/${DOCUMENTS_BUCKET}/${encodedPath}`;

	return {
		bucket: DOCUMENTS_BUCKET,
		path,
		storagePath: `${DOCUMENTS_BUCKET}/${path}`,
		publicUrl,
	};
}
