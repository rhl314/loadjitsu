import { useContext } from "react";
import { ApiStep } from "../../../ipc/api";
import { RunDocumentAppContext } from "../../RunDocumentContext";
import ApiStepComponent from "./ApiStep";
import { ApiStepValidator } from "../../../../validators/api_step/ApiStepValidator";

export default function ApiSteps() {
  const { state, dispatch } = useContext(RunDocumentAppContext);
  return (
    <div>
      {state.runDocument?.apiSteps?.map((apiStep: ApiStep) => {
        return (
          <ApiStepComponent
            key={apiStep.uniqueId}
            apiStep={apiStep}
            onUpdated={(updatedApiStep: ApiStep) => {
              const { runDocument } = state;
              const { apiSteps } = runDocument;
              const index = apiSteps.findIndex((step) => {
                return step.uniqueId === updatedApiStep.uniqueId;
              });
              apiSteps[index] = updatedApiStep;
              runDocument.apiSteps = apiSteps;
              dispatch({
                runDocument,
              });
            }}
            validate={(apiStep: ApiStep): boolean => {
              const validator = new ApiStepValidator(apiStep);
              const resultsOrError = validator.validate();
              if (resultsOrError.isFailure) {
                return false;
              }
              const valid = resultsOrError.getValue().valid;
              const updatedApiStep = resultsOrError.getValue().apiStep;
              if (valid !== true) {
                const { runDocument } = state;
                const { apiSteps } = runDocument;
                const index = apiSteps.findIndex((step) => {
                  return step.uniqueId === updatedApiStep.uniqueId;
                });
                apiSteps[index] = updatedApiStep;
                runDocument.apiSteps = apiSteps;
                dispatch({
                  runDocument,
                });
              }
              return valid;
            }}
          />
        );
      })}
    </div>
  );
}
