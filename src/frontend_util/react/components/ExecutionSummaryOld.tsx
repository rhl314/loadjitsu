import JSTimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import * as _ from "lodash";
import { useEffect, useState } from "react";
import TimeAgo from "react-time-ago";
import {
  ApiClient,
  IExecution,
  IResponseTimes,
  IResultStatus,
  IStatusGroup,
} from "../../../api_client/api_client";
import { RunDocument, runTypeToJSON } from "../../ipc/run_document";
import Chart from "./ChartThumb";

JSTimeAgo.addDefaultLocale(en);

export default function ExecutionSummary(props: { execution: IExecution }) {
  const document = RunDocument.decode(
    Buffer.from(props.execution.RunDocument, "base64")
  );

  const [state, setState] = useState("IDLE");

  const [error, setError] = useState<string>("");
  const [running, setRunning] = useState<boolean>(false);

  const [resultStatuses, setResultStatuses] = useState<IResultStatus[]>([]);
  const [statusGroups, setStatusGroups] = useState<IStatusGroup[]>([]);

  const [responseTimes, setResponseTimes] = useState<IResponseTimes>({
    Min: 0,
    Max: 0,
    Avg: 0,
  });
  let timer: ReturnType<typeof setTimeout>;

  const loadResults = async () => {
    const apiClient = new ApiClient();
    const executionResultOrError = await apiClient.getResults(
      props.execution.DocumentUniqueId,
      props.execution.id
    );
    if (executionResultOrError.isFailure) {
      setState("ERROR");
      return setError("Something went wrong while getting test results");
    }
    setResultStatuses(executionResultOrError.getValue().statuses);
    setRunning(executionResultOrError.getValue().running);
    setResponseTimes(executionResultOrError.getValue().times);
    setStatusGroups(executionResultOrError.getValue().statusGroups);
    setState("SUCCESS");
  };

  const statusCounts = (): {
    total: number;
    success: number;
    timeouts: number;
    errors: number;
  } => {
    let total = 0;
    let success = 0;
    let timeouts = 0;
    let errors = 0;
    _.map(statusGroups, (statusGroup) => {
      total += statusGroup.Count;
      if (statusGroup.Status === "SUCCESS") {
        success += statusGroup.Count;
      } else if (statusGroup.Status === "TIMEOUT") {
        timeouts += statusGroup.Count;
      } else {
        errors += statusGroup.Count;
      }
    });
    return {
      total,
      success,
      timeouts,
      errors,
    };
  };

  useEffect(() => {
    loadResults();
  }, []);

  if (state !== "SUCCESS") {
    return <div />;
  }

  const counts = statusCounts();

  return (
    <div
      onClick={() => {
        /*router.push(
          `/run/${runTypeToJSON(document.type)}/${
            props.execution.DocumentUniqueId
          }/runs/${props.execution.UniqueId}`
        );*/
      }}
      className="container container-narrow mx-auto mt-4"
      style={{ cursor: "pointer" }}
    >
      <div className="row">
        <div className="col-12">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <div className="nav-link active">
                <TimeAgo
                  date={new Date(props.execution.CreatedAt)}
                  locale="en-US"
                />
              </div>
            </li>
          </ul>
          <div className="card mb-3">
            <div className="row no-gutters">
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body pt-4">
                    <Chart statuses={resultStatuses} />
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <div className="card-body h-100">
                  <div className="container-fluid h-100">
                    <div className="row h-100">
                      <div className="col-3 my-auto text-center">
                        <h4>{counts.total}</h4>
                        <p>Total requests</p>
                      </div>
                      <div className="col-3 my-auto text-center">
                        <h4>{counts.success}</h4>
                        <p>Successful</p>
                      </div>
                      <div className="col-3 my-auto text-center">
                        <h4>{counts.timeouts}</h4>
                        <p>Timeouts</p>
                      </div>
                      <div className="col-3 my-auto text-center">
                        <h4>{counts.errors}</h4>
                        <p>Exceptions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
