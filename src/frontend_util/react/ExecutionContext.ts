import React, { createContext } from "react";
import { RunDocument } from "../ipc/run_document";

export interface IExecutionCountByStatusAndRunSecond {
  count: number;
  created_at: number;
  status: string;
}
export interface ExecutionAppState {
  runDocument?: RunDocument;
  executionDocument?: IExecutionDocument;
  runDocumentPath?: string;
  executionId?: string;
  executionResults?: IExecutionResults;
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
};

export interface IExecutionAppContext {
  state: ExecutionAppState;
  dispatch: React.Dispatch<Partial<ExecutionAppState>>;
}

export const ExecutionAppContext = createContext<IExecutionAppContext>({
  state: INITIAL_EXECUTION_APP_STATE,
  dispatch: () => undefined,
});

export interface IExecutionResults {
  execution_count_by_status: IExecutionCountByStatus[];
  execution_count_by_status_and_run_second: IExecutionCountByStatusAndRunSecond[];
  execution_summary: IExecutionSummary[];
}

export interface IExecutionCountByStatusAndRunSecond {
  status: string;
  run_second: number;
  count: number;
}

export interface IExecutionCountByStatus {
  status: string;
  count: number;
}

export interface IExecutionSummary {
  max_response_time: number;
  avg_response_time: number;
  min_response_time: number;
  max_latency: number;
  avg_latency: number;
  min_latency: number;
}

export interface IExecutionDocument {
  id: string;
  document_revision_id: string;
  pid: string;
  status: string;
  created_at: string;
  completed_at: string;
}
