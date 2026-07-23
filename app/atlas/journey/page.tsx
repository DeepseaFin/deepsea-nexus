import JourneyWorkspace from "@/src/capabilities/journey/components/JourneyWorkspace";
import {
  getJourneyWorkspacePipelineProjection,
} from "@/src/capabilities/journey/adapters/getJourneyWorkspacePipelineProjection";
import {
  getJourneyWorkspaceProjection,
} from "@/src/capabilities/journey/adapters/getJourneyWorkspaceProjection";

export default async function JourneyPage() {
  const { pipelineResult } = await getJourneyWorkspacePipelineProjection();
  const projection = getJourneyWorkspaceProjection(pipelineResult);

  return (
    <JourneyWorkspace projection={projection} />
  );
}