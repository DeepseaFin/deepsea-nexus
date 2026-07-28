import type { WorkflowViewModel } from "@/lib/workflow/application/WorkflowViewModel";
import {
  createWorkflowStagePresenter,
  type WorkflowStagePresenter,
} from "@/lib/workflow/presentation/WorkflowStagePresenter";
import {
  createWorkflowSummaryPresenter,
  type WorkflowSummaryPresenter,
} from "@/lib/workflow/presentation/WorkflowSummaryPresenter";
import {
  createWorkflowTaskPresenter,
  type WorkflowTaskPresenter,
} from "@/lib/workflow/presentation/WorkflowTaskPresenter";
import {
  createWorkflowTimelinePresenter,
  type WorkflowTimelinePresenter,
} from "@/lib/workflow/presentation/WorkflowTimelinePresenter";
import type {
  WorkflowPresentationFormatOptions,
  WorkflowPresentationModel,
} from "@/lib/workflow/presentation/WorkflowPresentationModel";

export interface WorkflowPresentationAssemblerDependencies {
  readonly stagePresenter: WorkflowStagePresenter;
  readonly taskPresenter: WorkflowTaskPresenter;
  readonly timelinePresenter: WorkflowTimelinePresenter;
  readonly summaryPresenter: WorkflowSummaryPresenter;
}

export interface WorkflowPresentationAssemblerInput {
  readonly viewModel: WorkflowViewModel;
  readonly options?: WorkflowPresentationFormatOptions;
}

export interface WorkflowPresentationAssembler {
  assemble(input: WorkflowPresentationAssemblerInput): WorkflowPresentationModel;
}

function formatGeneratedAt(isoTimestamp: string, options?: WorkflowPresentationFormatOptions): string {
  const parsed = Date.parse(isoTimestamp);
  if (Number.isNaN(parsed)) {
    return isoTimestamp;
  }

  return new Intl.DateTimeFormat(options?.locale ?? "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: options?.timeZone,
  }).format(new Date(parsed));
}

export function createWorkflowPresentationAssembler(
  dependencies: WorkflowPresentationAssemblerDependencies = {
    stagePresenter: createWorkflowStagePresenter(),
    taskPresenter: createWorkflowTaskPresenter(),
    timelinePresenter: createWorkflowTimelinePresenter(),
    summaryPresenter: createWorkflowSummaryPresenter(),
  },
): WorkflowPresentationAssembler {
  return {
    assemble(input: WorkflowPresentationAssemblerInput): WorkflowPresentationModel {
      const options = input.options;
      const viewModel = input.viewModel;

      return {
        generatedAtIso: viewModel.generatedAt,
        generatedAtDisplay: formatGeneratedAt(viewModel.generatedAt, options),
        workflowId: viewModel.workflowId,
        title: viewModel.name,
        subtitle: viewModel.description ?? "Workflow presentation model ready for UI composition.",
        revisionLabel: `Revision ${viewModel.revision}`,
        stage: dependencies.stagePresenter.present(viewModel, options),
        summary: dependencies.summaryPresenter.present(viewModel, options),
        tasks: dependencies.taskPresenter.present(viewModel, options),
        timeline: dependencies.timelinePresenter.present(viewModel, options),
        milestoneCountLabel: `${viewModel.milestones.length} milestone(s)`,
        assignmentCountLabel: `${viewModel.assignments.length} assignment(s)`,
        validationWarnings: viewModel.validationIssues.map((item) => item.message),
      };
    },
  };
}
