import React, { useContext } from "react";
import { ApiStep } from "../../../ipc/api";
import { RunDocumentAppContext } from "../../RunDocumentContext";
import ApiStepComponent from "./ApiStep";

export default function ApiSteps() {
    const { state, dispatch } = useContext(RunDocumentAppContext);
    return (
      <div>
        {
          state.runDocument?.apiSteps?.map((apiStep: ApiStep) => {
            return <ApiStepComponent key={apiStep.uniqueId} apiStep={apiStep} onUpdated={(updatedApiStep: ApiStep) => {
                const { runDocument } = state;
                const {apiSteps} = runDocument;
                const index = apiSteps.findIndex((step) => {
                  return step.uniqueId === updatedApiStep.uniqueId;
                })
                apiSteps[index] = updatedApiStep;
                runDocument.apiSteps = apiSteps;
                dispatch({
                  runDocument
                })
            }}/>
          })
        }
      </div>
      
    )
}