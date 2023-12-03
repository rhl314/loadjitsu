import _ from "lodash";
import { useContext, useEffect, useState } from "react";
import { ApiClient, IRun } from "../../../api_client/api_client";
import ExecutionSummary from "./ExecutionSummary";
import { RunDocumentAppContext } from "../RunDocumentContext";
import ThumbnailChart from "./ThumbnailChart";
import { useNavigate } from "react-router-dom";

export default function Runs() {
  const navigate = useNavigate();
  const runDocumentAppContext = useContext(RunDocumentAppContext);
  const [executions, setExecutions] = useState<IRun[]>([]);
  const [state, setState] = useState("IDLE");
  const loadExecutions = async () => {
    const apiClient = new ApiClient();

    const executionsOrError = await apiClient.getExecutions({
      runDocumentPath: runDocumentAppContext.state.runDocumentPath as string,
    });
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
      // return <ExecutionSummary key={execution.id} execution={execution} />;
      return (
        <tr
          style={{ border: "none" }}
          onClick={() => {
            navigate(
              `/runs/api/${runDocumentAppContext.state.runDocumentPath}/executions/${execution.id}`
            );
          }}
        >
          <td>http://localhost:3000</td>
          <td>30 rps for 10 seconds</td>
          <td>A few minutes ago</td>
          <td>
            <ThumbnailChart />
          </td>
        </tr>
      );
    });
  };

  if (executions.length === 0) {
    return <div />;
  }
  return (
    <>
      <div className="app_container mx-auto mt-10">
        <div className="grid">
          <div className="tabs z-10 -mb-px">
            <button className="tab tab-lifted tab-active">Past runs</button>
          </div>
          <div className="bg-base-300  relative overflow-x-auto">
            <div className="preview border-base-300 bg-base-100  min-h-[6rem] w-100 gap-2 overflow-x-hidden border bg-cover bg-top p-4">
              <div className="overflow-x-auto">
                <table className="table">
                  <tbody>{renderExecutions()}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
