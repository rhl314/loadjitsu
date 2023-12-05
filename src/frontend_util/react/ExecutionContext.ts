import React, { createContext, useContext } from "react";

export interface IExecutionStatusCount {
  count: number;
  created_at: number;
  status: string;
}
export interface ExecutionAppState {
  runDocumentPath?: string;
  executionId?: string;
  executionStatusCounts: IExecutionStatusCount[];
  state: "IDLE" | "LOADING" | "SAVING" | "ERROR" | "PROCESSING" | "READY";
  errors: Record<string, string>;
}

export function executionReducer(
  state: ExecutionAppState,
  update: Partial<ExecutionAppState>
) {
  const newState = {
    ...state,
    ...update,
  };
  return newState;
}

export const INITIAL_EXECUTION_APP_STATE: ExecutionAppState = {
  state: "LOADING",
  errors: {},
  executionStatusCounts: [],
};

export interface IExecutionAppContext {
  state: ExecutionAppState;
  dispatch: React.Dispatch<Partial<ExecutionAppState>>;
}

export const ExecutionAppContext = createContext<IExecutionAppContext>({
  state: INITIAL_EXECUTION_APP_STATE,
  dispatch: () => undefined,
});

export const useAutoSaveContext = () => {
  const { state, dispatch } = useContext(ExecutionAppContext);
  const autoSaveDispatch = (partial: Partial<ExecutionAppState>) => {
    dispatch(partial);
  };
};
