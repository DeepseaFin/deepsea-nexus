export interface DealEvent {
  id: string;
  timestamp: string;
  type:
    | "deal_created"
    | "seller_verified"
    | "pricing_calculated"
    | "credit_started"
    | "credit_approved"
    | "risk_started"
    | "risk_approved"
    | "committee_approved"
    | "documents_uploaded"
    | "funding_completed"
    | "payment_received";
  title: string;
  description: string;
  user: string;
  status: "completed" | "current" | "future";
}
