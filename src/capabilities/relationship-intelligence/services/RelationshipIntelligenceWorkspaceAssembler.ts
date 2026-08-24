import type { InstitutionalDigitalTwin } from "@/lib/runtime/InstitutionalDigitalTwin";
import type { BusinessContext } from "@/lib/workflows/WorkflowContext";
import type { InstitutionContext } from "@/lib/workspaces/InstitutionContext";
import type { InstitutionContextSummary } from "@/lib/workspaces/InstitutionContextSummary";
import { HealthIndicatorType } from "@/lib/institution/health/constants/HealthIndicatorType";
import {
  money,
  type EdgeType,
  type EntityNode,
  type NodeType,
  type RelationshipEdge,
  type RiskRating,
} from "@/components/atlas/relationship-intelligence/data";

type JourneyTimelineEntry = {
  readonly timestamp: string;
  readonly event: string;
  readonly performedBy: string;
  readonly notes: string;
};

export interface RelationshipIntelligenceWorkspaceInput {
  readonly runtime: InstitutionalDigitalTwin["authentication"];
  readonly digitalTwin: InstitutionalDigitalTwin;
  readonly institutionContext: InstitutionContext;
  readonly summary: InstitutionContextSummary;
  readonly businessContext?: BusinessContext;
  readonly timestamp: string;
}

export interface RelationshipIntelligenceWorkspaceState {
  readonly dataset: {
    readonly nodes: EntityNode[];
    readonly edges: RelationshipEdge[];
  };
  readonly status: string;
  readonly workspaceSummary: string;
  readonly timelineRows: readonly string[];
}

function normalizeCurrency(value: string | undefined): EntityNode["currency"] {
  if (value === "USD" || value === "SAR" || value === "QAR" || value === "AED") {
    return value;
  }

  return "AED";
}

function toLegalStatus(value: string | undefined): EntityNode["legalStatus"] {
  if (value === "Clear" || value === "Pending" || value === "Disputed") {
    return value;
  }

  return "Pending";
}

function toCollectionStatus(value: string | undefined): EntityNode["collectionStatus"] {
  if (value === "Current" || value === "Monitoring" || value === "Overdue") {
    return value;
  }

  return "Monitoring";
}

function toFundingStatus(value: string | undefined): EntityNode["fundingStatus"] {
  if (value === "Active" || value === "Scheduled" || value === "Paused") {
    return value;
  }

  return "Active";
}

function createNode(input: {
  readonly id: string;
  readonly name: string;
  readonly type: NodeType;
  readonly country: string;
  readonly industry: string;
  readonly riskRating: RiskRating;
  readonly exposure: number;
  readonly currency: EntityNode["currency"];
  readonly relationshipScore: number;
  readonly outstandingCollections: number;
  readonly facilities: number;
  readonly connectedDeals: number;
  readonly banks: number;
  readonly legalMatters: number;
  readonly documents: number;
  readonly legalStatus: EntityNode["legalStatus"];
  readonly collectionStatus: EntityNode["collectionStatus"];
  readonly fundingStatus: EntityNode["fundingStatus"];
  readonly recentActivity: string;
}): EntityNode {
  return {
    id: input.id,
    name: input.name,
    type: input.type,
    country: input.country,
    industry: input.industry,
    riskRating: input.riskRating,
    exposure: input.exposure,
    currency: input.currency,
    relationshipScore: input.relationshipScore,
    outstandingCollections: input.outstandingCollections,
    facilities: input.facilities,
    connectedDeals: input.connectedDeals,
    banks: input.banks,
    legalMatters: input.legalMatters,
    documents: input.documents,
    legalStatus: input.legalStatus,
    collectionStatus: input.collectionStatus,
    fundingStatus: input.fundingStatus,
    recentActivity: input.recentActivity,
  };
}

function createEdge(input: {
  readonly id: string;
  readonly from: string;
  readonly to: string;
  readonly type: EdgeType;
  readonly strength: number;
}): RelationshipEdge {
  return input;
}

