import { ApiStep } from "../ipc/api";
import { RunDocument, RunType } from "../ipc/run_document";
import { ApiStepFactory } from "./api_step_factory";
import { RunConfigurationFactory } from "./run_configuration_factory";

export class RunDocumentFactory {
  public static newRunDocument(
    type: RunType,
    uniqueId: string,
    apiStep?: ApiStep
  ): RunDocument {
    console.log({ apiStepInput: apiStep });
    const runDocument: RunDocument = {
      uniqueId,
      title: "",
      type,
      configuration: RunConfigurationFactory.newRunConfiguration(),
      apiSteps: [],
    };
    if (type === RunType.API) {
      //runDocument.apiSteps = [ApiStepFactory.fromCurl(curlPayload).getValue()]
      if (apiStep) {
        runDocument.apiSteps = [apiStep];
      } else {
        runDocument.apiSteps = [ApiStepFactory.new()];
      }
    }
    console.log({ runDocumentFinal: runDocument });
    return runDocument;
  }
}
