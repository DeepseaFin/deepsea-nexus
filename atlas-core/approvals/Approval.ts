export interface Approval {
  id: string;
  stage: string;
  approver: string;
  role: string;
  status: "approved" | "pending" | "waiting" | "rejected";
  decisionDate?: string;
  comments?: string;
  slaHours: number;
}
