import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TimeAgo from "react-time-ago";
import { ApiClient, IExecution } from "../../../api_client/api_client";
import { RunDocument } from "../../ipc/run_document";
import { RunDocumentAppContext } from "../RunDocumentContext";
import ThumbnailChart from "./ThumbnailChart";
import { IExecutionResults } from "../ExecutionContext";
interface ILocalState {
  status: "IDLE" | "LOADING" | "ERROR";
  runDocument?: RunDocument;
  executionResults?: IExecutionResults;
}

export default function ExecutionSummary({
  execution,
}: {
  execution: IExecution;
}) {
  const [localState, setLocalState] = useState<ILocalState>({
    status: "IDLE",
  });
  const navigate = useNavigate();
  const runDocumentAppContext = useContext(RunDocumentAppContext);
  const loadExecution = async () => {
    try {
      const apiClient = new ApiClient();
      const runDocumentOrError = await apiClient.getRunDocumentByRevisionId({
        runDocumentPath: runDocumentAppContext.state.runDocumentPath as string,
        documentRevisionId: execution.document_revision_id,
        runMigrations: false,
      });
      if (runDocumentOrError.isFailure) {
        setLocalState({
          ...localState,
          status: "ERROR",
        });
        return;
      }
      const executionResultOrError = await apiClient.getExecutionResults({
        runDocumentPath: runDocumentAppContext.state.runDocumentPath as string,
        executionDocumentId: execution.id,
      });
      if (executionResultOrError.isFailure) {
        setLocalState({
          ...localState,
          status: "ERROR",
        });
        return;
      }
      const executionStatusCounts = executionResultOrError.getValue();
      setLocalState({
        ...localState,
        executionResults: executionStatusCounts,
        runDocument: runDocumentOrError.getValue(),
      });
    } catch (err) {
      setLocalState({
        ...localState,
        status: "ERROR",
      });
    }
  };
  useEffect(() => {
    loadExecution();
  }, []);
  return (
    <tr
      style={{ border: "none" }}
      onClick={() => {
        navigate(
          `/runs/api/${runDocumentAppContext.state.runDocumentPath}/executions/${execution.id}`
        );
      }}
    >
      <td>{localState?.runDocument?.title || "Untitled load test"}</td>
      <td>
        {localState?.runDocument?.configuration?.rps} rps for{" "}
        {localState?.runDocument?.configuration?.durationInSeconds} seconds
      </td>
      <td>{<TimeAgo date={new Date(execution.started_at)} />}</td>

      {localState.executionResults && (
        <td>
          <ThumbnailChart
            statusCounts={
              localState.executionResults
                ?.execution_count_by_status_and_run_second
            }
          />
        </td>
      )}
    </tr>
  );
}
