import type { BusinessPassportProjection } from "@/lib/business-passport/projections/BusinessPassportProjection";
import type { PassportId } from "@/lib/business-passport/value-objects/PassportId";
import type { PresentationAdapter } from "@/lib/presentation/PresentationAdapter";
import type { PresentationContext } from "@/lib/presentation/PresentationContext";
import type { PresentationResult } from "@/lib/presentation/PresentationResult";
import type { PresentationViewModel } from "@/lib/presentation/PresentationViewModel";
import type { PresentationMetadata } from "@/lib/presentation/types/PresentationMetadata";
import type { PresentationSection } from "@/lib/presentation/types/PresentationSection";

export interface BusinessPassportPresentationField {
  readonly label: string;
  readonly value: string;
}

export interface BusinessPassportPresentationViewModel
  extends PresentationViewModel<BusinessPassportPresentationField> {
  readonly title: string;
  readonly subtitle: string;
  readonly payload: {
    readonly projection: BusinessPassportProjection;
  };
}

function isBusinessPassportProjection(projection: unknown): projection is BusinessPassportProjection {
  if (typeof projection !== "object" || projection === null) {
    return false;
  }

  const candidate = projection as Record<string, unknown>;
  const passportId = candidate.passportId as PassportId | string | undefined;

  return (
    (typeof passportId === "string" || (typeof passportId === "object" && passportId !== null)) &&
    typeof candidate.status === "string" &&
    typeof candidate.lifecycle === "string" &&
    typeof candidate.confidenceScore === "number" &&
    typeof candidate.knowledgeDensityBand === "string" &&
    typeof candidate.institutionalPulseState === "string" &&
    typeof candidate.maturityLevel === "string" &&
    typeof candidate.updatedAt === "string"
  );
}

function stringifyPassportId(passportId: PassportId | string): string {
  return typeof passportId === "string" ? passportId : passportId.toString();
}

function buildPresentationMetadata(context: PresentationContext): PresentationMetadata {
  return {
    adapterId: "presentation.business-passport.presenter",
    capability: "business-passport",
    projectionType: "BusinessPassportProjection",
    schemaVersion: "1.0.0",
    tags: ["business-passport", "customer-workspace"],
    attributes: {
      ...context.metadata,
      locale: context.locale,
      timezone: context.timezone,
      correlationId: context.correlationId,
      traceId: context.traceId,
      requestedAt: context.requestedAt,
    },
  };
}

function buildFields(projection: BusinessPassportProjection): readonly BusinessPassportPresentationField[] {
  return [
    { label: "Passport ID", value: stringifyPassportId(projection.passportId) },
    { label: "Status", value: projection.status },
    { label: "Lifecycle", value: projection.lifecycle },
    { label: "Confidence Score", value: String(projection.confidenceScore) },
    { label: "Knowledge Density", value: projection.knowledgeDensityBand },
    { label: "Institutional Pulse", value: projection.institutionalPulseState },
    { label: "Maturity", value: projection.maturityLevel },
    { label: "Updated At", value: projection.updatedAt },
  ];
}

function buildSections(
  projection: BusinessPassportProjection,
): readonly PresentationSection<BusinessPassportPresentationField>[] {
  return [
    {
      id: "passport-summary",
      title: "Passport Summary",
      description: "Direct presentation of the current Business Passport projection.",
      items: buildFields(projection),
    },
    {
      id: "passport-projection",
      title: "Projection Payload",
      description: "Canonical projection values carried through without additional logic.",
      items: buildFields(projection),
    },
  ];
}

export const businessPassportPresenter: PresentationAdapter<
  BusinessPassportProjection,
  BusinessPassportPresentationViewModel
> = {
  id: "presentation.business-passport.presenter",
  capability: "business-passport",
  projectionType: "BusinessPassportProjection",
  canAdapt: (projection: unknown): projection is BusinessPassportProjection =>
    isBusinessPassportProjection(projection),
  adapt: (
    projection: BusinessPassportProjection,
    context: PresentationContext,
  ): PresentationResult<BusinessPassportPresentationViewModel> => {
    if (!isBusinessPassportProjection(projection)) {
      return {
        ok: false,
        reason: "Invalid Business Passport projection.",
      };
    }

    return {
      ok: true,
      viewModel: {
        id: `business-passport:${projection.passportId}`,
        title: "Business Passport",
        subtitle: "Presentation layer view model derived from the canonical projection.",
        metadata: buildPresentationMetadata(context),
        sections: buildSections(projection),
        payload: {
          projection,
        },
      },
    };
  },
};
