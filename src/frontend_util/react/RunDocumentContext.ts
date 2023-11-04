import { isNil } from "lodash";
import React, { createContext, useContext } from "react";
import shortid from "shortid";
import { RunDocumentFactory } from "../factories/run_document_factory";
import { RunDocument, RunType } from "../ipc/run_document";

export interface RunDocumentAppState {
  runDocument: RunDocument;
  runDocumentPath?: string;
  state: "IDLE" | "LOADING" | "SAVING" | "ERROR" | "PROCESSING" | "READY";
  errors: Record<string, string>;
}

export function runDocumentReducer(
  state: RunDocumentAppState,
  update: Partial<RunDocumentAppState>
) {
  const newState = {
    ...state,
    ...update,
  };
  return newState;
}

export const INITIAL_RUN_DOCUMENT_APP_STATE: RunDocumentAppState = {
  runDocument: RunDocumentFactory.newRunDocument(
    RunType.NONE,
    shortid.generate()
  ),
  state: "LOADING",
  errors: {},
};

export interface IRunDocumentAppContext {
  state: RunDocumentAppState;
  dispatch: React.Dispatch<Partial<RunDocumentAppState>>;
}

export const RunDocumentAppContext = createContext<IRunDocumentAppContext>({
  state: INITIAL_RUN_DOCUMENT_APP_STATE,
  dispatch: () => undefined,
});

export const useAutoSaveContext = () => {
  const { state, dispatch } = useContext(RunDocumentAppContext);
  const autoSaveDispatch = (partial: Partial<RunDocumentAppState>) => {
    dispatch(partial);
  };
};
