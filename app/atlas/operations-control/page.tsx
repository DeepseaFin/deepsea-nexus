import OperationsControlCenter from "@/components/operations/control-center/OperationsControlCenter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Operations Control Center | Deepsea Nexus",
  description: "Operational control workspace for queue management, approvals, and execution bottlenecks.",
};

export default function OperationsControlPage() {
  return <OperationsControlCenter />;
}
