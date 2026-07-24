export type PresentationCapability =
  | "business-passport"
  | "documents"
  | "relationship"
  | "approval"
  | "funding"
  | "timeline"
  | "ai-insights";

export const PRESENTATION_CAPABILITIES: readonly PresentationCapability[] = [
  "business-passport",
  "documents",
  "relationship",
  "approval",
  "funding",
  "timeline",
  "ai-insights",
];

export interface PresentationContext {
  readonly capability: PresentationCapability;
  readonly locale?: string;
  readonly timezone?: string;
  readonly correlationId?: string;
  readonly traceId?: string;
  readonly requestedAt?: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}
