import type {
  BuildInstitutionContextInput,
  InstitutionContextBuilder,
} from "@/lib/workspaces/InstitutionContextBuilder";
import { createInstitutionContextBuilder } from "@/lib/workspaces/InstitutionContextBuilder";
import type { InstitutionContext } from "@/lib/workspaces/InstitutionContext";

export interface InstitutionContextProvider {
  provide(input: BuildInstitutionContextInput): InstitutionContext;
}

export function createInstitutionContextProvider(
  builder: InstitutionContextBuilder = createInstitutionContextBuilder(),
): InstitutionContextProvider {
  return {
    provide(input: BuildInstitutionContextInput): InstitutionContext {
      return builder.build(input);
    },
  };
}