function formatTimelineEntry(entry: JourneyTimelineEntry): string {
  return `${entry.timestamp.slice(0, 10)} · ${entry.event}`;
}

function buildActivityNodes(input: RelationshipIntelligenceWorkspaceInput, nodes: EntityNode[], edges: RelationshipEdge[]): void {
  const { institutionContext, summary } = input;
  const passport = institutionContext.passport;
  const journey = institutionContext.journey;
  const health = institutionContext.health;
  const intelligence = institutionContext.intelligence;
  const institution = institutionContext.institution;
  const country = passport?.profiles.identityProfile.country ?? institution.identity.jurisdiction ?? "UAE";
  const industry = passport?.profiles.identityProfile.industry ?? institution.profile.businessActivity ?? "Institutional";
  const currency = normalizeCurrency(
    passport?.profiles.financialProfile.verifiedRevenue?.currency
      ?? passport?.profiles.financialProfile.estimatedRevenue?.currency
      ?? passport?.profiles.financialProfile.workingCapital?.currency,
  );
  const baseExposure = passport?.profiles.financialProfile.receivables?.amount
    ?? passport?.profiles.financialProfile.workingCapital?.amount
    ?? Math.max(1_200_000, institutionContext.workflowStatus.completedStepCount * 850_000);
  const relationshipScore = Math.min(
    99,
    Math.max(
      52,
      Math.round((passport?.confidence.score ?? health?.overallScore ?? 76) * 0.92),
    ),
  );
  const riskRating = health?.overallStatus === "critical" || health?.overallStatus === "at_risk"
    ? "High"
    : intelligence?.overallRating === "critical" || passport?.status === "restricted"
      ? "High"
      : health?.overallStatus === "watch" || intelligence?.overallRating === "weak"
        ? "Medium"
        : "Low";

  const clientNode = createNode({
    id: `live-client-${institution.identity.institutionId}`,
    name: summary.institutionName,
    type: "Client",
    country,
    industry,
    riskRating,
    exposure: baseExposure,
    currency,
    relationshipScore,
    outstandingCollections: passport?.profiles.financialProfile.payables?.amount ?? Math.round(baseExposure * 0.12),
    facilities: passport?.profiles.financialProfile.fundingHistory?.length ?? 1,
    connectedDeals: journey?.completedSteps.length ?? summary.workflowProgress.length,
    banks: passport?.profiles.financialProfile.bankingRelationships?.length ?? 0,
    legalMatters: health?.indicators.filter((indicator) => indicator.status === "critical" || indicator.status === "at_risk").length ?? 0,
    documents: passport?.profiles.evidenceProfile.missingEvidenceItems?.length ?? 0,
    legalStatus: toLegalStatus(health?.overallStatus === "critical" ? "Disputed" : passport?.profiles.complianceProfile.sanctionsScreeningStatus === "screened" ? "Clear" : undefined),
    collectionStatus: toCollectionStatus(journey?.status === "completed" ? "Current" : journey?.status === "paused" ? "Monitoring" : "Monitoring"),
    fundingStatus: toFundingStatus(summary.readyForApproval ? "Active" : "Scheduled"),
    recentActivity: `${summary.workflowProgress} workflow progress · ${summary.healthStatus ?? "health pending"} health · ${summary.intelligenceRating ?? "intelligence pending"} intelligence`,
  });

  nodes.push(clientNode);

  const addRelationship = (node: EntityNode, edgeType: EdgeType, strength: number): void => {
    nodes.push(node);
    edges.push(createEdge({
      id: `edge-${clientNode.id}-${node.id}`,
      from: clientNode.id,
      to: node.id,
      type: edgeType,
      strength,
    }));
  };

  const profile = passport?.profiles;

  if (profile?.institutionProfile.parentCompany) {
    const parentNode = createNode({
      id: `parent-${institution.identity.institutionId}`,
      name: profile.institutionProfile.parentCompany,
      type: "Parent Company",
      country,
      industry,
      riskRating: "Medium",
      exposure: Math.round(baseExposure * 0.62),
      currency,
      relationshipScore: Math.max(70, relationshipScore - 4),
      outstandingCollections: 0,
      facilities: profile.institutionProfile.subsidiaries?.length ?? 0,
      connectedDeals: 2,
      banks: 1,
      legalMatters: 0,
      documents: 2,
      legalStatus: "Clear",
      collectionStatus: "Current",
      fundingStatus: "Active",
      recentActivity: `Parent company reference refreshed from ${summary.workflowProgress} workflow progress.`,
    });

    nodes.push(parentNode);
    edges.push(createEdge({ id: `edge-${parentNode.id}-${clientNode.id}`, from: parentNode.id, to: clientNode.id, type: "Owns", strength: 5 }));
  }

  profile?.institutionProfile.subsidiaries?.slice(0, 3).forEach((subsidiary, index) => {
    const subsidiaryNode = createNode({
      id: `subsidiary-${index}-${institution.identity.institutionId}`,
      name: subsidiary,
      type: "Subsidiary",
      country,
      industry,
      riskRating: index === 0 ? "Medium" : "Low",
      exposure: Math.round(baseExposure * (0.18 + index * 0.05)),
      currency,
      relationshipScore: Math.max(64, relationshipScore - 2 - index),
      outstandingCollections: 0,
      facilities: index + 1,
      connectedDeals: index + 1,
      banks: 1,
      legalMatters: 0,
      documents: 1,
      legalStatus: "Clear",
      collectionStatus: "Current",
      fundingStatus: "Active",
      recentActivity: `Live subsidiary link traced from institutional profile.`,
    });

    addRelationship(subsidiaryNode, "Owns", 3);
  });

  const ownerName = profile?.governanceProfile.owner ?? profile?.institutionProfile.institutionOwner;
  if (ownerName) {
    const shareholderNode = createNode({
      id: `shareholder-${institution.identity.institutionId}`,
      name: ownerName,
      type: "Shareholder",
      country,
      industry,
      riskRating: "Medium",
      exposure: Math.round(baseExposure * 0.28),
      currency,
      relationshipScore: Math.max(68, relationshipScore - 1),
      outstandingCollections: 0,
      facilities: 0,
      connectedDeals: 0,
      banks: 0,
      legalMatters: 0,
      documents: 1,
      legalStatus: "Clear",
      collectionStatus: "Current",
      fundingStatus: "Active",
      recentActivity: `Governance owner reflected in live runtime context.`,
    });

    addRelationship(shareholderNode, "Owns", 4);

    const uboNode = createNode({
      id: `ubo-${institution.identity.institutionId}`,
      name: profile?.institutionProfile.parentCompany ? `${profile.institutionProfile.parentCompany} UBO` : `${summary.institutionName} UBO`,
      type: "Ultimate Beneficial Owner",
      country,
      industry,
      riskRating: "Medium",
      exposure: Math.round(baseExposure * 0.21),
      currency,
      relationshipScore: Math.max(66, relationshipScore - 3),
      outstandingCollections: 0,
      facilities: 0,
      connectedDeals: 0,
      banks: 0,
      legalMatters: 0,
      documents: 1,
      legalStatus: "Clear",
      collectionStatus: "Current",
      fundingStatus: "Active",
      recentActivity: `UBO relationship inferred from ownership and governance controls.`,
    });

    nodes.push(uboNode);
    edges.push(createEdge({ id: `edge-${uboNode.id}-${shareholderNode.id}`, from: uboNode.id, to: shareholderNode.id, type: "Controls", strength: 4 }));
  }

  const directorName = profile?.governanceProfile.reviewer ?? profile?.relationshipProfile.relationshipOwner ?? input.digitalTwin.identity.identity.displayName ?? input.digitalTwin.identity.identity.email ?? "Live Director";
  const directorNode = createNode({
    id: `director-${institution.identity.institutionId}`,
    name: directorName,
    type: "Director",
    country,
    industry,
    riskRating: "Low",
    exposure: 0,
    currency,
    relationshipScore: Math.min(96, relationshipScore + 2),
    outstandingCollections: 0,
    facilities: 0,
    connectedDeals: 0,
    banks: 0,
    legalMatters: 0,
    documents: 1,
    legalStatus: "Clear",
    collectionStatus: "Current",
    fundingStatus: "Active",
    recentActivity: `Board review point captured at ${summary.assembledAt}.`,
  });
  addRelationship(directorNode, "Board Member", 4);

  profile?.financialProfile.bankingRelationships?.slice(0, 3).forEach((relationship, index) => {
    const bankNode = createNode({
      id: `bank-${index}-${relationship.institutionName.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`,
      name: relationship.institutionName,
      type: "Bank",
      country,
      industry: "Banking",
      riskRating: relationship.relationshipType === "primary" ? "Low" : "Medium",
      exposure: Math.round(baseExposure * (relationship.relationshipType === "primary" ? 0.55 : 0.24)),
      currency,
      relationshipScore: Math.max(72, relationshipScore - index * 3),
      outstandingCollections: 0,
      facilities: 1,
      connectedDeals: 1,
      banks: 0,
      legalMatters: 0,
      documents: 1,
      legalStatus: "Clear",
      collectionStatus: "Current",
      fundingStatus: "Active",
      recentActivity: `${relationship.relationshipType} banking relationship live since ${relationship.since}.`,
    });

    nodes.push(bankNode);
    edges.push(createEdge({ id: `edge-${clientNode.id}-${bankNode.id}`, from: clientNode.id, to: bankNode.id, type: relationship.relationshipType === "primary" ? "Funds" : "Finances", strength: relationship.relationshipType === "primary" ? 5 : 3 }));
  });

  const facilityNode = createNode({
    id: `facility-${institution.identity.institutionId}`,
    name: profile?.financialProfile.fundingNeed ?? summary.commercialStage ?? `Live facility ${summary.workflowProgress}`,
    type: "Facility",
    country,
    industry,
    riskRating: riskRating === "High" ? "High" : "Medium",
    exposure: Math.round(baseExposure * 0.8),
    currency,
    relationshipScore: Math.max(66, relationshipScore - 2),
    outstandingCollections: Math.round(baseExposure * 0.09),
    facilities: 1,
    connectedDeals: 1,
    banks: profile?.financialProfile.bankingRelationships?.length ?? 1,
    legalMatters: health?.indicators.length ?? 0,
    documents: 2,
    legalStatus: toLegalStatus(profile?.riskProfile.riskLevel === "high" ? "Pending" : undefined),
    collectionStatus: toCollectionStatus(journey?.status === "paused" ? "Monitoring" : undefined),
    fundingStatus: toFundingStatus(summary.readyForApproval ? "Active" : "Scheduled"),
    recentActivity: `Facility view aligned to ${summary.workflowProgress} and live workflow status.`,
  });
  addRelationship(facilityNode, "Assigns", 4);

  const collectionAccountNode = createNode({
    id: `collection-${institution.identity.institutionId}`,
    name: `${summary.institutionName} Collection Account`,
    type: "Collection Account",
    country,
    industry,
    riskRating: "Medium",
    exposure: Math.round(baseExposure * 0.21),
    currency,
    relationshipScore: Math.max(62, relationshipScore - 6),
    outstandingCollections: Math.round(baseExposure * 0.14),
    facilities: 0,
    connectedDeals: 1,
    banks: 1,
    legalMatters: 0,
    documents: 1,
    legalStatus: "Pending",
    collectionStatus: toCollectionStatus(journey?.status === "completed" ? "Current" : "Monitoring"),
    fundingStatus: "Active",
    recentActivity: `Collections state derived from ${summary.workflowProgress}.`,
  });
  addRelationship(collectionAccountNode, "Collects", 3);

  profile?.operationalProfile.branches?.slice(0, 2).forEach((branch, index) => {
    const branchNode = createNode({
      id: `branch-${index}-${institution.identity.institutionId}`,
      name: branch.city ? `${branch.city} Branch ${branch.branchCode}` : `Branch ${branch.branchCode}`,
      type: "Collection Agent",
      country: branch.country,
      industry,
      riskRating: "Low",
      exposure: Math.round(baseExposure * 0.09),
      currency,
      relationshipScore: Math.max(60, relationshipScore - 3),
      outstandingCollections: 0,
      facilities: 0,
      connectedDeals: 0,
      banks: 0,
      legalMatters: 0,
      documents: 1,
      legalStatus: "Clear",
      collectionStatus: "Current",
      fundingStatus: "Active",
      recentActivity: `Operational branch synced from live passport profile.`,
    });

    addRelationship(branchNode, "Collects", 2);
  });

  const evidenceItems = profile?.evidenceProfile.missingEvidenceItems ?? [];
  evidenceItems.slice(0, 3).forEach((item, index) => {
    const documentNode = createNode({
      id: `document-${index}-${institution.identity.institutionId}`,
      name: item,
      type: "Document",
      country,
      industry,
      riskRating: index === 0 ? "Medium" : "Low",
      exposure: Math.round(baseExposure * 0.05),
      currency,
      relationshipScore: Math.max(58, relationshipScore - index),
      outstandingCollections: 0,
      facilities: 0,
      connectedDeals: 0,
      banks: 0,
      legalMatters: 0,
      documents: 1,
      legalStatus: "Pending",
      collectionStatus: "Monitoring",
      fundingStatus: "Active",
      recentActivity: `Evidence requirement surfaced from the live passport record.`,
    });

    addRelationship(documentNode, "Assigns", 2);
  });

  const healthIndicators = health?.indicators ?? [];
  healthIndicators.slice(0, 5).forEach((indicator, index) => {
    const nodeType: NodeType = indicator.type === HealthIndicatorType.Compliance
      ? "Legal Case"
      : indicator.type === HealthIndicatorType.Relationship
        ? "Counterparty"
        : "Document";
    const healthNode = createNode({
      id: `health-${index}-${indicator.type}`,
      name: `${indicator.type} Health`,
      type: nodeType,
      country,
      industry,
      riskRating: indicator.status === "critical" || indicator.status === "at_risk" ? "High" : indicator.status === "watch" ? "Medium" : "Low",
      exposure: Math.round(baseExposure * (0.04 + index * 0.01)),
      currency,
      relationshipScore: Math.max(54, relationshipScore - index),
      outstandingCollections: 0,
      facilities: 0,
      connectedDeals: 0,
      banks: 0,
      legalMatters: indicator.status === "critical" || indicator.status === "at_risk" ? 1 : 0,
      documents: 1,
      legalStatus: indicator.status === "critical" || indicator.status === "at_risk" ? "Disputed" : "Clear",
      collectionStatus: indicator.status === "critical" ? "Overdue" : "Monitoring",
      fundingStatus: indicator.status === "critical" ? "Paused" : "Active",
      recentActivity: indicator.explanation,
    });

    addRelationship(healthNode, indicator.type === HealthIndicatorType.Relationship ? "Related Party" : "Reports To", 2);
  });

  const alerts = intelligence?.alerts ?? [];
  alerts.slice(0, 4).forEach((alert, index) => {
    const nodeType: NodeType = alert.severity === "critical" || alert.severity === "high" ? "Court Matter" : "Legal Case";
    const alertNode = createNode({
      id: `alert-${index}-${alert.sourceDomain}`,
      name: alert.title,
      type: nodeType,
      country,
      industry,
      riskRating: alert.severity === "critical" || alert.severity === "high" ? "High" : "Medium",
      exposure: Math.round(baseExposure * (0.06 + index * 0.01)),
      currency,
      relationshipScore: Math.max(50, relationshipScore - 8 - index),
      outstandingCollections: 0,
      facilities: 0,
      connectedDeals: 0,
      banks: 0,
      legalMatters: 1,
      documents: 1,
      legalStatus: alert.severity === "critical" || alert.severity === "high" ? "Disputed" : "Pending",
      collectionStatus: alert.severity === "critical" || alert.severity === "high" ? "Overdue" : "Monitoring",
      fundingStatus: alert.severity === "critical" || alert.severity === "high" ? "Paused" : "Active",
      recentActivity: alert.description,
    });

    addRelationship(alertNode, alert.severity === "critical" || alert.severity === "high" ? "Related Party" : "Reports To", 3);
  });

  const recommendations = intelligence?.recommendations ?? [];
  recommendations.slice(0, 4).forEach((recommendation, index) => {
    const nodeType: NodeType = recommendation.sourceDomain === "legal" ? "Legal Counsel" : recommendation.sourceDomain === "finance" ? "Facility" : recommendation.sourceDomain === "relationships" ? "Counterparty" : "Document";
    const recommendationNode = createNode({
      id: `recommendation-${index}-${recommendation.sourceDomain}`,
      name: recommendation.title,
      type: nodeType,
      country,
      industry,
      riskRating: recommendation.priority >= 4 ? "High" : "Medium",
      exposure: Math.round(baseExposure * (0.03 + index * 0.01)),
      currency,
      relationshipScore: Math.max(56, relationshipScore - index),
      outstandingCollections: 0,
      facilities: 0,
      connectedDeals: 0,
      banks: 0,
      legalMatters: recommendation.priority >= 4 ? 1 : 0,
      documents: 1,
      legalStatus: recommendation.priority >= 4 ? "Pending" : "Clear",
      collectionStatus: recommendation.priority >= 4 ? "Monitoring" : "Current",
      fundingStatus: recommendation.priority >= 4 ? "Scheduled" : "Active",
      recentActivity: recommendation.action,
    });

    addRelationship(recommendationNode, nodeType === "Legal Counsel" ? "Represents" : "Related Party", 2);
  });

  const timelineEvents = (journey?.timeline ?? []) as readonly JourneyTimelineEntry[];
  timelineEvents.slice(0, 5).forEach((event, index) => {
    const eventNode = createNode({
      id: `timeline-${index}-${institution.identity.institutionId}`,
      name: formatTimelineEntry(event),
      type: "Document",
      country,
      industry,
      riskRating: index === 0 ? "Low" : "Medium",
      exposure: Math.round(baseExposure * 0.02),
      currency,
      relationshipScore: Math.max(60, relationshipScore - index),
      outstandingCollections: 0,
      facilities: 0,
      connectedDeals: 0,
      banks: 0,
      legalMatters: 0,
      documents: 1,
      legalStatus: "Clear",
      collectionStatus: "Current",
      fundingStatus: "Active",
      recentActivity: event.notes,
    });

    addRelationship(eventNode, "Assigns", 1 + (index % 3));
  });

  const insights = intelligence?.keyInsights ?? [];
  insights.slice(0, 3).forEach((insight, index) => {
    const insightNode = createNode({
      id: `insight-${index}-${insight.sourceDomain}`,
      name: insight.title,
      type: "Document",
      country,
      industry,
      riskRating: insight.importance >= 80 ? "High" : "Medium",
      exposure: Math.round(baseExposure * (0.02 + index * 0.005)),
      currency,
      relationshipScore: Math.max(60, relationshipScore - index),
      outstandingCollections: 0,
      facilities: 0,
      connectedDeals: 0,
      banks: 0,
      legalMatters: 0,
      documents: 1,
      legalStatus: "Pending",
      collectionStatus: "Monitoring",
      fundingStatus: "Active",
      recentActivity: insight.summary,
    });

    addRelationship(insightNode, "Reports To", 2);
  });

  if (summary.workflowProgress) {
    const workflowNode = createNode({
      id: `workflow-${institution.identity.institutionId}`,
      name: `Workflow ${summary.workflowProgress}`,
      type: "SPV",
      country,
      industry,
      riskRating: summary.readyForApproval ? "Low" : "Medium",
      exposure: Math.round(baseExposure * 0.12),
      currency,
      relationshipScore: Math.max(64, relationshipScore - 1),
      outstandingCollections: 0,
      facilities: 0,
      connectedDeals: 1,
      banks: 0,
      legalMatters: 0,
      documents: 1,
      legalStatus: summary.readyForApproval ? "Clear" : "Pending",
      collectionStatus: "Current",
      fundingStatus: summary.readyForApproval ? "Active" : "Scheduled",
      recentActivity: `Workflow status captured live at ${input.timestamp}.`,
    });

    addRelationship(workflowNode, "Related Party", 2);
  }
}

