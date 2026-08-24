import { createActivity, type Activity, type ActivityInput } from "@/lib/activity/Activity";
import type { ActivityMetadata } from "@/lib/activity/ActivityMetadata";
import { ActivitySeverity } from "@/lib/activity/ActivitySeverity";
import type {
  ActivityOperationResult,
  ActivityTimestamp,
  ActivityValidationIssue,
  ActivityValidationResult,
} from "@/lib/activity/types";

export class ActivityDomainError extends Error {
  readonly issues: readonly ActivityValidationIssue[];

  constructor(message: string, issues: readonly ActivityValidationIssue[]) {
    super(message);
    this.name = "ActivityDomainError";
    this.issues = issues;
  }
}

function issue(code: string, message: string, target?: string): ActivityValidationIssue {
  return { code, message, target };
}

function validationResult(issues: readonly ActivityValidationIssue[]): ActivityValidationResult {
  return { valid: issues.length === 0, issues };
}

function assertValid(result: ActivityValidationResult, message: string): void {
  if (!result.valid) {
    throw new ActivityDomainError(message, result.issues);
  }
}

function nowTimestamp(occurredAt?: ActivityTimestamp): ActivityTimestamp {
  return occurredAt ?? new Date().toISOString();
}

function rankSeverity(severity: ActivitySeverity): number {
  if (severity === ActivitySeverity.Low) {
    return 0;
  }

  if (severity === ActivitySeverity.Medium) {
    return 1;
  }

  if (severity === ActivitySeverity.High) {
    return 2;
  }

  return 3;
}

function toOperationResult(activity: Activity): ActivityOperationResult<Activity> {
  return {
    value: activity,
    validation: ActivityService.validateActivity(activity),
  };
}

export class ActivityService {
  static createActivity(input: ActivityInput): ActivityOperationResult<Activity> {
    const activity = createActivity(input);
    const validation = this.validateActivity(activity);
    assertValid(validation, "Activity is invalid.");

    return {
      value: activity,
      validation,
    };
  }

  static validateActivity(activity: Activity): ActivityValidationResult {
    const issues: ActivityValidationIssue[] = [];

    if (!activity.activityId.trim()) {
      issues.push(issue("activity_id_required", "Activity id is required.", "activityId"));
    }

    if (!activity.actor.actorId.trim()) {
      issues.push(issue("activity_actor_required", "Activity actor id is required.", "actor.actorId"));
    }

    if (!activity.actor.displayName.trim()) {
      issues.push(issue("activity_actor_name_required", "Activity actor display name is required.", "actor.displayName"));
    }

    if (!activity.target.targetId.trim()) {
      issues.push(issue("activity_target_required", "Activity target id is required.", "target.targetId"));
    }

    if (!activity.context.institutionId.trim()) {
      issues.push(issue("activity_context_institution_required", "Institution id is required.", "context.institutionId"));
    }

    if (!activity.context.module.trim()) {
      issues.push(issue("activity_context_module_required", "Activity module is required.", "context.module"));
    }

    if (!activity.context.source.trim()) {
      issues.push(issue("activity_context_source_required", "Activity source is required.", "context.source"));
    }

    if (!activity.metadata.title.trim()) {
      issues.push(issue("activity_title_required", "Activity metadata title is required.", "metadata.title"));
    }

    const occurredAt = Date.parse(activity.occurredAt);
    const createdAt = Date.parse(activity.createdAt);
    const updatedAt = Date.parse(activity.updatedAt);

    if (!Number.isNaN(createdAt) && !Number.isNaN(updatedAt) && updatedAt < createdAt) {
      issues.push(issue("activity_updated_before_created", "Updated timestamp cannot be earlier than created timestamp.", "updatedAt"));
    }

    if (!Number.isNaN(occurredAt) && !Number.isNaN(createdAt) && occurredAt < createdAt) {
      issues.push(issue("activity_occurred_before_created", "Occurred timestamp cannot be earlier than created timestamp.", "occurredAt"));
    }

    if (activity.acknowledged) {
      if (!activity.acknowledgedAt) {
        issues.push(issue("activity_acknowledged_at_required", "Acknowledged activities must provide acknowledgedAt.", "acknowledgedAt"));
      }

      if (!activity.acknowledgedBy?.trim()) {
        issues.push(issue("activity_acknowledged_by_required", "Acknowledged activities must provide acknowledgedBy.", "acknowledgedBy"));
      }
    }

    if (activity.revision < 0) {
      issues.push(issue("activity_revision_invalid", "Revision cannot be negative.", "revision"));
    }

    return validationResult(issues);
  }

  static acknowledge(
    activity: Activity,
    acknowledgedBy: string,
    acknowledgedAt?: ActivityTimestamp,
  ): ActivityOperationResult<Activity> {
    if (!acknowledgedBy.trim()) {
      throw new ActivityDomainError("Acknowledged by is required.", [
        issue("activity_acknowledged_by_required", "Acknowledged by is required.", "acknowledgedBy"),
      ]);
    }

    const timestamp = nowTimestamp(acknowledgedAt);
    return toOperationResult({
      ...activity,
      acknowledged: true,
      acknowledgedBy,
      acknowledgedAt: timestamp,
      updatedAt: timestamp,
      revision: activity.revision + 1,
    });
  }

  static escalateSeverity(
    activity: Activity,
    nextSeverity: ActivitySeverity,
    occurredAt?: ActivityTimestamp,
  ): ActivityOperationResult<Activity> {
    if (rankSeverity(nextSeverity) < rankSeverity(activity.severity)) {
      throw new ActivityDomainError("Activity severity cannot be downgraded by escalateSeverity.", [
        issue("activity_severity_downgrade_not_allowed", "Escalation cannot downgrade severity.", "severity"),
      ]);
    }

    const timestamp = nowTimestamp(occurredAt);
    return toOperationResult({
      ...activity,
      severity: nextSeverity,
      updatedAt: timestamp,
      revision: activity.revision + 1,
    });
  }

  static replaceMetadata(
    activity: Activity,
    metadata: ActivityMetadata,
    occurredAt?: ActivityTimestamp,
  ): ActivityOperationResult<Activity> {
    const timestamp = nowTimestamp(occurredAt);
    return toOperationResult({
      ...activity,
      metadata: {
        ...metadata,
        tags: [...metadata.tags],
      },
      updatedAt: timestamp,
      revision: activity.revision + 1,
    });
  }
}
