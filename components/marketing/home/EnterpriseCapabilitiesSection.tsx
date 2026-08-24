import Card from "@/components/Card";
import SectionFrame from "@/components/marketing/home/SectionFrame";

const CAPABILITY_GRID = [
  "Origination Command",
  "Workflow Coordination",
  "Activity Intelligence",
  "Document Evidence Control",
  "Policy-Aware Validation",
  "Executive Oversight Dashboards",
] as const;

export default function EnterpriseCapabilitiesSection() {
  return (
    <SectionFrame
      id="enterprise-capabilities"
      eyebrow="7. Enterprise Capabilities"
      title="Composable Capabilities for Evolving Institutions"
      description="Capabilities can be activated by workspace context while preserving one coherent interaction model across the institution."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CAPABILITY_GRID.map((capability) => (
          <Card key={capability}>
            <h3 className="text-base font-semibold text-slate-100">{capability}</h3>
            <p className="mt-2 text-sm text-slate-300">
              Delivered through registry-driven workspace manifests so expansion remains controlled and consistent.
            </p>
          </Card>
        ))}
      </div>
    </SectionFrame>
  );
}
