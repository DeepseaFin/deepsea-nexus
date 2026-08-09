'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FileArchive,
  FileText,
  HardDriveUpload,
  Image as ImageIcon,
  ShieldCheck,
  Table2,
  X,
} from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';
import { DocumentType, classifyDocument } from '@/atlas-core/engines/DocumentClassifier';
import { formatDateTime } from '@/lib/utils/formatters';

type UploadStage = 'uploading' | 'uploaded';

type IntelligenceStatus = 'Pending' | 'Processing' | 'Ready';

export interface UploadedFileView {
	id: string;
	name: string;
	size: string;
	rawSize?: number;
	uploadedAt: string;
	progress: number;
	stage: UploadStage;
	status: string;
	iconKey: string;
	documentType?: DocumentType;
	confidence?: number;
}

interface FileUploadSeed {
	id: string;
	name: string;
	size: string;
	rawSize: number;
	uploadedAt: string;
	progress: number;
	stage: UploadStage;
	status: string;
	iconKey: string;
	documentType: DocumentType;
	confidence: number;
}

interface UploadMetaCard {
	title: string;
	status: IntelligenceStatus;
	description: string;
	accent: 'emerald' | 'amber' | 'cyan';
}

interface DocumentUploadZoneProps {
	title?: string;
	subtitle?: string;
	className?: string;
	initialFiles?: UploadedFileView[];
	onFilesChange?: (files: UploadedFileView[]) => void;
}

const placeholderMetaCards: UploadMetaCard[] = [
	{
		title: 'OCR Processing',
		status: 'Pending',
		description: 'Reserved for future document text normalization.',
		accent: 'amber',
	},
	{
		title: 'AI Extraction',
		status: 'Pending',
		description: 'Reserved for structured clause and entity extraction.',
		accent: 'cyan',
	},
	{
		title: 'Validation',
		status: 'Pending',
		description: 'Reserved for document and policy validation steps.',
		accent: 'emerald',
	},
	{
		title: 'Intelligence Status',
		status: 'Pending',
		description: 'Reserved for pipeline readiness and orchestration state.',
		accent: 'cyan',
	},
];

const fileIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
	pdf: FileText,
	xlsx: Table2,
	xls: Table2,
	doc: FileText,
	docx: FileText,
	jpg: ImageIcon,
	jpeg: ImageIcon,
	png: ImageIcon,
	zip: FileArchive,
};

const accentClasses: Record<'emerald' | 'amber' | 'cyan', string> = {
	emerald: 'border-emerald-800/50 bg-emerald-950/20 text-emerald-200',
	amber: 'border-amber-800/50 bg-amber-950/20 text-amber-200',
	cyan: 'border-cyan-800/50 bg-cyan-950/20 text-cyan-200',
};

