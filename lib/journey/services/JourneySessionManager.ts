import type { JourneyStep } from "@/lib/journey/constants/JourneyStep";
import type { BusinessId } from "@/lib/journey/domain/Journey";
import type { JourneyId } from "@/lib/journey/domain/Journey";
import type { JourneyExecutionContext } from "@/lib/journey/types/JourneyExecutionContext";
import type { JourneyResumePoint } from "@/lib/journey/types/JourneyResumePoint";
import type { JourneySession } from "@/lib/journey/types/JourneySession";

export interface CreateJourneySessionInput {
  readonly sessionId: string;
  readonly journeyId: JourneyId;
  readonly businessId: BusinessId;
  readonly activeStep: JourneyStep;
  readonly actor: string;
  readonly startedAt: string;
}

export interface JourneySessionManager {
  create(input: CreateJourneySessionInput): JourneySession;
  touch(session: JourneySession, context: JourneyExecutionContext, nextStep?: JourneyStep): JourneySession;
  resume(session: JourneySession, context: JourneyExecutionContext, resumePoint: JourneyResumePoint): JourneySession;
  close(session: JourneySession, endedAt: string): JourneySession;
}

export function createJourneySessionManager(): JourneySessionManager {
  return {
    create(input: CreateJourneySessionInput): JourneySession {
      return {
        sessionId: input.sessionId,
        journeyId: input.journeyId,
        businessId: input.businessId,
        activeStep: input.activeStep,
        startedAt: input.startedAt,
        actor: input.actor,
      };
    },

    touch(session: JourneySession, context: JourneyExecutionContext, nextStep?: JourneyStep): JourneySession {
      return {
        ...session,
        activeStep: nextStep ?? session.activeStep,
      };
    },

    resume(session: JourneySession, context: JourneyExecutionContext, resumePoint: JourneyResumePoint): JourneySession {
      return {
        ...session,
        activeStep: resumePoint.step,
        actor: context.actor,
      };
    },

    close(session: JourneySession, endedAt: string): JourneySession {
      return {
        ...session,
        endedAt,
      };
    },
  };
}