export function createRelationshipIntelligenceWorkspaceState(
  input: RelationshipIntelligenceWorkspaceInput,
): RelationshipIntelligenceWorkspaceState {
  const nodes: EntityNode[] = [];
  const edges: RelationshipEdge[] = [];

  buildActivityNodes(input, nodes, edges);

  const statusParts = [
    input.summary.institutionName,
    input.summary.jurisdiction,
    `passport ${input.summary.passportStatus ?? "unavailable"}`,
    `journey ${input.summary.journeyStatus ?? "unavailable"}`,
    `health ${input.summary.healthStatus ?? "unavailable"}`,
    `intelligence ${input.summary.intelligenceRating ?? "unavailable"}`,
  ];

  const workspaceSummary = `Live relationship explorer for ${statusParts.join(" · ")}`;
  const totalExposure = nodes.reduce((sum, node) => sum + node.exposure, 0);
  const bankCount = nodes.filter((node) => node.type === "Bank").length;
  const legalCount = nodes.filter((node) => node.type === "Legal Case" || node.type === "Court Matter").length;
  const connectedCountries = new Set(nodes.map((node) => node.country)).size;
  const approvalText = input.summary.readyForApproval ? "approval-ready" : "under review";
  const status = `${input.summary.institutionName} live graph assembled from ${input.summary.workflowProgress} workflow progress, ${nodes.length} entities, ${edges.length} relationships, ${approvalText} context, and ${input.summary.intelligenceRating ?? "live runtime"} intelligence.`;

  const timelineRows = (() => {
    const rows: string[] = [];
    const passport = input.institutionContext.passport;
    const journey = input.institutionContext.journey;
    const health = input.institutionContext.health;
    const intelligence = input.institutionContext.intelligence;

    rows.push(`Workflow progress: ${input.summary.workflowProgress}`);
    rows.push(`Institution: ${input.summary.institutionName} in ${input.summary.jurisdiction}`);
    rows.push(`Passport status: ${input.summary.passportStatus ?? "unavailable"}`);
    rows.push(`Journey status: ${input.summary.journeyStatus ?? "unavailable"}`);
    rows.push(`Health status: ${input.summary.healthStatus ?? "unavailable"}`);
    rows.push(`Intelligence rating: ${input.summary.intelligenceRating ?? "unavailable"}`);

    if (passport?.profiles.timelineProfile.currentLifecycleStep) {
      rows.push(`Lifecycle step: ${passport.profiles.timelineProfile.currentLifecycleStep}`);
    }

    if (passport?.profiles.timelineProfile.nextLifecycleStep) {
      rows.push(`Next step: ${passport.profiles.timelineProfile.nextLifecycleStep}`);
    }
    journey?.timeline.slice(0, 2).forEach((event) => rows.push(formatTimelineEntry(event)));
    health?.indicators.slice(0, 2).forEach((indicator) => rows.push(indicator.explanation));
    intelligence?.alerts.slice(0, 2).forEach((alert) => rows.push(alert.title));
    intelligence?.recommendations.slice(0, 2).forEach((recommendation) => rows.push(recommendation.action));

    return rows.slice(0, 10);
  })();

  const summaryText = `Live network spans ${nodes.length} entities across ${connectedCountries} countries with ${bankCount} banks, ${legalCount} legal matters, and ${money(totalExposure)} total exposure.`;

  return {
    dataset: {
      nodes,
      edges,
    },
    status,
    workspaceSummary: workspaceSummary + ` · ${summaryText}`,
    timelineRows,
  };
}