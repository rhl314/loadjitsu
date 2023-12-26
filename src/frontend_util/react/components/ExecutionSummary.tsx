import * as _ from "lodash";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TimeAgo from "react-time-ago";
import { ApiClient, IExecution } from "../../../api_client/api_client";
import { RunDocument } from "../../ipc/run_document";
import { IExecutionStatusCount } from "../ExecutionContext";
import { RunDocumentAppContext } from "../RunDocumentContext";
import ThumbnailChart from "./ThumbnailChart";
interface ILocalState {
  status: "IDLE" | "LOADING" | "ERROR";
  runDocument?: RunDocument;
  executionStatusCounts?: IExecutionStatusCount[];
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
      });
      if (runDocumentOrError.isFailure) {
        setLocalState({
          ...localState,
          status: "ERROR",
        });
        return;
      }
      const executionStatusCountsOrError =
        await apiClient.getExecutionStatusCounts({
          runDocumentPath: runDocumentAppContext.state
            .runDocumentPath as string,
          executionDocumentId: execution.id,
        });
      if (executionStatusCountsOrError.isFailure) {
        setLocalState({
          ...localState,
          status: "ERROR",
        });
        return;
      }
      const executionStatusCounts = executionStatusCountsOrError.getValue();
      setLocalState({
        ...localState,
        executionStatusCounts,
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
      <td>https://test.loadjitsu.io</td>
      <td>
        {localState?.runDocument?.configuration?.rps} rps for{" "}
        {localState?.runDocument?.configuration?.durationInSeconds} seconds
      </td>
      <td>{<TimeAgo date={new Date(execution.started_at)} />}</td>

      {localState.executionStatusCounts && (
        <td>
          <ThumbnailChart statusCounts={localState.executionStatusCounts} />
        </td>
      )}
    </tr>
  );
}