function formatFileSize(bytes: number): string {
	if (bytes === 0) {
		return '0 B';
	}

	const unit = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB'];
	const index = Math.floor(Math.log(bytes) / Math.log(unit));
	const value = bytes / Math.pow(unit, index);
	return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${sizes[index]}`;
}

function getFileIcon(fileName: string): React.ComponentType<{ className?: string }> {
	const extension = fileName.split('.').pop()?.toLowerCase() ?? 'pdf';
	return fileIconMap[extension] ?? FileText;
}

function toViewFile(file: File): FileUploadSeed {
	const classification = classifyDocument(file.name);

	return {
		id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
		name: file.name,
		size: formatFileSize(file.size),
		rawSize: file.size,
		uploadedAt: new Date().toISOString(),
		progress: 0,
		stage: 'uploading',
		status: 'Uploading',
		iconKey: file.name,
		documentType: classification.documentType,
		confidence: classification.confidence,
	};
}

/**
 * Premium upload surface for ATLAS document intake.
 *
 * This is UI-only and uses local placeholder state for upload progress.
 */
export default function DocumentUploadZone({
	title = 'Document Upload Zone',
	subtitle = 'Drag and drop files or click to upload documents for the deal.',
	className = '',
	initialFiles = [],
	onFilesChange,
}: DocumentUploadZoneProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState<UploadedFileView[]>(initialFiles);
	const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const timersRef = useRef<number[]>([]);

	useEffect(() => {
		onFilesChange?.(uploadedFiles);
	}, [onFilesChange, uploadedFiles]);

	useEffect(() => {
		const timerIds = timersRef.current;
		return () => {
			timerIds.forEach((timerId) => window.clearInterval(timerId));
		};
	}, []);

	const totalProgress = useMemo(() => {
		if (uploadedFiles.length === 0) {
			return 0;
		}

		return Math.round(
			uploadedFiles.reduce((sum, file) => sum + file.progress, 0) / uploadedFiles.length,
		);
	}, [uploadedFiles]);

	const handleFiles = (files: FileList | null) => {
		if (!files || files.length === 0) {
			return;
		}

		const nextFiles = Array.from(files).map((file) => {
			const view = toViewFile(file);
			return {
				id: view.id,
				name: view.name,
				size: view.size,
				rawSize: view.rawSize,
				uploadedAt: view.uploadedAt,
				progress: 0,
				stage: 'uploading' as const,
				status: 'Uploading',
				iconKey: view.iconKey,
				documentType: view.documentType,
				confidence: view.confidence,
			};
		});

		const uniqueNextFiles = nextFiles.filter((candidate) => {
			const isDuplicate = uploadedFiles.some((existingFile) => {
				const sameName = existingFile.name.toLowerCase() === candidate.name.toLowerCase();
				const sameSize = (existingFile.rawSize ?? existingFile.size) === candidate.rawSize;

				return sameName && sameSize;
			});

			return !isDuplicate;
		});

		if (uniqueNextFiles.length !== nextFiles.length) {
			setDuplicateWarning('Duplicate document detected');
			// Future: support duplicate resolution actions such as Replace, Keep Both, and Cancel.
		} else {
			setDuplicateWarning(null);
		}

		if (uniqueNextFiles.length === 0) {
			return;
		}

		setUploadedFiles((current) => [...uniqueNextFiles, ...current]);

		uniqueNextFiles.forEach((file) => {
			let progress = 10;
			const timerId = window.setInterval(() => {
				progress = Math.min(progress + 18, 100);

				setUploadedFiles((current) =>
					current.map((entry) =>
						entry.id === file.id
							? {
								...entry,
								progress,
								stage: progress >= 100 ? 'uploaded' : 'uploading',
								status: progress >= 100 ? 'Uploaded' : 'Uploading',
							  }
							: entry,
					),
				);

				if (progress >= 100) {
					window.clearInterval(timerId);
				}
			}, 220);

			timersRef.current.push(timerId);
		});
	};

	const openFilePicker = () => {
		inputRef.current?.click();
	};

	return (
		<div className={`space-y-6 ${className}`}>
			<div className="rounded-3xl border border-slate-800 bg-slate-950/95 p-4 shadow-2xl sm:p-6">
				<div className="mb-5 flex items-start justify-between gap-4">
					<div>
						<p className="text-xs uppercase tracking-[0.18em] text-cyan-300/70">ATLAS Intake</p>
						<h2 className="mt-2 text-xl font-semibold text-slate-100 sm:text-2xl">{title}</h2>
						<p className="mt-1 text-sm text-slate-400">{subtitle}</p>
					</div>
					<div className="hidden items-center gap-2 rounded-full border border-emerald-800/50 bg-emerald-950/20 px-3 py-1 text-xs font-semibold text-emerald-200 sm:flex">
						<ShieldCheck className="h-4 w-4" />
						Placeholder State Only
					</div>
				</div>

				<input
					ref={inputRef}
					type="file"
					multiple
					className="hidden"
					onChange={(event) => handleFiles(event.target.files)}
				/>

				<div
					onDragEnter={(event) => {
						event.preventDefault();
						setIsDragging(true);
					}}
					onDragOver={(event) => {
						event.preventDefault();
						setIsDragging(true);
					}}
					onDragLeave={(event) => {
						event.preventDefault();
						setIsDragging(false);
					}}
					onDrop={(event) => {
						event.preventDefault();
						setIsDragging(false);
						handleFiles(event.dataTransfer.files);
					}}
					onClick={openFilePicker}
					className={`group relative cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed p-6 transition-all sm:p-8 ${
						isDragging
							? 'border-cyan-500 bg-cyan-950/30 shadow-[0_0_0_1px_rgba(34,211,238,0.2)]'
							: 'border-slate-700 bg-slate-900/70 hover:border-cyan-800/70 hover:bg-slate-900'
					}`}
				>
					<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08),transparent_30%)]" />
					<div className="relative flex flex-col items-center text-center">
						<div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-800/50 bg-slate-900/80 shadow-lg shadow-cyan-950/20">
							<HardDriveUpload className="h-8 w-8 text-cyan-300" />
						</div>
						<h3 className="mt-4 text-lg font-semibold text-slate-100 sm:text-xl">
							Drag & Drop documents here
						</h3>
						<p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
							Drop files to begin placeholder intake, or click the panel to select multiple
							documents from your device.
						</p>
						<div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300">
							<span className="rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1">
								Multiple Files Supported
							</span>
							<span className="rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1">
								Click to Upload
							</span>
							<span className="rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1">
								No Backend Required
							</span>
						</div>
					</div>
				</div>

				<div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
					<div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
						<div className="flex items-center justify-between gap-3">
							<div>
								<p className="text-sm font-semibold text-slate-100">Uploaded Files</p>
								<p className="text-xs text-slate-500">{uploadedFiles.length} file(s) in placeholder queue</p>
							</div>
							<div className="rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1 text-xs text-slate-300">
								{totalProgress}% Avg. Progress
							</div>
						</div>

						{duplicateWarning && (
							<div className="mt-4 rounded-2xl border border-amber-700/50 bg-amber-950/20 p-3 text-sm text-amber-200">
								{duplicateWarning}
							</div>
						)}

						<div className="mt-4 space-y-3">
							{uploadedFiles.length === 0 ? (
								<div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5 text-sm text-slate-400">
									No files uploaded yet.
								</div>
							) : (
								uploadedFiles.map((file) => {
									const Icon = getFileIcon(file.iconKey);

									return (
										<div
											key={file.id}
											className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-[inset_0_1px_0_rgba(148,163,184,0.06)]"
										>
											<div className="flex items-start gap-3">
												<div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-cyan-300">
													<Icon className="h-5 w-5" />
												</div>

												<div className="min-w-0 flex-1">
													<div className="flex flex-wrap items-center justify-between gap-2">
														<p className="truncate text-sm font-semibold text-slate-100">{file.name}</p>
														<div className="flex items-center gap-2">
															<span className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-300">
																{file.status}
															</span>
															{(file.documentType ?? DocumentType.Unknown) === DocumentType.Unknown && (
																<span className="rounded-full border border-amber-700/60 bg-amber-950/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-200">
																	Unknown Type
																</span>
															)}
														</div>
													</div>

													<div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
														<span>Size: {file.size}</span>
														<span>Uploaded: {formatDateTime(file.uploadedAt)}</span>
													</div>

													<div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-300">
														<span>
															Detected Type: <span className="font-semibold text-slate-100">{file.documentType ?? DocumentType.Unknown}</span>
														</span>
														<span>
															Confidence: <span className="font-semibold text-slate-100">{file.confidence ?? 0}%</span>
														</span>
													</div>

													<div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
														<div
															className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-300 transition-all duration-300"
															style={{ width: `${file.progress}%` }}
														/>
													</div>

													<div className="mt-3 flex items-center justify-between text-xs text-slate-500">
														<span>{file.stage === 'uploaded' ? 'Upload complete' : 'Uploading placeholder progress'}</span>
														<span>{file.progress}%</span>
													</div>
												</div>
												<button
													type="button"
													onClick={(event) => {
														event.stopPropagation();
														setUploadedFiles((current) => current.filter((entry) => entry.id !== file.id));
													}}
													className="rounded-full p-1 text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-200"
												>
													<X className="h-4 w-4" />
												</button>
										</div>
									</div>
									);
								})
							)}
						</div>
					</div>

					<div className="space-y-4">
						{placeholderMetaCards.map((card) => (
							<div
								key={card.title}
								className={`rounded-2xl border p-4 ${accentClasses[card.accent]}`}
							>
								<div className="flex items-center justify-between gap-3">
									<p className="text-sm font-semibold">{card.title}</p>
									<span className="rounded-full border border-current/20 bg-black/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide">
										{card.status}
									</span>
								</div>
								<p className="mt-2 text-sm leading-relaxed text-slate-300/90">{card.description}</p>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{[
					{ label: 'Drag & Drop', value: 'Enabled' },
					{ label: 'Click to Upload', value: 'Enabled' },
					{ label: 'Multiple Files', value: 'Enabled' },
					{ label: 'Backend', value: 'None' },
				].map((item) => (
					<SectionCard
						key={item.label}
						title={item.label}
						iconKey="arrow-up-to-line"
						className="h-full"
					>
						<div className="space-y-2">
							<p className="text-2xl font-semibold text-slate-100">{item.value}</p>
							<p className="text-sm text-slate-400">ATLAS placeholder state only.</p>
						</div>
					</SectionCard>
				))}
			</div>
		</div>
	);
}