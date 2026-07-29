import Card from "@/components/Card";
import SectionFrame from "@/components/marketing/home/SectionFrame";

const DNOS_CAPABILITIES = [
  "Registry-driven workspace composition",
  "Domain-first architecture for institutional modules",
  "Application and presentation layering for controlled evolution",
  "Activity and workflow fabrics for operating memory",
] as const;

export default function DnosSection() {
  return (
    <SectionFrame
      id="dnos"
      eyebrow="4. DNOS"
      title="DNOS: The Architectural Core Behind Every Workspace"
      description="DNOS is the software substrate that powers ATLAS and every institutional workspace. It governs modularity, consistency, and capability expansion across the platform."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {DNOS_CAPABILITIES.map((item) => (
          <Card key={item}>
            <h3 className="text-lg font-semibold text-slate-100">{item}</h3>
            <p className="mt-3 text-sm text-slate-300">
              Built for institutions that require predictable extensibility without sacrificing domain integrity or governance posture.
            </p>
          </Card>
        ))}
      </div>
    </SectionFrame>
  );
}
