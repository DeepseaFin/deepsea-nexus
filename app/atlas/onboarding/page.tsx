import CustomerOnboardingWorkspace from "@/src/capabilities/onboarding/components/CustomerOnboardingWorkspace";
import type { CustomerOnboardingState } from "@/src/capabilities/onboarding/types/CustomerOnboardingState";

const ONBOARDING_STATE: CustomerOnboardingState = {
  onboardingId: "ONB-7724",
  customerName: "Al Noor Trading LLC",
  institutionName: "Deepsea Institutional Desk",
  initiatedAt: "2026-07-15",
  status: "in_progress",
  currentStepId: "evidence",
  steps: [
    {
      id: "institution_wizard",
      title: "Institution Wizard",
      description: "Capture institutional identity and governance baseline for onboarding.",
      owner: "Relationship Management",
      status: "completed",
    },
    {
      id: "oracle",
      title: "ORACLE Processing",
      description: "Process uploaded institution package into structured extraction outputs.",
      owner: "Document Intelligence",
      status: "completed",
    },
    {
      id: "evidence",
      title: "Evidence Validation",
      description: "Verify mandatory evidence set and confidence thresholds before knowledge assembly.",
      owner: "Operations Control",
      status: "in_progress",
    },
    {
      id: "knowledge",
      title: "Knowledge Generation",
      description: "Transform validated evidence into institutional knowledge collection.",
      owner: "Knowledge Team",
      status: "pending",
    },
    {
      id: "business_passport",
      title: "Business Passport",
      description: "Assemble business passport profile package from verified knowledge.",
      owner: "Passport Office",
      status: "pending",
    },
    {
      id: "journey",
      title: "Journey Activation",
      description: "Start institutional journey progression and operational checkpoints.",
      owner: "Journey Ops",
      status: "pending",
    },
    {
      id: "institution_health",
      title: "Institution Health",
      description: "Compute institutional health indicators and readiness dimensions.",
      owner: "Institution Health",
      status: "pending",
    },
    {
      id: "institution_intelligence",
      title: "Institution Intelligence",
      description: "Generate executive intelligence package for approval routing.",
      owner: "Institution Intelligence",
      status: "pending",
    },
  ],
  timeline: [
    {
      id: "TL-1",
      timestamp: "2026-07-15T08:10:00Z",
      event: "Onboarding initiated",
      actor: "RM Desk",
      detail: "Institution package intake opened.",
    },
    {
      id: "TL-2",
      timestamp: "2026-07-15T08:42:00Z",
      event: "Institution Wizard completed",
      actor: "Relationship Management",
      detail: "Core institutional profile confirmed.",
    },
    {
      id: "TL-3",
      timestamp: "2026-07-15T09:15:00Z",
      event: "ORACLE processing completed",
      actor: "Document Intelligence",
      detail: "Extraction artifacts ready for evidence review.",
    },
  ],
  processingTasks: [
    {
      id: "TASK-1",
      title: "Evidence completeness check",
      queue: "Evidence Queue A",
      eta: "12 min",
      status: "running",
    },
    {
      id: "TASK-2",
      title: "Knowledge mapping preflight",
      queue: "Knowledge Queue",
      eta: "18 min",
      status: "queued",
    },
    {
      id: "TASK-3",
      title: "Passport assembly reservation",
      queue: "Passport Queue",
      eta: "Ready after knowledge step",
      status: "ready",
    },
  ],
  recommendations: [
    {
      id: "REC-1",
      priority: "high",
      title: "Resolve missing board appendix",
      detail: "Board appendix is required before evidence can be marked complete.",
    },
    {
      id: "REC-2",
      priority: "medium",
      title: "Pre-stage passport governance profile",
      detail: "Prepare governance profile mapping to reduce downstream turnaround.",
    },
    {
      id: "REC-3",
      priority: "low",
      title: "Schedule journey handoff window",
      detail: "Reserve handoff slot with Journey Ops for same-day transition.",
    },
  ],
  completion: {
    readinessScore: 68,
    nextHandoff: "Knowledge Generation",
    checks: [
      "Mandatory institution identity package verified",
      "ORACLE extraction confidence above threshold",
      "Evidence appendix checklist pending one item",
    ],
  },
};

export default function OnboardingPage() {
  return <CustomerOnboardingWorkspace initialState={ONBOARDING_STATE} />;
}
