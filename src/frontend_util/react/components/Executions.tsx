import _ from "lodash";
import { useEffect, useState } from "react";
import { ApiClient, IExecution } from "../../../api_client/api_client";
import ExecutionSummary from "./ExecutionSummary";

export default function Executions() {
  const [executions, setExecutions] = useState<IExecution[]>([]);
  const [state, setState] = useState("IDLE");
  const loadExecutions = async () => {
    const { query } = { query: { runId: null } };
    if (_.isNil(query?.runId)) {
      return;
    }
    const apiClient = new ApiClient();
    const executionsOrError = await apiClient.getExecutions(
      query.runId as string
    );
    if (executionsOrError.isFailure) {
      setState("ERROR");
      return;
    }
    setExecutions(executionsOrError.getValue());
  };

  useEffect(() => {
    loadExecutions();
  }, []);

  const renderExecutions = () => {
    return executions.map((execution) => {
      return (
        <ExecutionSummary key={execution.UniqueId} execution={execution} />
      );
    });
  };

  if (executions.length === 0) {
    return <div />;
  }
  return (
    <>
      <div className="container container-narrow mx-auto">
        <div className="row mt-4 mb-4">
          <div className="col-12">
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <h5>Recent runs</h5>
          </div>
        </div>
      </div>
      {renderExecutions()}
    </>
  );
}
