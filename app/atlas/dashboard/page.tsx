import ExecutiveCommandCenter from "@/components/atlas/dashboard/ExecutiveCommandCenter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Executive Command Center | Deepsea Nexus",
  description: "Portfolio oversight workspace for institutional operations, approvals, and intelligence.",
};

export default function DashboardPage() {
  return <ExecutiveCommandCenter />;
}
