import type { BusinessPassportSummary } from "@/src/capabilities/institution-wizard/types/BusinessPassportSummary";
import type { PassportTimeline } from "@/src/capabilities/institution-wizard/types/PassportTimeline";
import type { PassportTimelineItem } from "@/src/capabilities/institution-wizard/types/PassportTimelineItem";

function buildTimestamp(offsetHours: number): string {
  const value = new Date(Date.UTC(2026, 6, 14, 9 + offsetHours, 0, 0));
  return value.toISOString();
}

export class PassportTimelineBuilder {
  static build(passport: BusinessPassportSummary): PassportTimeline {
    const items: readonly PassportTimelineItem[] = [
      {
        timestamp: buildTimestamp(0),
        event: "Trade License Uploaded",
        detail: passport.supportingDocuments[0] ?? "Trade license placeholder document uploaded.",
      },
      {
        timestamp: buildTimestamp(1),
        event: "Knowledge Generated",
        detail: `Placeholder institutional knowledge created for ${passport.institution}.`,
      },
      {
        timestamp: buildTimestamp(2),
        event: "Business Passport Generated",
        detail: `Passport summary prepared with ${passport.confidence}% confidence.`,
      },
      {
        timestamp: buildTimestamp(3),
        event: "Business Passport Created",
        detail: `Readiness marked as ${passport.businessReadiness.level}.`,
      },
      {
        timestamp: buildTimestamp(4),
        event: "Journey Generated",
        detail: passport.nextAction,
      },
    ];

    return { items };
  }
}