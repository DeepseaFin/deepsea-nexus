export enum DecisionAuditActorType {
  System = "system",
  User = "user",
  Service = "service",
}

export interface DecisionAuditActor {
  readonly actorId: string;
  readonly actorType: DecisionAuditActorType;
  readonly displayName: string;
}
